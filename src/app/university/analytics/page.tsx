"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Download,
  Award,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Loader2,
  RefreshCw,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getCoursePerformance,
  getCareerDistribution,
  getGradeDistribution,
} from "@/features/university/actions";

const CHART_COLORS = [
  "hsl(173, 83%, 26%)",
  "hsl(173, 72%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(221, 83%, 53%)",
];

export default function UniversityAnalyticsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, careersRes, gradesRes] = await Promise.all([
        getCoursePerformance(),
        getCareerDistribution(),
        getGradeDistribution(),
      ]);

      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      }
      if (careersRes.success && careersRes.data) {
        setCareers(careersRes.data);
      }
      if (gradesRes.success && gradesRes.data) {
        setGrades(gradesRes.data);
      }
    } catch {
      setError("Gagal memuat data analitik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Highlights
  const topCourse = courses.length > 0 ? courses[0] : null;
  const criticalCourse = courses.length > 0 ? [...courses].reverse().find(c => c.averageGrade < 70) || courses[courses.length - 1] : null;

  // CSV Exporters
  const exportCoursesToCSV = () => {
    if (courses.length === 0) return;
    const headers = ["Nama Mata Kuliah", "Rata-rata Nilai", "Total Mahasiswa"];
    const rows = courses.map(c => [c.courseName, c.averageGrade, c.totalStudents]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "performa_mata_kuliah.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCareersToCSV = () => {
    if (careers.length === 0) return;
    const headers = ["Pilihan Karir", "Jumlah Mahasiswa", "Persentase (%)"];
    const rows = careers.map(c => [c.career, c.count, c.percentage]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "distribusi_karir_mahasiswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Menganalisis data kelas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" onClick={loadData} className="gap-2 text-blue-700 border-blue-600/30">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Analitik Karir & Kelas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau performa mata kuliah dan tren serapan karir industri mahasiswa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} className="gap-2 border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performer Card */}
        {topCourse && (
          <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <CardContent className="pt-5 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-600 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Mata Kuliah Kinerja Tertinggi
                </p>
                <p className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  {topCourse.courseName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Rata-rata kelas: <span className="font-bold text-slate-800 dark:text-slate-100">{topCourse.averageGrade.toFixed(1)}</span> (dari {topCourse.totalStudents} mahasiswa)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Needs Attention Card */}
        {criticalCourse && (
          <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
            <CardContent className="pt-5 flex items-start gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-600 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Mata Kuliah Perlu Perhatian
                </p>
                <p className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  {criticalCourse.courseName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Rata-rata kelas: <span className="font-bold text-slate-800 dark:text-slate-100">{criticalCourse.averageGrade.toFixed(1)}</span> (dari {criticalCourse.totalStudents} mahasiswa)
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance Curve */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                Tren Nilai Rata-rata Mata Kuliah
              </CardTitle>
              <CardDescription className="text-xs">Visualisasi distribusi nilai rata-rata mata kuliah</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCoursesToCSV}
              className="h-8 gap-1 border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              <Download className="h-3 w-3" />
              CSV
            </Button>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={courses} margin={{ left: -10, right: 10 }}>
                  <defs>
                    <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(173, 72%, 40%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(173, 72%, 40%)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="courseName" tick={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number, _: any, props: any) => [
                      `Nilai Rata-rata: ${value.toFixed(1)} (${props.payload.totalStudents} Mahasiswa)`,
                      "Performa",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageGrade"
                    stroke="hsl(173, 83%, 26%)"
                    fillOpacity={1}
                    fill="url(#colorGrade)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                Belum ada data nilai mata kuliah
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career demand/popular targets card */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Briefcase className="h-4.5 w-4.5 text-blue-600" />
                Tren Target Karir
              </CardTitle>
              <CardDescription className="text-xs">Berdasarkan data minat mahasiswa</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCareersToCSV}
              className="h-8 gap-1 border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              <Download className="h-3 w-3" />
              CSV
            </Button>
          </CardHeader>
          <CardContent className="p-0 max-h-[300px] overflow-y-auto">
            {careers.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {careers.map((c, index) => (
                  <div key={index} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <div className="pr-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{c.career}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.percentage.toFixed(1)}% dari total mahasiswa</p>
                    </div>
                    <span className="text-sm font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded">
                      {c.count} Mhs
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
                Belum ada data peminatan karir
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
