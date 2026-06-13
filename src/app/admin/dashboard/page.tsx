"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Activity,
  Loader2,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminDashboardStats } from "@/features/admin/actions";

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Gagal memuat statistik sistem");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Memuat dashboard monitor...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive font-medium">{error || "Statistik tidak tersedia"}</p>
            <Button variant="outline" onClick={loadStats} className="gap-2 border-blue-600/30 text-blue-700">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      subtitle: "Akun terdaftar",
      icon: Users,
      color: "hsl(221, 83%, 53%)",
    },
    {
      title: "Total Mahasiswa",
      value: stats.totalStudents,
      subtitle: "Profil mahasiswa aktif",
      icon: GraduationCap,
      color: "hsl(173, 83%, 26%)",
    },
    {
      title: "Universitas",
      value: stats.totalUniversities,
      subtitle: "Institusi terdaftar",
      icon: Building2,
      color: "hsl(291, 94%, 44%)",
    },
    {
      title: "Program Studi",
      value: stats.totalPrograms,
      subtitle: "Kurikulum aktif",
      icon: GraduationCap,
      color: "hsl(160, 60%, 45%)",
    },
    {
      title: "Mata Kuliah",
      value: stats.totalCourses,
      subtitle: "Mata kuliah terdaftar",
      icon: BookOpen,
      color: "hsl(38, 92%, 50%)",
    },
    {
      title: "Target Karir",
      value: stats.totalCareers,
      subtitle: "Pemetaan karir industri",
      icon: Briefcase,
      color: "hsl(340, 75%, 55%)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Dashboard Monitor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan data entitas sistem dan audit log aktivitas
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadStats}
          className="gap-2 border-slate-200 dark:border-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Grid counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {overviewCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="card-glow card-glow-hover border border-slate-200 dark:border-slate-800 h-full relative overflow-hidden">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {card.title}
                    </span>
                    <Icon className="h-4 w-4" style={{ color: card.color }} />
                  </div>
                  <div className="mt-3.5">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                      {card.value}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{card.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Audit Logs */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Activity className="h-4.5 w-4.5 text-blue-600" />
              Audit Trail - Log Aktivitas Terkini
            </CardTitle>
            <CardDescription className="text-xs">10 aktivitas sistem terbaru yang dilakukan oleh pengguna</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentActivities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Belum ada aktivitas tercatat
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-3">Pengguna</th>
                      <th className="px-6 py-3">Aksi</th>
                      <th className="px-6 py-3">Sumber Daya</th>
                      <th className="px-6 py-3">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {stats.recentActivities.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="px-6 py-3.5">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {log.userName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {log.userEmail} &bull; <span className="capitalize">{log.userRole}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                            log.action === "create" || log.action === "login"
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                              : log.action === "update"
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30"
                              : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30"
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 font-semibold">
                          {log.resource}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
