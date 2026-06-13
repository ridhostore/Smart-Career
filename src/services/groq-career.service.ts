import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL, AI_CACHE_HOURS } from "@/lib/constants";
import { z } from "zod";
import type { AiRecommendationOutput } from "@/types";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// ============================================================
// OUTPUT SCHEMA
// ============================================================

const aiOutputSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  skill_gap: z.array(z.string()),
  certifications: z.array(
    z.object({
      name: z.string(),
      provider: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      url: z.string().optional(),
    }),
  ),
  courses: z.array(
    z.object({
      name: z.string(),
      platform: z.string(),
      duration: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      url: z.string().optional(),
    }),
  ),
  roadmap: z.array(
    z.object({
      phase: z.string(),
      duration: z.string(),
      actions: z.array(z.string()),
    }),
  ),
});

// ============================================================
// PROMPT BUILDER
// ============================================================

function buildCareerPrompt(
  studentName: string,
  studyProgram: string,
  careerTarget: string,
  grades: { courseName: string; grade: number; weight: number }[],
  careerFitScore: number,
): string {
  const gradeList = grades
    .map((g) => `- ${g.courseName}: ${g.grade}/100 (bobot: ${g.weight.toFixed(0)}%)`)
    .join("\n");

  return `Kamu adalah Career Advisor AI untuk mahasiswa ekonomi Indonesia.

Analisis profil mahasiswa berikut dan berikan rekomendasi pengembangan karir yang spesifik dan actionable.

## Data Mahasiswa
- Nama: ${studentName}
- Program Studi: ${studyProgram}
- Target Karir: ${careerTarget}
- Career Fit Score: ${careerFitScore.toFixed(1)}/100

## Nilai Mata Kuliah (Berkaitan dengan Target Karir)
${gradeList}

## Instruksi
Berikan analisis mendalam berdasarkan data di atas. Fokus pada:
1. Identifikasi kekuatan berdasarkan nilai tinggi (>= 80)
2. Identifikasi kelemahan berdasarkan nilai rendah (< 80)
3. Skill gap spesifik untuk posisi ${careerTarget}
4. Sertifikasi yang relevan dan diakui industri Indonesia
5. Kursus online yang actionable (Coursera, LinkedIn Learning, Udemy, dll)
6. Roadmap belajar yang realistis (3-6 bulan)

## Format Output
Kembalikan HANYA JSON valid dengan struktur berikut (tidak ada teks lain):
{
  "strengths": ["kekuatan 1", "kekuatan 2"],
  "weaknesses": ["kelemahan 1", "kelemahan 2"],
  "skill_gap": ["skill gap 1", "skill gap 2"],
  "certifications": [
    {"name": "Nama Sertifikasi", "provider": "Lembaga", "priority": "high|medium|low", "url": "https://..."}
  ],
  "courses": [
    {"name": "Nama Kursus", "platform": "Platform", "duration": "Durasi", "priority": "high|medium|low", "url": "https://..."}
  ],
  "roadmap": [
    {"phase": "Fase 1: Foundation", "duration": "1-2 bulan", "actions": ["aksi 1", "aksi 2"]}
  ]
}`;
}

// ============================================================
// MAIN SERVICE
// ============================================================

/**
 * Generate AI career recommendation with caching
 * Returns cached result if < 24h old
 */
export async function generateCareerRecommendation(
  studentProfileId: string,
  careerTargetName: string,
  forceRefresh = false,
): Promise<AiRecommendationOutput> {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = await prisma.aiRecommendation.findFirst({
      where: {
        studentProfileId,
        careerTargetName,
        deletedAt: null,
        generatedAt: {
          gte: new Date(Date.now() - AI_CACHE_HOURS * 60 * 60 * 1000),
        },
      },
      orderBy: { generatedAt: "desc" },
    });

    if (cached) {
      return {
        strengths: cached.strengths as string[],
        weaknesses: cached.weaknesses as string[],
        skill_gap: cached.skillGap as string[],
        certifications: cached.certifications as unknown as AiRecommendationOutput["certifications"],
        courses: cached.courses as unknown as AiRecommendationOutput["courses"],
        roadmap: cached.roadmap as unknown as AiRecommendationOutput["roadmap"],
      };
    }
  }

  // Fetch student data
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      user: true,
      studyProgram: true,
      careerTarget: {
        include: {
          careerWeights: {
            where: { deletedAt: null },
            include: { course: true },
          },
        },
      },
      studentGrades: {
        where: { deletedAt: null },
        include: { course: true },
      },
    },
  });

  if (!studentProfile) throw new Error("Student profile not found");

  // Build grade list with weights
  const grades = studentProfile.careerTarget?.careerWeights.map((w) => {
    const grade = studentProfile.studentGrades.find((g) => g.courseId === w.courseId);
    return {
      courseName: w.course.name,
      grade: grade ? Number(grade.numericGrade) : 0,
      weight: Number(w.weight) * 100,
    };
  }) ?? [];

  const careerFitScore =
    await prisma.careerScore
      .findFirst({
        where: {
          studentProfileId,
          careerTarget: { name: careerTargetName },
          deletedAt: null,
        },
      })
      .then((s) => Number(s?.score ?? 0));

  const prompt = buildCareerPrompt(
    studentProfile.user.fullName,
    studentProfile.studyProgram.name,
    careerTargetName,
    grades,
    careerFitScore,
  );

  // Call Groq with fallback
  let rawResponse = "";
  let modelUsed = GROQ_PRIMARY_MODEL;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_PRIMARY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });
    rawResponse = completion.choices[0]?.message?.content ?? "{}";
  } catch {
    // Fallback to smaller model
    modelUsed = GROQ_FALLBACK_MODEL;
    const completion = await groq.chat.completions.create({
      model: GROQ_FALLBACK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });
    rawResponse = completion.choices[0]?.message?.content ?? "{}";
  }

  // Parse and validate output
  const parsed = JSON.parse(rawResponse);
  const validated = aiOutputSchema.parse(parsed);

  // Save to database
  await prisma.aiRecommendation.create({
    data: {
      studentProfileId,
      careerTargetName,
      strengths: validated.strengths,
      weaknesses: validated.weaknesses,
      skillGap: validated.skill_gap,
      certifications: validated.certifications as object[],
      courses: validated.courses as object[],
      roadmap: validated.roadmap as object[],
      rawResponse,
      model: modelUsed,
    },
  });

  return validated;
}
