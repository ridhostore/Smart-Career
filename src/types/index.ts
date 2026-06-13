// Type definitions for Industry Mirror

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

// User types
export interface AuthUser {
  id: string;
  email: string;
  role: "student" | "university" | "admin";
}

export interface StudentDashboardData {
  careerFitScore: number;
  careerFitCategory: string;
  averageGrade: number;
  totalCourses: number;
  targetCareer: string | null;
  studyProgram: string;
  semester: number;
  gradesBySubject: GradeItem[];
  academicTrend: AcademicTrendItem[];
  careerReadiness: CareerReadinessItem[];
}

export interface GradeItem {
  courseName: string;
  courseCode: string;
  grade: number;
  letterGrade: string;
  semester: number;
}

export interface AcademicTrendItem {
  semester: number;
  averageGrade: number;
}

export interface CareerReadinessItem {
  subject: string;
  score: number;
  fullMark: number;
}

// AI types
export interface AiRecommendationOutput {
  strengths: string[];
  weaknesses: string[];
  skill_gap: string[];
  certifications: CertificationItem[];
  courses: CourseRecommendation[];
  roadmap: RoadmapItem[];
}

export interface CertificationItem {
  name: string;
  provider: string;
  priority: "high" | "medium" | "low";
  url?: string;
}

export interface CourseRecommendation {
  name: string;
  platform: string;
  duration: string;
  priority: "high" | "medium" | "low";
  url?: string;
}

export interface RoadmapItem {
  phase: string;
  duration: string;
  actions: string[];
}

// Job recommendation types
export interface JobRecommendationLinks {
  careerTarget: string;
  linkedin: string;
  jobstreet: string;
  glints: string;
}

// University analytics types
export interface UniversityStats {
  totalStudents: number;
  averageGrade: number;
  averageCareerScore: number;
  mostSelectedCareer: string;
  leastSelectedCareer: string;
}

export interface GradeDistributionItem {
  grade: string;
  count: number;
}

export interface CareerDistributionItem {
  career: string;
  count: number;
  percentage: number;
}

export interface CoursePerformanceItem {
  courseName: string;
  averageGrade: number;
  totalStudents: number;
}

// Admin types
export interface UniversityForm {
  name: string;
  code: string;
  address?: string;
  city?: string;
  province?: string;
  website?: string;
  email?: string;
  phone?: string;
  accreditation?: string;
}

export interface StudyProgramForm {
  universityId: string;
  name: string;
  code: string;
  degree?: string;
  accreditation?: string;
}

export interface CourseForm {
  studyProgramId: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  description?: string;
}

export interface CareerTargetForm {
  studyProgramId: string;
  name: string;
  description?: string;
  industryField: string;
  linkedinKeyword: string;
  jobstreetKeyword: string;
  glintsKeyword: string;
}

export interface CareerWeightForm {
  careerTargetId: string;
  courseId: string;
  weight: number;
}
