"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Loader2,
  FileText,
  HelpCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCurriculumReport } from "@/features/university/actions";

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function UniversityCurriculumPage() {
  const [report, setReport] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genStep, setGenStep] = useState(0);

  const steps = [
    "Mengagregasikan statistik performa nilai mahasiswa...",
    "Menganalisis disparitas kompetensi & target karir...",
    "Mengekstrak kesenjangan skill (skill gap) kurikulum...",
    "Merumuskan rekomendasi melalui Groq AI Engine...",
    "Menyusun laporan penyelarasan industri...",
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    setError(null);
    setReport(null);
    setGenStep(0);

    // Simulate step progress for visual wow-factor
    const interval = setInterval(() => {
      setGenStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1200);

    try {
      const response = await generateCurriculumReport();
      clearInterval(interval);
      if (response.success && response.data) {
        setReport(response.data);
      } else {
        setError(response.error || "Gagal memproses rekomendasi AI");
      }
    } catch {
      clearInterval(interval);
      setError("Terjadi kesalahan koneksi saat memproses data");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-teal-600" />
            AI Penyelarasan Kurikulum
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gunakan AI Consultant untuk mendeteksi kesenjangan kurikulum berdasarkan kompetensi industri
          </p>
        </div>
      </div>

      {/* Intro & CTA */}
      {!generating && !report && !error && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border border-teal-500/20 bg-teal-50/10 dark:bg-teal-950/5 overflow-hidden">
            <CardContent className="p-8 text-center max-w-2xl mx-auto space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Analisis Kurikulum Cerdas
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mesin AI kami akan mengumpulkan semua data nilai, GPA, target karir, dan kesenjangan skill mahasiswa Anda untuk dibandingkan dengan standar kebutuhan industri Indonesia 2024-2026.
                </p>
              </div>
              <Button
                onClick={handleGenerateReport}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md px-6 py-2"
              >
                Mulai Analisis AI Sekarang
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Generating Progress Tracker */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 max-w-xl mx-auto py-12"
          >
            <Card className="border border-slate-200 dark:border-slate-800 shadow-lg bg-card text-center">
              <CardContent className="pt-8 pb-10 px-6 space-y-6">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20 animate-ping" />
                  <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-50">
                    Sedang Memproses Laporan...
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
                    Langkah {genStep + 1} dari {steps.length}
                  </p>
                </div>

                {/* Progress Indicators List */}
                <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 max-w-sm mx-auto">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs">
                      {genStep > idx ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : genStep === idx ? (
                        <Loader2 className="h-4 w-4 animate-spin text-teal-600 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                      )}
                      <span
                        className={
                          genStep === idx
                            ? "font-bold text-slate-800 dark:text-slate-100"
                            : genStep > idx
                            ? "text-muted-foreground line-through"
                            : "text-muted-foreground/60"
                        }
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && (
        <Card className="max-w-md mx-auto border border-rose-500/20 bg-rose-50/10 dark:bg-rose-950/5">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
            <p className="text-destructive font-bold">{error}</p>
            <Button
              variant="outline"
              onClick={handleGenerateReport}
              className="gap-2 border-rose-600/30 text-rose-700 dark:text-rose-400"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Showcase */}
      {report && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          {/* Header Action Card */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-card">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-xl text-teal-600 shrink-0">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-50">Laporan Penyelarasan Kurikulum</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Laporan dibuat otomatis menggunakan AI pada {new Date().toLocaleDateString("id-ID")}</p>
                </div>
              </div>
              <Button
                onClick={handleGenerateReport}
                variant="outline"
                className="gap-2 border-teal-600/20 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/10 h-9 shrink-0 font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerasi Analisis
              </Button>
            </CardContent>
          </Card>

          {/* Tab Selection */}
          <Tabs defaultValue="visual" className="w-full space-y-6">
            <TabsList className="grid grid-cols-2 max-w-sm">
              <TabsTrigger value="visual" className="text-xs font-bold gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Ringkasan Analisis
              </TabsTrigger>
              <TabsTrigger value="markdown" className="text-xs font-bold gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Laporan Lengkap
              </TabsTrigger>
            </TabsList>

            {/* Visual Overview */}
            <TabsContent value="visual" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Skill Gaps Card */}
                <Card className="border border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                      Kesenjangan Skill Terbesar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {report.biggestSkillGaps.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {report.biggestSkillGaps.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Tidak terdeteksi kesenjangan skill yang signifikan.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Strong Courses */}
                <Card className="border border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Award className="h-4.5 w-4.5 text-emerald-500" />
                      Mata Kuliah Unggulan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {report.strongCourses.length > 0 ? (
                      <div className="space-y-2">
                        {report.strongCourses.map((c: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {c}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Belum ada mata kuliah dengan nilai rata-rata unggul (&gt;80).</p>
                    )}
                  </CardContent>
                </Card>

                {/* Weak Courses */}
                <Card className="border border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                      Mata Kuliah Kurang
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {report.weakCourses.length > 0 ? (
                      <div className="space-y-2">
                        {report.weakCourses.map((c: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            {c}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Hebat! Tidak ada mata kuliah dengan nilai rata-rata di bawah 70.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Industry demand fields cards */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Briefcase className="h-4.5 w-4.5 text-teal-600" />
                    Kebutuhan Bidang Karir Terdeteksi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {report.industryDemands.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.industryDemands.map((demand: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-teal-50 dark:bg-teal-950/20 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30"
                        >
                          {demand}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Tidak ada bidang industri spesifik yang terpetakan.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Raw Markdown Report */}
            <TabsContent value="markdown">
              <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden">
                <CardContent className="p-8 prose dark:prose-invert max-w-none text-left bg-slate-50/50 dark:bg-slate-950/50">
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-300">
                    {report.markdownReport || "Laporan kosong atau tidak dapat di-render."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}
