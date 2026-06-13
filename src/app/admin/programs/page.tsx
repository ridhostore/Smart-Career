"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Award,
  RefreshCw,
  Building2,
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
  getStudyPrograms,
  createStudyProgram,
  updateStudyProgram,
  deleteStudyProgram,
  getUniversities,
} from "@/features/admin/actions";

export default function AdminProgramsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUnivFilter, setSelectedUnivFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    universityId: "",
    name: "",
    code: "",
    degree: "S1",
    accreditation: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [programsRes, univRes] = await Promise.all([
        getStudyPrograms(),
        getUniversities(),
      ]);

      if (programsRes.success && programsRes.data) {
        setItems(programsRes.data);
      } else {
        throw new Error(programsRes.error || "Gagal memuat prodi");
      }

      if (univRes.success && univRes.data) {
        setUniversities(univRes.data);
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
      universityId: universities.length > 0 ? universities[0].id : "",
      name: "",
      code: "",
      degree: "S1",
      accreditation: "",
    });
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setCurrentItem(item);
    setForm({
      universityId: item.universityId || "",
      name: item.name || "",
      code: item.code || "",
      degree: item.degree || "S1",
      accreditation: item.accreditation || "",
    });
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || (dialogMode === "create" && !form.universityId)) {
      alert("Harap isi semua kolom wajib");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (dialogMode === "create") {
        response = await createStudyProgram({
          universityId: form.universityId,
          name: form.name,
          code: form.code,
          degree: form.degree,
          accreditation: form.accreditation,
        });
      } else {
        response = await updateStudyProgram(currentItem.id, {
          name: form.name,
          code: form.code,
          degree: form.degree,
          accreditation: form.accreditation,
        });
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
    if (!confirm(`Apakah Anda yakin ingin menghapus program studi ${name}?`)) {
      return;
    }

    try {
      const response = await deleteStudyProgram(id);
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
      item.code.toLowerCase().includes(search.toLowerCase());
    const matchesUniv =
      selectedUnivFilter === "all" || item.universityId === selectedUnivFilter;
    return matchesSearch && matchesUniv;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Kelola Program Studi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen kurikulum program studi per universitas mitra
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
            disabled={universities.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Program Studi
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Daftar Program Studi ({filteredItems.length})
            </CardTitle>
            <CardDescription className="text-xs">Kelola tingkat gelar dan akreditasi prodi</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Univ Filter Dropdown */}
            <select
              value={selectedUnivFilter}
              onChange={e => setSelectedUnivFilter(e.target.value)}
              className="h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-background px-3 py-1.5 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-blue-600 outline-none"
            >
              <option value="all">Semua Universitas</option>
              {universities.map(univ => (
                <option key={univ.id} value={univ.id}>
                  {univ.name}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari program studi..."
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
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Memuat data prodi...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive font-medium px-4">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm px-4">
              Tidak ada data program studi ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3">Universitas</th>
                    <th className="px-6 py-3">Program Studi</th>
                    <th className="px-6 py-3">Gelar</th>
                    <th className="px-6 py-3">Akreditasi</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 text-sm">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{item.university.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {item.name}
                          </p>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50 mt-1 inline-block">
                            {item.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-bold">
                        {item.degree}
                      </td>
                      <td className="px-6 py-4">
                        {item.accreditation ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                            <Award className="h-4 w-4 text-amber-500 shrink-0" />
                            {item.accreditation}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-blue-600"
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
              <GraduationCap className="h-5 w-5 text-blue-600" />
              {dialogMode === "create" ? "Tambah Program Studi" : "Edit Program Studi"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {dialogMode === "create" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Universitas Mitra</label>
                <select
                  value={form.universityId}
                  onChange={e => setForm({ ...form, universityId: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-background px-3 py-1 text-sm focus-visible:ring-1 focus-visible:ring-blue-600 outline-none"
                >
                  {universities.map(univ => (
                    <option key={univ.id} value={univ.id}>
                      {univ.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Program Studi</label>
              <Input
                required
                placeholder="e.g. S1 Ekonomi Pembangunan"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kode Prodi</label>
                <Input
                  required
                  placeholder="e.g. EK-PEM"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gelar</label>
                <Input
                  placeholder="e.g. S.E."
                  value={form.degree}
                  onChange={e => setForm({ ...form, degree: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Akreditasi</label>
              <Input
                placeholder="e.g. A atau Unggul"
                value={form.accreditation}
                onChange={e => setForm({ ...form, accreditation: e.target.value })}
              />
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
                className="h-9 font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white gap-2"
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
