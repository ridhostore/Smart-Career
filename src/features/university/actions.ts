"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, PaginatedResponse, UniversityStats, GradeDistributionItem, CareerDistributionItem, CoursePerformanceItem } from "@/types";
import { generateCurriculumInsight } from "@/services/curriculum-ai.service";
import { revalidatePath } from "next/cache";

/**
 * Fetch authenticated university admin profile and get their universityId
 */
export async function getAuthenticatedUniversityAdmin() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: {
      universityAdmin: {
        include: {
          university: true,
        },
      },
    },
  });

  if (!dbUser || dbUser.role !== "university" || !dbUser.universityAdmin) {
    throw new Error("University admin profile not found");
  }

  return dbUser.universityAdmin;
}

/**
 * Get aggregated dashboard overview stats for the university
 */
export async function getUniversityDashboardStats(): Promise<ApiResponse<UniversityStats>> {
  try {
    const admin = await getAuthenticatedUniversityAdmin();
    const universityId = admin.universityId;

    // Total active students
    const totalStudents = await prisma.studentProfile.count({
      where: {
        deletedAt: null,
        studyProgram: {
          universityId,
          deletedAt: null,
        },
      },
    });

    // Average grade (numeric)
    const gradeAvg = await prisma.studentGrade.aggregate({
      where: {
        deletedAt: null,
        studentProfile: {
          deletedAt: null,
          studyProgram: {
            universityId,
            deletedAt: null,
          },
        },
      },
      _avg: {
        numericGrade: true,
      },
    });

    // Average career fit score
    const careerAvg = await prisma.careerScore.aggregate({
      where: {
        deletedAt: null,
        studentProfile: {
          deletedAt: null,
          studyProgram: {
            universityId,
            deletedAt: null,
          },
        },
      },
      _avg: {
        score: true,
      },
    });

    // Career counts to find most and least selected
    const careerCounts = await prisma.studentProfile.groupBy({
      by: ["careerTargetId"],
      where: {
        deletedAt: null,
        careerTargetId: { not: null },
        studyProgram: {
          universityId,
          deletedAt: null,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    let mostSelectedCareer = "N/A";
    let leastSelectedCareer = "N/A";

    if (careerCounts.length > 0) {
      const careerIds = careerCounts.map(c => c.careerTargetId).filter(Boolean) as string[];
      const careers = await prisma.careerTarget.findMany({
        where: { id: { in: careerIds } },
        select: { id: true, name: true },
      });
      const careerMap = new Map(careers.map(c => [c.id, c.name]));

      mostSelectedCareer = careerMap.get(careerCounts[0].careerTargetId || "") || "N/A";
      leastSelectedCareer = careerMap.get(careerCounts[careerCounts.length - 1].careerTargetId || "") || "N/A";
    }

    return {
      success: true,
      data: {
        totalStudents,
        averageGrade: Number(Number(gradeAvg._avg.numericGrade || 0).toFixed(2)),
        averageCareerScore: Number(Number(careerAvg._avg.score || 0).toFixed(1)),
        mostSelectedCareer,
        leastSelectedCareer,
      },
    };
  } catch (error: any) {
    console.error("getUniversityDashboardStats error:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat statistik universitas",
    };
  }
}

/**
 * Get letter grade distribution
 */
export async function getGradeDistribution(): Promise<ApiResponse<GradeDistributionItem[]>> {
  try {
    const admin = await getAuthenticatedUniversityAdmin();
    const universityId = admin.universityId;

    const grades = await prisma.studentGrade.groupBy({
      by: ["letterGrade"],
      where: {
        deletedAt: null,
        letterGrade: { not: null },
        studentProfile: {
          deletedAt: null,
          studyProgram: {
            universityId,
            deletedAt: null,
          },
        },
      },
      _count: {
        id: true,
      },
    });

    const possibleGrades = ["A", "AB", "B", "BC", "C", "D", "E"];
    const distributionMap = new Map<string, number>(possibleGrades.map(g => [g, 0]));

    for (const g of grades) {
      if (g.letterGrade) {
        distributionMap.set(g.letterGrade, g._count.id);
      }
    }

    const data: GradeDistributionItem[] = possibleGrades.map(grade => ({
      grade,
      count: distributionMap.get(grade) || 0,
    }));

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("getGradeDistribution error:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat distribusi nilai",
    };
  }
}

/**
 * Get career choice distribution
 */
export async function getCareerDistribution(): Promise<ApiResponse<CareerDistributionItem[]>> {
  try {
    const admin = await getAuthenticatedUniversityAdmin();
    const universityId = admin.universityId;

    const careerGroups = await prisma.studentProfile.groupBy({
      by: ["careerTargetId"],
      where: {
        deletedAt: null,
        careerTargetId: { not: null },
        studyProgram: {
          universityId,
          deletedAt: null,
        },
      },
      _count: {
        id: true,
      },
    });

    const totalStudentsWithCareer = careerGroups.reduce((sum, g) => sum + g._count.id, 0);

    if (careerGroups.length === 0) {
      return { success: true, data: [] };
    }

    const careerIds = careerGroups.map(g => g.careerTargetId).filter(Boolean) as string[];
    const careers = await prisma.careerTarget.findMany({
      where: { id: { in: careerIds } },
      select: { id: true, name: true },
    });
    const careerMap = new Map(careers.map(c => [c.id, c.name]));

    const data: CareerDistributionItem[] = careerGroups.map(g => {
      const name = careerMap.get(g.careerTargetId || "") || "Unknown";
      return {
        career: name,
        count: g._count.id,
        percentage: totalStudentsWithCareer > 0 ? Number(((g._count.id / totalStudentsWithCareer) * 100).toFixed(1)) : 0,
      };
    });

    return {
      success: true,
      data: data.sort((a, b) => b.count - a.count),
    };
  } catch (error: any) {
    console.error("getCareerDistribution error:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat distribusi karir",
    };
  }
}

/**
 * Get course performance (average grades per course)
 */
export async function getCoursePerformance(): Promise<ApiResponse<CoursePerformanceItem[]>> {
  try {
    const admin = await getAuthenticatedUniversityAdmin();
    const universityId = admin.universityId;

    const gradeGroups = await prisma.studentGrade.groupBy({
      by: ["courseId"],
      where: {
        deletedAt: null,
        studentProfile: {
          deletedAt: null,
          studyProgram: {
            universityId,
            deletedAt: null,
          },
        },
      },
      _avg: {
        numericGrade: true,
      },
      _count: {
        id: true,
      },
    });

    if (gradeGroups.length === 0) {
      return { success: true, data: [] };
    }

    const courseIds = gradeGroups.map(g => g.courseId);
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, name: true, code: true },
    });
    const courseMap = new Map(courses.map(c => [c.id, `${c.name} (${c.code})`]));

    const data: CoursePerformanceItem[] = gradeGroups.map(g => ({
      courseName: courseMap.get(g.courseId) || "Mata Kuliah Tidak Dikenal",
      averageGrade: Number(Number(g._avg.numericGrade || 0).toFixed(2)),
      totalStudents: g._count.id,
    }));

    return {
      success: true,
      data: data.sort((a, b) => b.averageGrade - a.averageGrade),
    };
  } catch (error: any) {
    console.error("getCoursePerformance error:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat performa mata kuliah",
    };
  }
}

/**
 * Get list of students belonging to the university (paginated and searchable)
 */
export async function getUniversityStudents(
  page = 1,
  pageSize = 10,
  search = "",
): Promise<ApiResponse<PaginatedResponse<any>>> {
  try {
    const admin = await getAuthenticatedUniversityAdmin();
    const universityId = admin.universityId;

    const offset = (page - 1) * pageSize;

    // Search filter for full name or NIM
    const whereClause: any = {
      deletedAt: null,
      studyProgram: {
        universityId,
        deletedAt: null,
      },
      OR: search
        ? [
            {
              user: {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              nim: {
                contains: search,
                mode: "insensitive",
              },
            },
          ]
        : undefined,
    };

    const total = await prisma.studentProfile.count({
      where: whereClause,
    });

    const studentProfiles = await prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        studyProgram: {
          select: {
            name: true,
          },
        },
        careerTarget: {
          select: {
            name: true,
          },
        },
        careerScores: {
          where: {
            deletedAt: null,
          },
          select: {
            score: true,
            category: true,
            careerTarget: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        user: {
          fullName: "asc",
        },
      },
      skip: offset,
      take: pageSize,
    });

    const formattedStudents = studentProfiles.map(student => {
      // Find the career score for their selected career target if exists
      const targetScore = student.careerScores.find(
        cs => cs.careerTarget.name === student.careerTarget?.name
      );

      return {
        id: student.id,
        fullName: student.user.fullName,
        email: student.user.email,
        avatarUrl: student.user.avatarUrl,
        nim: student.nim || "-",
        semester: student.semester,
        gpa: Number(student.gpa),
        studyProgram: student.studyProgram.name,
        careerTarget: student.careerTarget?.name || "-",
        careerFitScore: targetScore ? Number(targetScore.score) : 0,
        careerFitCategory: targetScore ? targetScore.category : "poor",
      };
    });

    return {
      success: true,
      data: {
        data: formattedStudents,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error: any) {
    console.error("getUniversityStudents error:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat data mahasiswa",
    };
  }
}

/**
 * Generate (or regenerate) a curriculum analysis report using AI
 */
export async function generateCurriculumReport(): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedUniversityAdmin();
    const universityId = admin.universityId;

    const report = await generateCurriculumInsight(universityId);

    // Save activity log
    await prisma.activityLog.create({
      data: {
        userId: admin.userId,
        action: "generate_curriculum_report",
        resource: "university",
        resourceId: universityId,
      },
    });

    revalidatePath("/university/curriculum");

    return {
      success: true,
      data: report,
      message: "Laporan analisis kurikulum berhasil diperbarui oleh AI",
    };
  } catch (error: any) {
    console.error("generateCurriculumReport error:", error);
    return {
      success: false,
      error: error.message || "Gagal menghasilkan analisis kurikulum",
    };
  }
}
