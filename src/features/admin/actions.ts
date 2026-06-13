"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Helper: Fetch and verify the authenticated admin
 */
export async function getAuthenticatedAdmin() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  if (!dbUser || dbUser.role !== "admin") {
    throw new Error("Admin access denied");
  }

  return dbUser;
}

// ============================================================
// ADMIN DASHBOARD & MONITORING STATS
// ============================================================

export async function getAdminDashboardStats(): Promise<
  ApiResponse<{
    totalUsers: number;
    totalStudents: number;
    totalUniversities: number;
    totalPrograms: number;
    totalCourses: number;
    totalCareers: number;
    recentActivities: any[];
  }>
> {
  try {
    await getAuthenticatedAdmin();

    const [
      totalUsers,
      totalStudents,
      totalUniversities,
      totalPrograms,
      totalCourses,
      totalCareers,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.studentProfile.count({ where: { deletedAt: null } }),
      prisma.university.count({ where: { deletedAt: null } }),
      prisma.studyProgram.count({ where: { deletedAt: null } }),
      prisma.course.count({ where: { deletedAt: null } }),
      prisma.careerTarget.count({ where: { deletedAt: null } }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalUniversities,
        totalPrograms,
        totalCourses,
        totalCareers,
        recentActivities: recentActivities.map(log => ({
          id: log.id,
          action: log.action,
          resource: log.resource,
          createdAt: log.createdAt,
          userName: log.user?.fullName || "System/Unknown",
          userEmail: log.user?.email || "",
          userRole: log.user?.role || "system",
        })),
      },
    };
  } catch (error: any) {
    console.error("getAdminDashboardStats error:", error);
    return {
      success: false,
      error: error.message || "Gagal memuat dashboard administrator",
    };
  }
}

// ============================================================
// UNIVERSITIES CRUD
// ============================================================

export async function getUniversities(): Promise<ApiResponse<any[]>> {
  try {
    await getAuthenticatedAdmin();
    const list = await prisma.university.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createUniversity(data: {
  name: string;
  code: string;
  address?: string;
  city?: string;
  province?: string;
  accreditation?: string;
  website?: string;
}): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.university.create({
      data: {
        ...data,
        isActive: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "create",
        resource: "university",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/universities");
    return { success: true, data: item, message: "Universitas berhasil ditambahkan" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat universitas" };
  }
}

export async function updateUniversity(
  id: string,
  data: {
    name: string;
    code: string;
    address?: string;
    city?: string;
    province?: string;
    accreditation?: string;
    website?: string;
  },
): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.university.update({
      where: { id },
      data,
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "update",
        resource: "university",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/universities");
    return { success: true, data: item, message: "Universitas berhasil diperbarui" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui universitas" };
  }
}

export async function deleteUniversity(id: string): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.university.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "delete",
        resource: "university",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/universities");
    return { success: true, message: "Universitas berhasil dihapus (soft-delete)" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus universitas" };
  }
}

// ============================================================
// STUDY PROGRAMS CRUD
// ============================================================

export async function getStudyPrograms(universityId?: string): Promise<ApiResponse<any[]>> {
  try {
    await getAuthenticatedAdmin();
    const list = await prisma.studyProgram.findMany({
      where: {
        deletedAt: null,
        universityId: universityId || undefined,
      },
      include: {
        university: {
          select: { name: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStudyProgram(data: {
  universityId: string;
  name: string;
  code: string;
  degree?: string;
  accreditation?: string;
}): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.studyProgram.create({
      data: {
        universityId: data.universityId,
        name: data.name,
        code: data.code,
        degree: data.degree || "S1",
        accreditation: data.accreditation || null,
        isActive: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "create",
        resource: "study_program",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/programs");
    return { success: true, data: item, message: "Program Studi berhasil ditambahkan" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat program studi" };
  }
}

export async function updateStudyProgram(
  id: string,
  data: {
    name: string;
    code: string;
    degree?: string;
    accreditation?: string;
  },
): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.studyProgram.update({
      where: { id },
      data,
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "update",
        resource: "study_program",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/programs");
    return { success: true, data: item, message: "Program Studi berhasil diperbarui" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui program studi" };
  }
}

export async function deleteStudyProgram(id: string): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.studyProgram.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "delete",
        resource: "study_program",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/programs");
    return { success: true, message: "Program Studi berhasil dihapus" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus program studi" };
  }
}

// ============================================================
// COURSES CRUD
// ============================================================

export async function getCourses(studyProgramId?: string): Promise<ApiResponse<any[]>> {
  try {
    await getAuthenticatedAdmin();
    const list = await prisma.course.findMany({
      where: {
        deletedAt: null,
        studyProgramId: studyProgramId || undefined,
      },
      include: {
        studyProgram: {
          select: {
            name: true,
            university: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: [{ studyProgramId: "asc" }, { semester: "asc" }, { name: "asc" }],
    });
    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCourse(data: {
  studyProgramId: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  description?: string;
}): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.course.create({
      data: {
        studyProgramId: data.studyProgramId,
        name: data.name,
        code: data.code,
        credits: Number(data.credits),
        semester: Number(data.semester),
        description: data.description || null,
        isActive: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "create",
        resource: "course",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, data: item, message: "Mata Kuliah berhasil ditambahkan" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menambahkan mata kuliah" };
  }
}

export async function updateCourse(
  id: string,
  data: {
    name: string;
    code: string;
    credits: number;
    semester: number;
    description?: string;
  },
): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        credits: Number(data.credits),
        semester: Number(data.semester),
        description: data.description || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "update",
        resource: "course",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, data: item, message: "Mata Kuliah berhasil diperbarui" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui mata kuliah" };
  }
}

export async function deleteCourse(id: string): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.course.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "delete",
        resource: "course",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, message: "Mata Kuliah berhasil dihapus" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus mata kuliah" };
  }
}

// ============================================================
// CAREERS CRUD
// ============================================================

export async function getCareers(studyProgramId?: string): Promise<ApiResponse<any[]>> {
  try {
    await getAuthenticatedAdmin();
    const list = await prisma.careerTarget.findMany({
      where: {
        deletedAt: null,
        studyProgramId: studyProgramId || undefined,
      },
      include: {
        studyProgram: {
          select: {
            name: true,
            university: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCareer(data: {
  studyProgramId: string;
  name: string;
  description?: string;
  industryField: string;
  linkedinKeyword: string;
  jobstreetKeyword: string;
  glintsKeyword: string;
}): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.careerTarget.create({
      data: {
        ...data,
        isActive: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "create",
        resource: "career_target",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/careers");
    return { success: true, data: item, message: "Target Karir berhasil dibuat" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat target karir" };
  }
}

export async function updateCareer(
  id: string,
  data: {
    name: string;
    description?: string;
    industryField: string;
    linkedinKeyword: string;
    jobstreetKeyword: string;
    glintsKeyword: string;
  },
): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.careerTarget.update({
      where: { id },
      data,
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "update",
        resource: "career_target",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/careers");
    return { success: true, data: item, message: "Target Karir berhasil diperbarui" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui target karir" };
  }
}

export async function deleteCareer(id: string): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const item = await prisma.careerTarget.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "delete",
        resource: "career_target",
        resourceId: item.id,
      },
    });

    revalidatePath("/admin/careers");
    return { success: true, message: "Target Karir berhasil dihapus" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus target karir" };
  }
}

// ============================================================
// CAREER WEIGHTS
// ============================================================

export async function getCareerWeights(careerTargetId: string): Promise<ApiResponse<any[]>> {
  try {
    await getAuthenticatedAdmin();

    const target = await prisma.careerTarget.findUnique({
      where: { id: careerTargetId },
      select: { studyProgramId: true },
    });

    if (!target) throw new Error("Target karir tidak ditemukan");

    // Fetch all courses in the matching study program
    const courses = await prisma.course.findMany({
      where: {
        studyProgramId: target.studyProgramId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        code: true,
        semester: true,
      },
      orderBy: { semester: "asc" },
    });

    // Fetch existing weights for this career target
    const weights = await prisma.careerWeight.findMany({
      where: {
        careerTargetId,
        deletedAt: null,
      },
    });

    const weightMap = new Map(weights.map(w => [w.courseId, Number(w.weight)]));

    const result = courses.map(course => ({
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
      semester: course.semester,
      weight: weightMap.get(course.id) || 0,
    }));

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveCareerWeights(
  careerTargetId: string,
  weightData: { courseId: string; weight: number }[],
): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();

    // Verify weights sum is close to 100% (or 1.0)
    const totalSum = weightData.reduce((sum, w) => sum + w.weight, 0);

    // Let's allow minor float precision errors (between 0.99 and 1.01)
    if (Math.abs(totalSum - 1) > 0.01 && totalSum > 0) {
      throw new Error(`Total bobot harus tepat 100% (1.0). Saat ini: ${(totalSum * 100).toFixed(1)}%`);
    }

    // Wrap in a transaction
    await prisma.$transaction(async tx => {
      // Clear old weights for this career target
      await tx.careerWeight.deleteMany({
        where: { careerTargetId },
      });

      // Insert new weights (filtering out 0 weight mappings)
      const dataToInsert = weightData
        .filter(w => w.weight > 0)
        .map(w => ({
          careerTargetId,
          courseId: w.courseId,
          weight: w.weight,
        }));

      if (dataToInsert.length > 0) {
        await tx.careerWeight.createMany({
          data: dataToInsert,
        });
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "update_weights",
        resource: "career_target",
        resourceId: careerTargetId,
      },
    });

    revalidatePath("/admin/weights");
    return { success: true, message: "Bobot matakuliah berhasil disimpan" };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menyimpan bobot matakuliah" };
  }
}

// ============================================================
// SYSTEM USERS
// ============================================================

export async function getUsers(): Promise<ApiResponse<any[]>> {
  try {
    await getAuthenticatedAdmin();
    const list = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(userId: string): Promise<ApiResponse<any>> {
  try {
    const admin = await getAuthenticatedAdmin();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("Pengguna tidak ditemukan");
    if (user.id === admin.id) throw new Error("Anda tidak dapat menonaktifkan akun sendiri");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: !user.isActive,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "toggle_status",
        resource: "user",
        resourceId: user.id,
      },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      data: updatedUser,
      message: `Status pengguna berhasil diubah menjadi ${updatedUser.isActive ? "Aktif" : "Nonaktif"}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengubah status pengguna" };
  }
}
