"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  Target,
  Award,
  Loader2,
  RefreshCw,
  Building,
  Briefcase,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getUniversityDashboardStats,
  getGradeDistribution,
  getCareerDistribution,
  getCoursePerformance,
} from "@/features/university/actions";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const CHART_COLORS = [
  "hsl(221, 83%, 35%)", // Blue dark
  "hsl(221, 83%, 53%)", // Blue accent
  "hsl(38, 92%, 50%)",  // Gold/Amber
  "hsl(217, 91%, 60%)", // Blue light
  "hsl(291, 94%, 44%)", // Purple
  "hsl(160, 60%, 45%)", // Mint
  "hsl(340, 75%, 55%)", // Rose
  "hsl(30, 80%, 55%)",  // Orange
];

export default function UniversityDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, gradesRes, careersRes, coursesRes] = await Promise.all([
        getUniversityDashboardStats(),
        getGradeDistribution(),
        getCareerDistribution(),
        getCoursePerformance(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        throw new Error(statsRes.error || "Gagal memuat stats");
      }

      if (gradesRes.success && gradesRes.data) {
        setGrades(gradesRes.data);
      }

      if (careersRes.success && careersRes.data) {
        setCareers(careersRes.data);
      }

      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Memuat data institusi...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive font-medium">{error || "Data tidak tersedia"}</p>
            <Button variant="outline" onClick={loadAllData} className="gap-2 border-blue-600/30 text-blue-700">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Mahasiswa",
      value: stats.totalStudents,
      subtitle: "Mahasiswa terdaftar aktif",
      icon: GraduationCap,
      color: "hsl(221, 83%, 35%)",
    },
    {
      title: "Rata-rata Nilai",
      value: stats.averageGrade.toFixed(1),
      subtitle: "Skala 0 - 100",
      icon: TrendingUp,
      color: "hsl(221, 83%, 53%)",
    },
    {
      title: "Career Fit Average",
      value: `${stats.averageCareerScore.toFixed(1)}%`,
      subtitle: "Kecocokan kompetensi industri",
      icon: Target,
      color: "hsl(38, 92%, 50%)",
    },
    {
      title: "Pilihan Karir Teratas",
      value: stats.mostSelectedCareer,
      subtitle: `Serta paling sedikit: ${stats.leastSelectedCareer}`,
      icon: Award,
      color: "hsl(217, 91%, 60%)",
      isText: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualisasi performa akademik kolektif dan keselarasan karir mahasiswa
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAllData} className="gap-2 border-blue-600/20 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-400">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Data
        </Button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="card-glow card-glow-hover relative overflow-hidden h-full border border-slate-200 dark:border-slate-800">
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: card.color }}
                />
                <CardContent className="pt-5 pb-4 pl-5 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 flex-1 pr-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {card.title}
                      </p>
                      <p className={`font-extrabold tracking-tight text-slate-900 dark:text-slate-50 line-clamp-2 ${card.isText ? "text-sm pt-1" : "text-2xl"}`}>
                        {card.value}
                      </p>
                    </div>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ color: card.color }} />
                    </div>
                  </div>
                  <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                    <p className="text-[11px] text-muted-foreground truncate">{card.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="card-glow border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Distribusi Huruf Mutu (Nilai Kelas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={grades}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="grade" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                      formatter={(value: number) => [`${value} Mahasiswa`, "Jumlah"]}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {grades.map((_: any, idx: number) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
                  Belum ada data nilai mahasiswa
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Career Choices Distribution */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="card-glow border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Distribusi Pilihan Karir Industri
              </CardTitle>
            </CardHeader>
            <CardContent>
              {careers.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={careers}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="career"
                    >
                      {careers.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} Mahasiswa (${props.payload.percentage.toFixed(1)}%)`,
                        name,
                      ]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={40}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "10px", marginTop: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
                  Belum ada mahasiswa yang memilih target karir
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Course Performance (Horizontal Bar Chart) */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="card-glow border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              Performa Rata-rata Mata Kuliah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={courses.slice(0, 10)} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    dataKey="courseName"
                    type="category"
                    fontSize={10}
                    width={180}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number, _: any, props: any) => [
                      `Rata-rata: ${value.toFixed(1)} (dari ${props.payload.totalStudents} Mahasiswa)`,
                      "Performa",
                    ]}
                  />
                  <Bar dataKey="averageGrade" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
                Belum ada data nilai per mata kuliah
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
