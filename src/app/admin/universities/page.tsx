"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Globe,
  MapPin,
  Award,
  RefreshCw,
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
  getUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "@/features/admin/actions";

export default function AdminUniversitiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    province: "",
    accreditation: "",
    website: "",
  });

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUniversities();
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setError(response.error || "Gagal memuat daftar universitas");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpenCreate = () => {
    setForm({
      name: "",
      code: "",
      address: "",
      city: "",
      province: "",
      accreditation: "",
      website: "",
    });
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setCurrentItem(item);
    setForm({
      name: item.name || "",
      code: item.code || "",
      address: item.address || "",
      city: item.city || "",
      province: item.province || "",
      accreditation: item.accreditation || "",
      website: item.website || "",
    });
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      alert("Nama dan Kode Universitas wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (dialogMode === "create") {
        response = await createUniversity(form);
      } else {
        response = await updateUniversity(currentItem.id, form);
      }

      if (response.success) {
        setDialogOpen(false);
        loadItems();
      } else {
        alert(response.error || "Terjadi kesalahan");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus universitas ${name}? Ini akan menonaktifkan universitas secara logis.`)) {
      return;
    }

    try {
      const response = await deleteUniversity(id);
      if (response.success) {
        loadItems();
      } else {
        alert(response.error || "Gagal menghapus");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus");
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Kelola Universitas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daftarkan, perbarui, dan kelola institusi pendidikan tinggi mitra
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadItems}
            variant="outline"
            size="sm"
            className="border-slate-200 dark:border-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Universitas
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Mitra Universitas ({filteredItems.length})
            </CardTitle>
            <CardDescription className="text-xs">Daftar kampus terintegrasi sistem</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari universitas atau kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 border-slate-200 dark:border-slate-800"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Memuat data universitas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive font-medium px-4">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm px-4">
              Tidak ada data universitas ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3">Nama & Kode</th>
                    <th className="px-6 py-3">Akreditasi</th>
                    <th className="px-6 py-3">Lokasi</th>
                    <th className="px-6 py-3">Website</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 text-sm">
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
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {item.city || item.province ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{[item.city, item.province].filter(Boolean).join(", ")}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {item.website ? (
                          <a
                            href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                          >
                            <Globe className="h-3.5 w-3.5 shrink-0" />
                            <span>Kunjungi Situs</span>
                          </a>
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
              <Building2 className="h-5 w-5 text-blue-600" />
              {dialogMode === "create" ? "Tambah Universitas" : "Edit Universitas"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Universitas</label>
                <Input
                  required
                  placeholder="e.g. Universitas Indonesia"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kode Universitas</label>
                <Input
                  required
                  placeholder="e.g. UI"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Akreditasi</label>
                <Input
                  placeholder="e.g. A"
                  value={form.accreditation}
                  onChange={e => setForm({ ...form, accreditation: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Alamat</label>
              <Input
                placeholder="e.g. Jl. Margonda Raya"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kota</label>
                <Input
                  placeholder="e.g. Depok"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Provinsi</label>
                <Input
                  placeholder="e.g. Jawa Barat"
                  value={form.province}
                  onChange={e => setForm({ ...form, province: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website</label>
              <Input
                placeholder="e.g. ui.ac.id"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
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
