"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Shield,
  Building,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUsers, toggleUserStatus } from "@/features/admin/actions";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || "Gagal memuat daftar pengguna");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId: string, fullName: string, currentActive: boolean) => {
    const actionText = currentActive ? "menonaktifkan" : "mengaktifkan";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} akun ${fullName}?`)) {
      return;
    }

    setTogglingId(userId);
    try {
      const response = await toggleUserStatus(userId);
      if (response.success) {
        // Update local state instead of full reload for snappy feedback
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
        );
      } else {
        alert(response.error || "Gagal mengubah status");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setTogglingId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-rose-500 shrink-0" />;
      case "university":
        return <Building className="h-4 w-4 text-amber-500 shrink-0" />;
      default:
        return <GraduationCap className="h-4 w-4 text-teal-600 shrink-0" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30">
            System Admin
          </span>
        );
      case "university":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
            Univ Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30">
            Mahasiswa
          </span>
        );
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      selectedRoleFilter === "all" || user.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-600" />
            Kelola Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen status aktifasi dan pembatasan peran akses pengguna sistem
          </p>
        </div>
        <Button
          onClick={loadUsers}
          variant="outline"
          size="sm"
          className="border-slate-200 dark:border-slate-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Daftar Pengguna Sistem ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-xs">Aktifkan atau nonaktifkan hak akses pengguna</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Role Filter Dropdown */}
            <select
              value={selectedRoleFilter}
              onChange={e => setSelectedRoleFilter(e.target.value)}
              className="h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-background px-3 py-1.5 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-teal-600 outline-none"
            >
              <option value="all">Semua Peran</option>
              <option value="student">Mahasiswa</option>
              <option value="university">Univ Admin</option>
              <option value="admin">System Admin</option>
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email..."
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
              <p className="text-sm text-muted-foreground">Memuat pengguna...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive font-medium px-4">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm px-4">
              Tidak ada data pengguna ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3">Nama Lengkap & Email</th>
                    <th className="px-6 py-3">Peran Akses</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Didaftarkan</th>
                    <th className="px-6 py-3 text-right">Aksi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            {getRoleIcon(user.role)}
                            {user.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                            <XCircle className="h-4 w-4 shrink-0" />
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {togglingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-teal-600 ml-auto mr-4" />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 font-semibold text-xs ${
                              user.isActive
                                ? "border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                            onClick={() => handleToggleStatus(user.id, user.fullName, user.isActive)}
                          >
                            {user.isActive ? "Deaktivasi" : "Aktivasi"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
