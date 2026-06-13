"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  RefreshCw,
  Building2,
  GraduationCap,
  Link2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  getStudyPrograms,
} from "@/features/admin/actions";

export default function AdminCareersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProgFilter, setSelectedProgFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    studyProgramId: "",
    name: "",
    description: "",
    industryField: "",
    linkedinKeyword: "",
    jobstreetKeyword: "",
    glintsKeyword: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [careersRes, programsRes] = await Promise.all([
        getCareers(),
        getStudyPrograms(),
      ]);

      if (careersRes.success && careersRes.data) {
        setItems(careersRes.data);
      } else {
        throw new Error(careersRes.error || "Gagal memuat target karir");
      }

      if (programsRes.success && programsRes.data) {
        setPrograms(programsRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setForm({
      studyProgramId: programs.length > 0 ? programs[0].id : "",
      name: "",
      description: "",
      industryField: "",
      linkedinKeyword: "",
      jobstreetKeyword: "",
      glintsKeyword: "",
    });
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setCurrentItem(item);
    setForm({
      studyProgramId: item.studyProgramId || "",
      name: item.name || "",
      description: item.description || "",
      industryField: item.industryField || "",
      linkedinKeyword: item.linkedinKeyword || "",
      jobstreetKeyword: item.jobstreetKeyword || "",
      glintsKeyword: item.glintsKeyword || "",
    });
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.industryField || (dialogMode === "create" && !form.studyProgramId)) {
      alert("Harap isi semua kolom wajib");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (dialogMode === "create") {
        response = await createCareer(form);
      } else {
        response = await updateCareer(currentItem.id, form);
      }

      if (response.success) {
        setDialogOpen(false);
        loadData();
      } else {
        alert(response.error || "Gagal menyimpan data");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus target karir ${name}?`)) {
      return;
    }

    try {
      const response = await deleteCareer(id);
      if (response.success) {
        loadData();
      } else {
        alert(response.error || "Gagal menghapus");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.industryField.toLowerCase().includes(search.toLowerCase());
    const matchesProg =
      selectedProgFilter === "all" || item.studyProgramId === selectedProgFilter;
    return matchesSearch && matchesProg;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-teal-600" />
            Kelola Target Karir
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen pilihan karir mahasiswa, klasifikasi industri, dan integrasi keyword pencari kerja
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="border-slate-200 dark:border-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            disabled={programs.length === 0}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Target Karir
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Daftar Target Karir ({filteredItems.length})
            </CardTitle>
            <CardDescription className="text-xs">Kelola keyword LinkedIn, JobStreet, dan Glints</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Program Filter Dropdown */}
            <select
              value={selectedProgFilter}
              onChange={e => setSelectedProgFilter(e.target.value)}
              className="h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-background px-3 py-1.5 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-teal-600 outline-none max-w-xs"
            >
              <option value="all">Semua Program Studi</option>
              {programs.map(prog => (
                <option key={prog.id} value={prog.id}>
                  {prog.name} ({prog.university.name})
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari target karir..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <p className="text-sm text-muted-foreground">Memuat target karir...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive font-medium px-4">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm px-4">
              Tidak ada data target karir ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3">Program Studi</th>
                    <th className="px-6 py-3">Nama Karir</th>
                    <th className="px-6 py-3">Bidang Industri</th>
                    <th className="px-6 py-3">Integrasi Portal Kerja</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.studyProgram.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {item.studyProgram.university.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {item.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-semibold">
                        {item.industryField}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            LinkedIn: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.linkedinKeyword}</span>
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            Jobstreet: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.jobstreetKeyword}</span>
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Glints: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.glintsKeyword}</span>
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-teal-600"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-rose-600"
                            onClick={() => handleDelete(item.id, item.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-teal-600" />
              {dialogMode === "create" ? "Tambah Target Karir" : "Edit Target Karir"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {dialogMode === "create" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Program Studi</label>
                <select
                  value={form.studyProgramId}
                  onChange={e => setForm({ ...form, studyProgramId: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-background px-3 py-1 text-sm focus-visible:ring-1 focus-visible:ring-teal-600 outline-none"
                >
                  {programs.map(prog => (
                    <option key={prog.id} value={prog.id}>
                      {prog.name} ({prog.university.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Target Karir</label>
              <Input
                required
                placeholder="e.g. Investment Analyst"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bidang Industri</label>
              <Input
                required
                placeholder="e.g. Perbankan / Finansial"
                value={form.industryField}
                onChange={e => setForm({ ...form, industryField: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deskripsi Karir</label>
              <textarea
                placeholder="Deskripsikan peran dan tanggung jawab karir ini..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full min-h-[70px] rounded-md border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-teal-600 outline-none resize-none"
              />
            </div>

            {/* Keyword fields */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
              <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" />
                Keyword Integrasi Job Portal
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground">LinkedIn</label>
                  <Input
                    placeholder="investment-analyst"
                    value={form.linkedinKeyword}
                    onChange={e => setForm({ ...form, linkedinKeyword: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground">JobStreet</label>
                  <Input
                    placeholder="investment analyst"
                    value={form.jobstreetKeyword}
                    onChange={e => setForm({ ...form, jobstreetKeyword: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground">Glints</label>
                  <Input
                    placeholder="investment analyst"
                    value={form.glintsKeyword}
                    onChange={e => setForm({ ...form, glintsKeyword: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
                className="h-9 font-semibold text-xs border-slate-200 dark:border-slate-800"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="h-9 font-semibold text-xs bg-teal-600 hover:bg-teal-700 text-white gap-2"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
