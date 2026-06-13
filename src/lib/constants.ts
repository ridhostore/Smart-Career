// Application constants

export const APP_NAME = "Industry Mirror";
export const APP_TAGLINE = "Career Intelligence Platform for Economics Students";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Roles
export const ROLES = {
  STUDENT: "student",
  UNIVERSITY: "university",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Career Fit Categories
export const CAREER_FIT_CATEGORIES = {
  excellent: {
    label: "Excellent Fit",
    labelId: "Sangat Sesuai",
    range: [90, 100],
    color: "#10b981",
    bg: "bg-emerald-500",
  },
  good: {
    label: "Good Fit",
    labelId: "Sesuai",
    range: [80, 89],
    color: "#3b82f6",
    bg: "bg-blue-500",
  },
  moderate: {
    label: "Moderate Fit",
    labelId: "Cukup Sesuai",
    range: [70, 79],
    color: "#f59e0b",
    bg: "bg-amber-500",
  },
  weak: {
    label: "Weak Fit",
    labelId: "Kurang Sesuai",
    range: [60, 69],
    color: "#f97316",
    bg: "bg-orange-500",
  },
  poor: {
    label: "Poor Fit",
    labelId: "Tidak Sesuai",
    range: [0, 59],
    color: "#ef4444",
    bg: "bg-red-500",
  },
} as const;

// Study Programs
export const STUDY_PROGRAMS = [
  "Akuntansi",
  "Manajemen",
  "Ekonomi Pembangunan",
  "Bisnis Digital",
  "Ilmu Ekonomi",
  "Ekonomi Syariah",
] as const;

// Career Targets per Study Program
export const CAREER_TARGETS: Record<string, string[]> = {
  Akuntansi: ["Auditor", "Tax Consultant", "Financial Accountant", "Credit Analyst"],
  Manajemen: ["HR Specialist", "Business Development", "Marketing Executive", "Operations Manager"],
  "Ekonomi Pembangunan": [
    "Policy Analyst",
    "Research Assistant",
    "Economic Analyst",
    "Development Consultant",
  ],
  "Bisnis Digital": [
    "Product Manager",
    "Data Analyst",
    "Digital Marketer",
    "Ecommerce Specialist",
  ],
  "Ilmu Ekonomi": [
    "Financial Analyst",
    "Econometrician",
    "Risk Analyst",
    "Academic Researcher",
  ],
  "Ekonomi Syariah": [
    "Sharia Banking Officer",
    "Islamic Financial Planner",
    "Sharia Compliance Officer",
    "ZISWAF Officer",
  ],
};

// Semesters
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// Grade ranges
export const GRADE_RANGES = {
  A: { min: 85, max: 100, point: 4.0 },
  AB: { min: 80, max: 84, point: 3.5 },
  B: { min: 70, max: 79, point: 3.0 },
  BC: { min: 65, max: 69, point: 2.5 },
  C: { min: 55, max: 64, point: 2.0 },
  D: { min: 40, max: 54, point: 1.0 },
  E: { min: 0, max: 39, point: 0.0 },
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// AI
export const GROQ_PRIMARY_MODEL = "llama-3.3-70b-versatile";
export const GROQ_FALLBACK_MODEL = "llama-3.1-8b-instant";
export const AI_CACHE_HOURS = 24;

// Colors
export const BRAND_COLORS = {
  primary: "#0F766E",
  secondary: "#14B8A6",
  accent: "#F59E0B",
  background: "#F8FAFC",
} as const;

// Route paths
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  student: {
    dashboard: "/student/dashboard",
    profile: "/student/profile",
    grades: "/student/grades",
    career: "/student/career",
    recommendations: "/student/recommendations",
    jobs: "/student/jobs",
  },
  university: {
    dashboard: "/university/dashboard",
    students: "/university/students",
    analytics: "/university/analytics",
    curriculum: "/university/curriculum",
  },
  admin: {
    dashboard: "/admin/dashboard",
    universities: "/admin/universities",
    programs: "/admin/programs",
    courses: "/admin/courses",
    careers: "/admin/careers",
    weights: "/admin/weights",
    users: "/admin/users",
    settings: "/admin/settings",
  },
} as const;
