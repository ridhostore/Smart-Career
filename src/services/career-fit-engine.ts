import { prisma } from "@/lib/prisma";
import { CAREER_FIT_CATEGORIES } from "@/lib/constants";

export type CareerFitCategory = keyof typeof CAREER_FIT_CATEGORIES;

export interface CareerFitResult {
  careerTargetId: string;
  careerTargetName: string;
  score: number;
  category: CareerFitCategory;
  categoryLabel: string;
  categoryLabelId: string;
  color: string;
  weightedGrades: WeightedGradeDetail[];
}

export interface WeightedGradeDetail {
  courseId: string;
  courseName: string;
  grade: number;
  weight: number;
  weightedScore: number;
}

/**
 * Determines career fit category based on score (0-100)
 */
export function getCareerFitCategory(score: number): CareerFitCategory {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "moderate";
  if (score >= 60) return "weak";
  return "poor";
}

/**
 * Computes career fit score for a student against a specific career target
 * Formula: Σ(grade × weight) / Σ(weight) × 100, normalized to 0-100
 */
export function computeCareerScore(
  grades: { courseId: string; grade: number }[],
  weights: { courseId: string; weight: number }[],
): number {
  const gradeMap = new Map(grades.map((g) => [g.courseId, g.grade]));

  let weightedSum = 0;
  let totalWeight = 0;

  for (const { courseId, weight } of weights) {
    const grade = gradeMap.get(courseId);
    if (grade !== undefined) {
      weightedSum += grade * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;

  // Normalize to 0-100
  const rawScore = weightedSum / totalWeight;
  return Math.min(100, Math.max(0, Number(rawScore.toFixed(2))));
}

/**
 * Full career fit analysis for a student profile
 */
export async function analyzeCareerFit(studentProfileId: string): Promise<CareerFitResult[]> {
  // Get student's grades
  const studentGrades = await prisma.studentGrade.findMany({
    where: {
      studentProfileId,
      deletedAt: null,
    },
    include: {
      course: true,
    },
  });

  // Get student's study program
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      studyProgram: {
        include: {
          careerTargets: {
            where: { deletedAt: null },
            include: {
              careerWeights: {
                where: { deletedAt: null },
                include: { course: true },
              },
            },
          },
        },
      },
    },
  });

  if (!studentProfile) throw new Error("Student profile not found");

  const grades = studentGrades.map((g) => ({
    courseId: g.courseId,
    grade: Number(g.numericGrade),
  }));

  const results: CareerFitResult[] = [];

  for (const careerTarget of studentProfile.studyProgram.careerTargets) {
    const weights = careerTarget.careerWeights.map((w) => ({
      courseId: w.courseId,
      weight: Number(w.weight),
    }));

    const score = computeCareerScore(grades, weights);
    const category = getCareerFitCategory(score);
    const categoryInfo = CAREER_FIT_CATEGORIES[category];

    const weightedGrades: WeightedGradeDetail[] = careerTarget.careerWeights
      .map((w) => {
        const grade = grades.find((g) => g.courseId === w.courseId)?.grade ?? 0;
        const weight = Number(w.weight);
        return {
          courseId: w.courseId,
          courseName: w.course.name,
          grade,
          weight: weight * 100, // convert to percentage for display
          weightedScore: grade * weight,
        };
      })
      .sort((a, b) => b.weight - a.weight);

    results.push({
      careerTargetId: careerTarget.id,
      careerTargetName: careerTarget.name,
      score,
      category,
      categoryLabel: categoryInfo.label,
      categoryLabelId: categoryInfo.labelId,
      color: categoryInfo.color,
      weightedGrades,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Persists career scores to the database (upsert)
 */
export async function saveCareerScores(
  studentProfileId: string,
  results: CareerFitResult[],
): Promise<void> {
  await prisma.$transaction(
    results.map((result) =>
      prisma.careerScore.upsert({
        where: {
          studentProfileId_careerTargetId: {
            studentProfileId,
            careerTargetId: result.careerTargetId,
          },
        },
        create: {
          studentProfileId,
          careerTargetId: result.careerTargetId,
          score: result.score,
          category: result.category,
        },
        update: {
          score: result.score,
          category: result.category,
          computedAt: new Date(),
        },
      }),
    ),
  );
}

/**
 * Get stored career scores for a student
 */
export async function getStoredCareerScores(studentProfileId: string) {
  return prisma.careerScore.findMany({
    where: {
      studentProfileId,
      deletedAt: null,
    },
    include: {
      careerTarget: true,
    },
    orderBy: { score: "desc" },
  });
}
