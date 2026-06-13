import { z } from "zod";

// ============================================================
// AUTH VALIDATORS
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string(),
    universityId: z.string().uuid("Pilih universitas"),
    studyProgramId: z.string().uuid("Pilih program studi"),
    semester: z.coerce
      .number()
      .int()
      .min(1, "Semester minimal 1")
      .max(8, "Semester maksimal 8"),
    careerTargetId: z.string().uuid("Pilih target karir"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// ============================================================
// GRADE VALIDATORS
// ============================================================

export const gradeSchema = z.object({
  courseId: z.string().uuid("Pilih mata kuliah"),
  numericGrade: z.coerce
    .number()
    .min(0, "Nilai minimal 0")
    .max(100, "Nilai maksimal 100"),
  semester: z.coerce
    .number()
    .int()
    .min(1, "Semester minimal 1")
    .max(8, "Semester maksimal 8"),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Format tahun akademik: YYYY/YYYY"),
  notes: z.string().max(500).optional(),
});

// ============================================================
// PROFILE VALIDATORS
// ============================================================

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  nim: z.string().max(30).optional(),
  semester: z.coerce.number().int().min(1).max(8),
  careerTargetId: z.string().uuid().optional(),
  bio: z.string().max(500).optional(),
  phoneNumber: z.string().max(20).optional(),
  birthDate: z.string().optional(),
});

// ============================================================
// ADMIN VALIDATORS
// ============================================================

export const universitySchema = z.object({
  name: z.string().min(3, "Nama universitas minimal 3 karakter").max(200),
  code: z
    .string()
    .min(2, "Kode minimal 2 karakter")
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, "Kode hanya boleh huruf kapital, angka, dan tanda -_"),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  website: z.string().url("URL website tidak valid").optional().or(z.literal("")),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  accreditation: z.string().max(5).optional(),
});

export const studyProgramSchema = z.object({
  universityId: z.string().uuid("Pilih universitas"),
  name: z.string().min(3).max(200),
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9_-]+$/),
  degree: z.string().max(10).default("S1"),
  accreditation: z.string().max(5).optional(),
});

export const courseSchema = z.object({
  studyProgramId: z.string().uuid("Pilih program studi"),
  name: z.string().min(3).max(200),
  code: z.string().min(2).max(20),
  credits: z.coerce.number().int().min(1).max(6),
  semester: z.coerce.number().int().min(1).max(8),
  description: z.string().max(500).optional(),
});

export const careerTargetSchema = z.object({
  studyProgramId: z.string().uuid("Pilih program studi"),
  name: z.string().min(2).max(200),
  description: z.string().max(500).optional(),
  industryField: z.string().min(2).max(100),
  linkedinKeyword: z.string().min(2).max(200),
  jobstreetKeyword: z.string().min(2).max(200),
  glintsKeyword: z.string().min(2).max(200),
});

export const careerWeightSchema = z.object({
  careerTargetId: z.string().uuid(),
  courseId: z.string().uuid(),
  weight: z.coerce
    .number()
    .min(0.01, "Bobot minimal 1%")
    .max(1, "Bobot maksimal 100%"),
});

// ============================================================
// TYPES
// ============================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UniversityInput = z.infer<typeof universitySchema>;
export type StudyProgramInput = z.infer<typeof studyProgramSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type CareerTargetInput = z.infer<typeof careerTargetSchema>;
export type CareerWeightInput = z.infer<typeof careerWeightSchema>;
