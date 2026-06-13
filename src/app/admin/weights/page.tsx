"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Loader2,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Building2,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getCareers, getCareerWeights, saveCareerWeights } from "@/features/admin/actions";

export default function AdminWeightsPage() {
  const [careers, setCareers] = useState<any[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>("");
  const [weights, setWeights] = useState<any[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingWeights, setLoadingWeights] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load careers on mount
  const loadCareers = async () => {
    setLoadingCareers(true);
    setError(null);
    try {
      const response = await getCareers();
      if (response.success && response.data) {
        setCareers(response.data);
        if (response.data.length > 0) {
          setSelectedCareerId(response.data[0].id);
        }
      } else {
        setError(response.error || "Gagal memuat target karir");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoadingCareers(false);
    }
  };

  useEffect(() => {
    loadCareers();
  }, []);

  // Load weights when selected career changes
  useEffect(() => {
    if (!selectedCareerId) return;

    const loadWeights = async () => {
      setLoadingWeights(true);
      try {
        const response = await getCareerWeights(selectedCareerId);
        if (response.success && response.data) {
          setWeights(response.data);
        } else {
          alert(response.error || "Gagal memuat bobot matakuliah");
        }
      } catch {
        alert("Gagal terhubung ke server");
      } finally {
        setLoadingWeights(false);
      }
    };

    loadWeights();
  }, [selectedCareerId]);

  // Handle individual weight input (in percentage, 0-100)
  const handleWeightChange = (courseId: string, valStr: string) => {
    let num = parseFloat(valStr) || 0;
    if (num < 0) num = 0;
    if (num > 100) num = 100;

    setWeights(prev =>
      prev.map(w => (w.courseId === courseId ? { ...w, weight: num / 100 } : w))
    );
  };

  // Compute total sum of weights (0 to 1)
  const totalSum = weights.reduce((sum, w) => sum + w.weight, 0);
  const totalSumPercentage = Math.round(totalSum * 100);

  // Validation
  const isSumValid = Math.abs(totalSum - 1.0) < 0.001;

  const handleSave = async () => {
    if (totalSum > 0 && !isSumValid) {
      alert(`Total bobot harus tepat 100%. Saat ini: ${totalSumPercentage}%`);
      return;
    }

    setSaving(true);
    try {
      // Map to service payload format (courseId, weight decimal)
      const payload = weights.map(w => ({
        courseId: w.courseId,
        weight: w.weight,
      }));

      const response = await saveCareerWeights(selectedCareerId, payload);
      if (response.success) {
        alert(response.message || "Bobot berhasil disimpan");
      } else {
        alert(response.error || "Gagal menyimpan bobot");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  // Find info about the currently selected career
  const currentCareer = careers.find(c => c.id === selectedCareerId);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" />
            Kelola Bobot Karir
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Petakan tingkat kepentingan mata kuliah terhadap kesiapan karir tertentu (Bobot harus genap 100%)
          </p>
        </div>
      </div>

      {loadingCareers ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Memuat data karir...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive font-medium px-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Career Selector */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Pilih Target Karir
              </CardTitle>
              <CardDescription className="text-xs">Ubah bobot matakuliah per peran karir</CardDescription>
            </CardHeader>
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {careers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`w-full text-left px-5 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors flex flex-col gap-1 ${
                      selectedCareerId === c.id ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-blue-600" : ""
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">{c.studyProgram.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main weights adjustment table */}
          <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-sm">
            {currentCareer && (
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/50 mb-1 inline-block">
                    Target: {currentCareer.name}
                  </span>
                  <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1">
                    <GraduationCap className="h-4.5 w-4.5 text-muted-foreground" />
                    Prodi: {currentCareer.studyProgram.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {currentCareer.studyProgram.university.name}
                  </p>
                </div>
              </CardHeader>
            )}

            <CardContent className="p-0">
              {loadingWeights ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm text-muted-foreground">Memuat bobot matakuliah...</p>
                </div>
              ) : weights.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                  Tidak ada mata kuliah terdaftar di program studi ini
                </div>
              ) : (
                <div className="space-y-0">
                  {/* Course weights inputs table */}
                  <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          <th className="px-6 py-3">Semester</th>
                          <th className="px-6 py-3">Mata Kuliah & Kode</th>
                          <th className="px-6 py-3 w-32 text-right">Bobot (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {weights.map(w => (
                          <tr key={w.courseId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="px-6 py-3 text-slate-500 font-medium">
                              Smt {w.semester}
                            </td>
                            <td className="px-6 py-3">
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                  {w.courseName}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {w.courseCode}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={Math.round(w.weight * 100)}
                                  onChange={e => handleWeightChange(w.courseId, e.target.value)}
                                  className="h-8 w-16 text-center font-bold text-xs"
                                />
                                <span className="text-xs font-bold text-slate-500">%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer */}
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Total Akumulasi Bobot
                        </p>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xl font-extrabold ${isSumValid ? "text-emerald-600" : totalSumPercentage > 100 ? "text-rose-600" : "text-amber-500"}`}>
                            {totalSumPercentage}%
                          </h3>
                          {isSumValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/30">
                              <CheckCircle className="h-3 w-3" /> Valid (100%)
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${totalSumPercentage > 100 ? "text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30" : "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30"} px-2 py-0.5 rounded border`}>
                              <AlertTriangle className="h-3 w-3" /> Harus 100%
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        disabled={saving || (totalSum > 0 && !isSumValid)}
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 self-end"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Simpan Bobot
                      </Button>
                    </div>

                    <Progress
                      value={totalSumPercentage}
                      className={`h-2 ${totalSumPercentage > 100 ? "[&>div]:bg-rose-500" : isSumValid ? "[&>div]:bg-emerald-500" : "[&>div]:bg-amber-500"}`}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
