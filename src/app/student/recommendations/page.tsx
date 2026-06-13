"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getAiRecommendationsAction } from "@/features/student/actions";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  );
}

export default function StudentRecommendationsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await getAiRecommendationsAction(forceRefresh);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Gagal memuat rekomendasi");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRefresh = () => {
    toast({
      title: "Memperbarui Analisis AI...",
      description: "Ini mungkin memerlukan beberapa detik.",
    });
    fetchRecommendations(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <BrainCircuit className="h-12 w-12 text-primary animate-pulse" />
            <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Menganalisis profil Anda...</p>
            <p className="text-xs text-muted-foreground mt-1">
              AI sedang menganalisis data akademik dan merekomendasikan pengembangan karir
            </p>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-10 w-10 mx-auto text-amber-500" />
            <p className="font-medium text-destructive">{error || "Data tidak tersedia"}</p>
            <p className="text-xs text-muted-foreground">
              Pastikan Anda sudah memilih target karir dan menginput minimal 1 nilai
            </p>
            <Button variant="outline" onClick={() => fetchRecommendations()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { ai, jobs } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Rekomendasi AI & Karir
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analisis kekuatan, kelemahan, dan roadmap pengembangan karir Anda
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="gap-2 shrink-0"
        >
          {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh Analisis AI
        </Button>
      </motion.div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="analysis">Analisis AI</TabsTrigger>
          <TabsTrigger value="development">Pengembangan</TabsTrigger>
          <TabsTrigger value="jobs">Lowongan Kerja</TabsTrigger>
        </TabsList>

        {/* Tab 1: AI Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="card-glow h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    Kekuatan Anda
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {ai.strengths.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <p className="text-sm text-foreground">{s}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weaknesses */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="card-glow h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                    <ShieldAlert className="h-4 w-4" />
                    Area Perbaikan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {ai.weaknesses.map((w: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <p className="text-sm text-foreground">{w}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Skill Gaps */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Skill Gap yang Harus Diisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ai.skill_gap.map((gap: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs px-3 py-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20"
                    >
                      {gap}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Roadmap */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Roadmap Belajar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ai.roadmap.map((phase: any, i: number) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {i + 1}
                      </div>
                      {i < ai.roadmap.length - 1 && (
                        <div className="absolute left-[11px] top-6 h-[calc(100%+8px)] w-0.5 bg-border" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{phase.phase}</h4>
                          <Badge variant="outline" className="text-[10px]">
                            {phase.duration}
                          </Badge>
                        </div>
                        <ul className="space-y-1">
                          {phase.actions.map((action: string, j: number) => (
                            <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab 2: Development (Certs + Courses) */}
        <TabsContent value="development" className="space-y-6">
          {/* Certifications */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Sertifikasi yang Direkomendasikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ai.certifications.map((cert: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.provider}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <PriorityBadge priority={cert.priority} />
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Courses */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Kursus Online yang Direkomendasikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ai.courses.map((course: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.platform} · {course.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <PriorityBadge priority={course.priority} />
                        {course.url && (
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab 3: Job Links */}
        <TabsContent value="jobs" className="space-y-6">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Lowongan Kerja Sesuai Target Karir
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobs && jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job: any, i: number) => (
                      <div key={i} className="space-y-3">
                        {i > 0 && <Separator />}
                        <h4 className="font-bold text-sm">{job.careerTarget}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <a
                            href={job.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[#0A66C2]/5 hover:border-[#0A66C2]/30 transition-all group"
                          >
                            <div
                              className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: "#0A66C2" }}
                            >
                              in
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold group-hover:text-[#0A66C2]">LinkedIn Jobs</p>
                              <p className="text-[10px] text-muted-foreground">Platform profesional</p>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#0A66C2]" />
                          </a>

                          <a
                            href={job.jobstreet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[#E60278]/5 hover:border-[#E60278]/30 transition-all group"
                          >
                            <div
                              className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: "#E60278" }}
                            >
                              JS
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold group-hover:text-[#E60278]">JobStreet</p>
                              <p className="text-[10px] text-muted-foreground">Asia Tenggara</p>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#E60278]" />
                          </a>

                          <a
                            href={job.glints}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[#F5642F]/5 hover:border-[#F5642F]/30 transition-all group"
                          >
                            <div
                              className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: "#F5642F" }}
                            >
                              GL
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold group-hover:text-[#F5642F]">Glints</p>
                              <p className="text-[10px] text-muted-foreground">Generasi muda</p>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#F5642F]" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Belum ada rekomendasi lowongan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
