"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { gradeSchema, type GradeInput, updateProfileSchema, type UpdateProfileInput } from "@/validators";
import type { ApiResponse, SelectOption } from "@/types";
import { analyzeCareerFit, saveCareerScores } from "@/services/career-fit-engine";
import { generateCareerRecommendation } from "@/services/groq-career.service";
import { generateJobRecommendations } from "@/services/job-recommendation.service";
import { revalidatePath } from "next/cache";

/**
 * Helper: Converts numeric grade (0-100) to GPA points and letter grade
 */
function convertNumericToGpaPoints(grade: number): {
  points: number;
  letter: "A" | "AB" | "B" | "BC" | "C" | "D" | "E";
} {
  if (grade >= 85) return { points: 4.0, letter: "A" };
  if (grade >= 75) return { points: 3.5, letter: "AB" };
  if (grade >= 70) return { points: 3.0, letter: "B" };
  if (grade >= 65) return { points: 2.5, letter: "BC" };
  if (grade >= 55) return { points: 2.0, letter: "C" };
  if (grade >= 40) return { points: 1.0, letter: "D" };
  return { points: 0.0, letter: "E" };
}

/**
 * Helper: Recalculate average GPA for a student profile
 */
async function recalculateStudentGpa(studentProfileId: string, tx: any): Promise<number> {
  const grades = await tx.studentGrade.findMany({
    where: { studentProfileId, deletedAt: null },
    include: { course: true },
  });

  if (grades.length === 0) return 0.0;

  let totalPointsCredits = 0;
  let totalCredits = 0;

  for (const g of grades) {
    const { points } = convertNumericToGpaPoints(Number(g.numericGrade));
    const credits = g.course.credits;
    totalPointsCredits += points * credits;
    totalCredits += credits;
  }

  if (totalCredits === 0) return 0.0;

  const gpa = Number((totalPointsCredits / totalCredits).toFixed(2));

  await tx.studentProfile.update({
    where: { id: studentProfileId },
    data: { gpa },
  });

  return gpa;
}

/**
 * Fetch authenticated student profile helper
 */
export async function getAuthenticatedStudent() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: {
      studentProfile: {
        include: {
          studyProgram: true,
          careerTarget: true,
        },
      },
    },
  });

  if (!dbUser || dbUser.role !== "student" || !dbUser.studentProfile) {
    throw new Error("Student profile not found");
  }

  return dbUser.studentProfile;
}

/**
 * Get dashboard overview analysis data for the student
 */
export async function getStudentDashboardData(): Promise<
  ApiResponse<{
    careerFitScore: number;
    careerFitCategory: string;
    careerFitColor: string;
    averageGrade: number;
    totalCourses: number;
    totalCredits: number;
    targetCareer: string;
    studyProgram: string;
    semester: number;
    gpa: number;
    academicTrend: { semester: number; averageGrade: number }[];
    careerReadiness: { subject: string; score: number; fullMark: number }[];
  }>
> {
  try {
    const profile = await getAuthenticatedStudent();

    // 1. Calculate / Retrieve Career Fit Scores
    const fitResults = await analyzeCareerFit(profile.id);
    if (fitResults.length > 0) {
      await saveCareerScores(profile.id, fitResults);
    }

    // Find the score for the selected target career
    const activeCareerScore = fitResults.find((r) => r.careerTargetId === profile.careerTargetId);
    const careerFitScore = activeCareerScore ? activeCareerScore.score : 0;
    const careerFitCategory = activeCareerScore ? activeCareerScore.categoryLabel : "N/A";
    const careerFitColor = activeCareerScore ? activeCareerScore.color : "gray";

    // 2. Aggregate student grades
    const grades = await prisma.studentGrade.findMany({
      where: { studentProfileId: profile.id, deletedAt: null },
      include: { course: true },
    });

    const totalCourses = grades.length;
    const totalCredits = grades.reduce((acc, g) => acc + g.course.credits, 0);

    const averageGrade =
      totalCourses > 0
        ? Number((grades.reduce((acc, g) => acc + Number(g.numericGrade), 0) / totalCourses).toFixed(2))
        : 0;

    // 3. Compute academic trend (Avg grade per semester)
    const semesterGradesMap: Record<number, number[]> = {};
    grades.forEach((g) => {
      if (!semesterGradesMap[g.semester]) {
        semesterGradesMap[g.semester] = [];
      }
      semesterGradesMap[g.semester].push(Number(g.numericGrade));
    });

    const academicTrend = Object.entries(semesterGradesMap)
      .map(([sem, vals]) => ({
        semester: Number(sem),
        averageGrade: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
      }))
      .sort((a, b) => a.semester - b.semester);

    // 4. Compute career readiness radar data for active career weights
    const careerReadiness = activeCareerScore
      ? activeCareerScore.weightedGrades.map((wg) => ({
          subject: wg.courseName.length > 18 ? wg.courseName.substring(0, 15) + "..." : wg.courseName,
          score: wg.grade,
          fullMark: 100,
        }))
      : [];

    return {
      success: true,
      data: {
        careerFitScore,
        careerFitCategory,
        careerFitColor,
        averageGrade,
        totalCourses,
        totalCredits,
        targetCareer: profile.careerTarget?.name || "Belum dipilih",
        studyProgram: profile.studyProgram.name,
        semester: profile.semester,
        gpa: Number(profile.gpa),
        academicTrend,
        careerReadiness,
      },
    };
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat data dashboard",
    };
  }
}

/**
 * Fetch all grades for the current student
 */
export async function getStudentGrades() {
  try {
    const profile = await getAuthenticatedStudent();
    return prisma.studentGrade.findMany({
      where: { studentProfileId: profile.id, deletedAt: null },
      include: { course: true },
      orderBy: [{ semester: "asc" }, { course: { name: "asc" } }],
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return [];
  }
}

/**
 * Fetch available courses for the student's study program
 */
export async function getAvailableCourses(): Promise<
  { id: string; name: string; code: string; credits: number; semester: number }[]
> {
  try {
    const profile = await getAuthenticatedStudent();
    return prisma.course.findMany({
      where: { studyProgramId: profile.studyProgramId, isActive: true, deletedAt: null },
      orderBy: [{ semester: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return [];
  }
}

/**
 * Add a new student grade
 */
export async function addGradeAction(input: GradeInput): Promise<ApiResponse> {
  try {
    const validated = gradeSchema.parse(input);
    const profile = await getAuthenticatedStudent();

    // Check if the grade already exists for this course
    const existing = await prisma.studentGrade.findFirst({
      where: {
        studentProfileId: profile.id,
        courseId: validated.courseId,
        deletedAt: null,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Nilai untuk mata kuliah ini sudah diinput sebelumnya.",
      };
    }

    const { letter } = convertNumericToGpaPoints(validated.numericGrade);

    await prisma.$transaction(async (tx) => {
      // 1. Create the grade
      const grade = await tx.studentGrade.create({
        data: {
          studentProfileId: profile.id,
          courseId: validated.courseId,
          numericGrade: validated.numericGrade,
          letterGrade: letter,
          semester: validated.semester,
          academicYear: validated.academicYear,
          notes: validated.notes,
        },
      });

      // 2. Recalculate GPA
      await recalculateStudentGpa(profile.id, tx);

      // 3. Create activity log
      await tx.activityLog.create({
        data: {
          userId: profile.userId,
          action: "add_grade",
          resource: "student_grade",
          resourceId: grade.id,
        },
      });
    });

    // Recalculate and cache career fit score in background
    const fitResults = await analyzeCareerFit(profile.id);
    if (fitResults.length > 0) {
      await saveCareerScores(profile.id, fitResults);
    }

    revalidatePath("/student/dashboard");
    revalidatePath("/student/grades");
    return {
      success: true,
      message: "Nilai berhasil disimpan",
    };
  } catch (error) {
    console.error("Error adding grade:", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Input tidak valid",
      };
    }
    const err = error as Error;
    return {
      success: false,
      error: err.message || "Gagal menyimpan nilai",
    };
  }
}

/**
 * Update a student grade
 */
export async function updateGradeAction(id: string, input: GradeInput): Promise<ApiResponse> {
  try {
    const validated = gradeSchema.parse(input);
    const profile = await getAuthenticatedStudent();

    const existing = await prisma.studentGrade.findUnique({
      where: { id },
    });

    if (!existing || existing.studentProfileId !== profile.id) {
      return { success: false, error: "Nilai tidak ditemukan atau bukan milik Anda" };
    }

    const { letter } = convertNumericToGpaPoints(validated.numericGrade);

    await prisma.$transaction(async (tx) => {
      await tx.studentGrade.update({
        where: { id },
        data: {
          numericGrade: validated.numericGrade,
          letterGrade: letter,
          semester: validated.semester,
          academicYear: validated.academicYear,
          notes: validated.notes,
        },
      });

      await recalculateStudentGpa(profile.id, tx);

      await tx.activityLog.create({
        data: {
          userId: profile.userId,
          action: "update_grade",
          resource: "student_grade",
          resourceId: id,
        },
      });
    });

    const fitResults = await analyzeCareerFit(profile.id);
    if (fitResults.length > 0) {
      await saveCareerScores(profile.id, fitResults);
    }

    revalidatePath("/student/dashboard");
    revalidatePath("/student/grades");
    return {
      success: true,
      message: "Nilai berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating grade:", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Input tidak valid",
      };
    }
    const err = error as Error;
    return { success: false, error: err.message || "Gagal memperbarui nilai" };
  }
}

/**
 * Delete a student grade
 */
export async function deleteGradeAction(id: string): Promise<ApiResponse> {
  try {
    const profile = await getAuthenticatedStudent();

    const existing = await prisma.studentGrade.findUnique({
      where: { id },
    });

    if (!existing || existing.studentProfileId !== profile.id) {
      return { success: false, error: "Nilai tidak ditemukan atau bukan milik Anda" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.studentGrade.delete({
        where: { id },
      });

      await recalculateStudentGpa(profile.id, tx);

      await tx.activityLog.create({
        data: {
          userId: profile.userId,
          action: "delete_grade",
          resource: "student_grade",
          resourceId: id,
        },
      });
    });

    const fitResults = await analyzeCareerFit(profile.id);
    if (fitResults.length > 0) {
      await saveCareerScores(profile.id, fitResults);
    }

    revalidatePath("/student/dashboard");
    revalidatePath("/student/grades");
    return {
      success: true,
      message: "Nilai berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting grade:", error);
    const err = error as Error;
    return { success: false, error: err.message || "Gagal menghapus nilai" };
  }
}

/**
 * Updates the student profile fields
 */
export async function updateProfileCall(input: UpdateProfileInput): Promise<ApiResponse> {
  try {
    const validated = updateProfileSchema.parse(input);
    const profile = await getAuthenticatedStudent();

    await prisma.$transaction(async (tx) => {
      // 1. Update user full name
      await tx.user.update({
        where: { id: profile.userId },
        data: { fullName: validated.fullName },
      });

      // 2. Update student profile
      await tx.studentProfile.update({
        where: { id: profile.id },
        data: {
          nim: validated.nim,
          semester: validated.semester,
          careerTargetId: validated.careerTargetId,
          bio: validated.bio,
          phoneNumber: validated.phoneNumber,
          birthDate: validated.birthDate ? new Date(validated.birthDate) : null,
        },
      });

      // Log update profile action
      await tx.activityLog.create({
        data: {
          userId: profile.userId,
          action: "update_profile",
          resource: "student_profile",
          resourceId: profile.id,
        },
      });
    });

    // If career target has changed, recalculate fit scores
    const fitResults = await analyzeCareerFit(profile.id);
    if (fitResults.length > 0) {
      await saveCareerScores(profile.id, fitResults);
    }

    revalidatePath("/student/layout");
    revalidatePath("/student/dashboard");
    revalidatePath("/student/profile");
    return {
      success: true,
      message: "Profil berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Input tidak valid",
      };
    }
    const err = error as Error;
    return { success: false, error: err.message || "Gagal memperbarui profil" };
  }
}

/**
 * Triggers Groq AI API analysis and Job deep link generation
 */
export async function getAiRecommendationsAction(forceRefresh = false): Promise<ApiResponse> {
  try {
    const profile = await getAuthenticatedStudent();

    if (!profile.careerTargetId || !profile.careerTarget) {
      return {
        success: false,
        error: "Harap pilih target karir Anda terlebih dahulu di menu Profil.",
      };
    }

    // 1. Ensure career fit score exists in DB
    const fitResults = await analyzeCareerFit(profile.id);
    if (fitResults.length > 0) {
      await saveCareerScores(profile.id, fitResults);
    }

    // 2. Call AI service to analyze and save recommendations
    const aiOutput = await generateCareerRecommendation(
      profile.id,
      profile.careerTarget.name,
      forceRefresh,
    );

    // 3. Generate Job deep-links in parallel
    const jobsOutput = await generateJobRecommendations(
      profile.id,
    );

    return {
      success: true,
      data: {
        ai: aiOutput,
        jobs: jobsOutput,
      },
      message: "Rekomendasi AI berhasil dimuat.",
    };
  } catch (error: any) {
    console.error("Error generating recommendations:", error);
    return {
      success: false,
      error: error.message || "Gagal memproses rekomendasi AI.",
    };
  }
}

/**
 * Fetches existing career options for profile selection
 */
export async function getProfileCareerOptions(): Promise<SelectOption[]> {
  try {
    const profile = await getAuthenticatedStudent();
    const careers = await prisma.careerTarget.findMany({
      where: { studyProgramId: profile.studyProgramId, isActive: true, deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, industryField: true },
    });

    return careers.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.industryField})`,
    }));
  } catch (error) {
    console.error("Error fetching profile careers:", error);
    return [];
  }
}
