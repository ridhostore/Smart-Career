"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  GraduationCap,
  ArrowUpDown,
  UserCheck,
  Building,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUniversityStudents } from "@/features/university/actions";

export default function UniversityStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortBy, setSortBy] = useState<"name" | "gpa" | "careerFit">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 450);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchStudentsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUniversityStudents(page, pageSize, debouncedSearch);
      if (response.success && response.data) {
        setStudents(response.data.data);
        setTotal(response.data.total);
      } else {
        setError(response.error || "Gagal memuat daftar mahasiswa");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchStudentsList();
  }, [fetchStudentsList]);

  // Sort logic applied in memory
  const sortedStudents = React.useMemo(() => {
    const result = [...students];
    result.sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      if (sortBy === "name") {
        valA = a.fullName.toLowerCase();
        valB = b.fullName.toLowerCase();
      } else if (sortBy === "gpa") {
        valA = a.gpa;
        valB = b.gpa;
      } else if (sortBy === "careerFit") {
        valA = a.careerFitScore;
        valB = b.careerFitScore;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [students, sortBy, sortOrder]);

  const handleSort = (field: "name" | "gpa" | "careerFit") => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc"); // default desc for gpa/score, asc for name
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const getCategoryBadge = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("excellent")) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
          Excellent
        </span>
      );
    }
    if (cat.includes("good")) {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
          Good
        </span>
      );
    }
    if (cat.includes("moderate")) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
          Moderate
        </span>
      );
    }
    if (cat.includes("weak")) {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
          Weak
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
        Poor
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Daftar Mahasiswa
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen, pencarian, dan monitoring keselarasan karir mahasiswa institusi Anda
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStudentsList} className="gap-2 border-blue-600/20 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-400 w-fit">
          <RefreshCw className="h-3.5 w-3.5" />
          Muat Ulang
        </Button>
      </motion.div>

      {/* Main Table Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-blue-600" />
            Database Mahasiswa ({total})
          </CardTitle>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIM..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-600 focus-visible:ring-1"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive font-medium px-4">{error}</div>
          ) : sortedStudents.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm px-4">
              Tidak ada data mahasiswa ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                    <th
                      className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1.5">
                        Nama & NIM
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Program Studi
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Semester
                    </th>
                    <th
                      className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("gpa")}
                    >
                      <div className="flex items-center gap-1.5">
                        IPK
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Target Karir
                    </th>
                    <th
                      className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("careerFit")}
                    >
                      <div className="flex items-center gap-1.5">
                        Career Fit
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence mode="popLayout">
                    {sortedStudents.map((student, idx) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, delay: idx * 0.03 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {student.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{student.nim}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {student.studyProgram}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {student.semester}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                            {student.gpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {student.careerTarget}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                              {student.careerFitScore}%
                            </span>
                            {getCategoryBadge(student.careerFitCategory)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && !error && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/10">
              <p className="text-xs text-muted-foreground">
                Menampilkan <span className="font-medium">{(page - 1) * pageSize + 1}</span> sampai{" "}
                <span className="font-medium">{Math.min(page * pageSize, total)}</span> dari{" "}
                <span className="font-medium">{total}</span> mahasiswa
              </p>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-200 dark:border-slate-800"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pNum = index + 1;
                  return (
                    <Button
                      key={pNum}
                      variant={page === pNum ? "default" : "outline"}
                      className={`h-8 w-8 text-xs font-semibold border-slate-200 dark:border-slate-800 ${page === pNum ? "bg-blue-600 text-white hover:bg-blue-700" : ""}`}
                      onClick={() => setPage(pNum)}
                    >
                      {pNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-200 dark:border-slate-800"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
