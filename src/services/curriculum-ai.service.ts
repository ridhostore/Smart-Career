import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL } from "@/lib/constants";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export interface CurriculumInsight {
  weakCourses: string[];
  strongCourses: string[];
  biggestSkillGaps: string[];
  industryDemands: string[];
  curriculumRecommendations: string[];
  teacherTrainingRecommendations: string[];
  institutionalCertifications: string[];
  markdownReport: string;
}

/**
 * Build aggregated data prompt for curriculum analysis
 */
function buildCurriculumPrompt(universityId: string, stats: UniversityAggregateStats): string {
  return `Kamu adalah Education AI Consultant yang menganalisis data akademik universitas untuk memberikan rekomendasi perbaikan kurikulum.

## Data Universitas
- University ID: ${universityId}
- Total Mahasiswa: ${stats.totalStudents}
- Rata-rata IPK: ${stats.averageGpa.toFixed(2)}
- Rata-rata Career Score: ${stats.averageCareerScore.toFixed(1)}/100

## Performa Mata Kuliah (Dari Tertinggi ke Terendah)
${stats.coursePerformance
  .map(
    (c, i) =>
      `${i + 1}. ${c.courseName}: rata-rata ${c.averageGrade.toFixed(1)} (${c.totalStudents} mahasiswa)`,
  )
  .join("\n")}

## Distribusi Target Karir
${stats.careerDistribution
  .map((c) => `- ${c.careerName}: ${c.count} mahasiswa (${c.percentage.toFixed(1)}%)`)
  .join("\n")}

## Skill Gap Agregat (AI Recommendations)
${stats.topSkillGaps.slice(0, 10).join(", ")}

## Instruksi
Analisis data di atas dan hasilkan laporan markdown profesional dengan format:

# Laporan Analisis Kurikulum

## Ringkasan Eksekutif

## Mata Kuliah yang Perlu Perhatian
(berdasarkan nilai rata-rata di bawah 70)

## Mata Kuliah Unggulan
(berdasarkan nilai rata-rata di atas 80)

## Skill Gap Terbesar
(skill yang paling sering muncul di rekomendasi AI)

## Kebutuhan Industri
(berdasarkan target karir mahasiswa dan data industri Indonesia 2024-2025)

## Rekomendasi Revisi Kurikulum
(minimal 5 poin spesifik dan actionable)

## Rekomendasi Pelatihan Dosen
(minimal 3 program pelatihan yang spesifik)

## Rekomendasi Sertifikasi Institusi
(minimal 3 sertifikasi yang bisa diraih kampus)

---
*Laporan dibuat oleh Industry Mirror AI pada ${new Date().toLocaleDateString("id-ID")}*`;
}

interface UniversityAggregateStats {
  totalStudents: number;
  averageGpa: number;
  averageCareerScore: number;
  coursePerformance: { courseName: string; averageGrade: number; totalStudents: number }[];
  careerDistribution: { careerName: string; count: number; percentage: number }[];
  topSkillGaps: string[];
}

/**
 * Aggregate university statistics for AI analysis
 */
async function aggregateUniversityStats(universityId: string): Promise<UniversityAggregateStats> {
  // Total students
  const totalStudents = await prisma.studentProfile.count({
    where: {
      deletedAt: null,
      studyProgram: { universityId },
    },
  });

  // Average GPA
  const gpaResult = await prisma.studentProfile.aggregate({
    where: {
      deletedAt: null,
      studyProgram: { universityId },
    },
    _avg: { gpa: true },
  });

  // Average career score
  const scoreResult = await prisma.careerScore.aggregate({
    where: {
      deletedAt: null,
      studentProfile: {
        studyProgram: { universityId },
      },
    },
    _avg: { score: true },
  });

  // Course performance
  const gradeGroups = await prisma.studentGrade.groupBy({
    by: ["courseId"],
    where: {
      deletedAt: null,
      studentProfile: {
        studyProgram: { universityId },
        deletedAt: null,
      },
    },
    _avg: { numericGrade: true },
    _count: { id: true },
  });

  const courseIds = gradeGroups.map((g) => g.courseId);
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
    select: { id: true, name: true },
  });

  const courseMap = new Map(courses.map((c) => [c.id, c.name]));

  const coursePerformance = gradeGroups
    .map((g) => ({
      courseName: courseMap.get(g.courseId) ?? "Unknown",
      averageGrade: Number(g._avg.numericGrade ?? 0),
      totalStudents: g._count.id,
    }))
    .sort((a, b) => a.averageGrade - b.averageGrade);

  // Career distribution
  const careerGroups = await prisma.studentProfile.groupBy({
    by: ["careerTargetId"],
    where: {
      deletedAt: null,
      careerTargetId: { not: null },
      studyProgram: { universityId },
    },
    _count: { id: true },
  });

  const careerTargetIds = careerGroups
    .map((g) => g.careerTargetId)
    .filter(Boolean) as string[];
  const careerTargets = await prisma.careerTarget.findMany({
    where: { id: { in: careerTargetIds } },
    select: { id: true, name: true },
  });

  const careerMap = new Map(careerTargets.map((c) => [c.id, c.name]));
  const careerTotal = careerGroups.reduce((sum, g) => sum + g._count.id, 0);

  const careerDistribution = careerGroups.map((g) => ({
    careerName: careerMap.get(g.careerTargetId ?? "") ?? "Unknown",
    count: g._count.id,
    percentage: careerTotal > 0 ? (g._count.id / careerTotal) * 100 : 0,
  }));

  // Top skill gaps from AI recommendations
  const aiRecs = await prisma.aiRecommendation.findMany({
    where: {
      deletedAt: null,
      studentProfile: {
        studyProgram: { universityId },
        deletedAt: null,
      },
    },
    select: { skillGap: true },
    take: 100,
  });

  const skillGapCounts = new Map<string, number>();
  for (const rec of aiRecs) {
    const gaps = rec.skillGap as string[];
    for (const gap of gaps) {
      skillGapCounts.set(gap, (skillGapCounts.get(gap) ?? 0) + 1);
    }
  }

  const topSkillGaps = [...skillGapCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([gap]) => gap);

  return {
    totalStudents,
    averageGpa: Number(gpaResult._avg.gpa ?? 0),
    averageCareerScore: Number(scoreResult._avg.score ?? 0),
    coursePerformance,
    careerDistribution,
    topSkillGaps,
  };
}

/**
 * Generate AI curriculum improvement report for a university
 */
export async function generateCurriculumInsight(universityId: string): Promise<CurriculumInsight> {
  const stats = await aggregateUniversityStats(universityId);
  const prompt = buildCurriculumPrompt(universityId, stats);

  let markdownReport = "";

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_PRIMARY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 4096,
    });
    markdownReport = completion.choices[0]?.message?.content ?? "";
  } catch {
    const completion = await groq.chat.completions.create({
      model: GROQ_FALLBACK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 3000,
    });
    markdownReport = completion.choices[0]?.message?.content ?? "";
  }

  // Extract structured data from stats for the return object
  const weakCourses = stats.coursePerformance
    .filter((c) => c.averageGrade < 70)
    .map((c) => c.courseName);

  const strongCourses = stats.coursePerformance
    .filter((c) => c.averageGrade >= 80)
    .map((c) => c.courseName);

  return {
    weakCourses,
    strongCourses,
    biggestSkillGaps: stats.topSkillGaps.slice(0, 5),
    industryDemands: stats.careerDistribution.map((c) => c.careerName),
    curriculumRecommendations: [],
    teacherTrainingRecommendations: [],
    institutionalCertifications: [],
    markdownReport,
  };
}
