"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  BookOpen,
  TrendingUp,
  Award,
  GraduationCap,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getStudentDashboardData } from "@/features/student/actions";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const CHART_COLORS = [
  "hsl(173, 83%, 26%)",
  "hsl(173, 72%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(221, 83%, 53%)",
  "hsl(291, 94%, 44%)",
  "hsl(160, 60%, 45%)",
  "hsl(340, 75%, 55%)",
  "hsl(30, 80%, 55%)",
];

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudentDashboardData();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || "Gagal memuat data");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive font-medium">{error || "Data tidak tersedia"}</p>
            <Button variant="outline" onClick={fetchData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCategoryClass = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("excellent")) return "score-excellent";
    if (cat.includes("good")) return "score-good";
    if (cat.includes("moderate")) return "score-moderate";
    if (cat.includes("weak")) return "score-weak";
    return "score-poor";
  };

  const statCards = [
    {
      title: "Career Fit Score",
      value: `${data.careerFitScore.toFixed(1)}%`,
      subtitle: data.careerFitCategory,
      icon: Target,
      color: data.careerFitColor,
      badgeClass: getCategoryClass(data.careerFitCategory),
    },
    {
      title: "Rata-rata Nilai",
      value: data.averageGrade.toFixed(1),
      subtitle: `IPK: ${data.gpa.toFixed(2)}`,
      icon: TrendingUp,
      color: "hsl(173, 72%, 40%)",
    },
    {
      title: "Total Mata Kuliah",
      value: data.totalCourses,
      subtitle: `${data.totalCredits} SKS`,
      icon: BookOpen,
      color: "hsl(38, 92%, 50%)",
    },
    {
      title: "Target Karir",
      value: data.targetCareer,
      subtitle: `${data.studyProgram} • Smt ${data.semester}`,
      icon: Award,
      color: "hsl(221, 83%, 53%)",
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
            <GraduationCap className="h-6 w-6 text-primary" />
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan performa akademik dan kesiapan karir Anda
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="card-glow card-glow-hover relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
                  style={{ backgroundColor: card.color }}
                />
                <CardContent className="pt-5 pb-4 pl-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {card.title}
                      </p>
                      <p className={`font-extrabold tracking-tight ${card.isText ? "text-base" : "text-2xl"}`}>
                        {card.value}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                        {card.badgeClass && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                            {data.careerFitCategory}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: card.color }} />
                    </div>
                  </div>
                  {card.title === "Career Fit Score" && (
                    <Progress value={data.careerFitScore} className="mt-3 h-1.5" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Trend */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Trend Akademik per Semester
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.academicTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.academicTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="semester"
                      tickFormatter={(v) => `Smt ${v}`}
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis domain={[0, 100]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}`, "Rata-rata Nilai"]}
                      labelFormatter={(label) => `Semester ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageGrade"
                      stroke="hsl(173, 83%, 26%)"
                      strokeWidth={2.5}
                      dot={{ fill: "hsl(173, 83%, 26%)", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "hsl(173, 72%, 40%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  Belum ada data trend akademik
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Career Readiness Radar */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Career Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.careerReadiness.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={data.careerReadiness} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="hsl(var(--border))"
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(173, 83%, 26%)"
                      fill="hsl(173, 72%, 40%)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                  Pilih target karir untuk melihat kesiapan karir
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grade Overview */}
      {data.academicTrend.length > 0 && (
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Rata-rata Nilai per Semester
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.academicTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="semester"
                    tickFormatter={(v) => `Smt ${v}`}
                    fontSize={12}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis domain={[0, 100]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}`, "Rata-rata"]}
                    labelFormatter={(label) => `Semester ${label}`}
                  />
                  <Bar dataKey="averageGrade" radius={[6, 6, 0, 0]}>
                    {data.academicTrend.map((_: any, idx: number) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
