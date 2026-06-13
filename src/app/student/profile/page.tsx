"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Loader2,
  Save,
  Phone,
  Calendar,
  CreditCard,
  BookOpen,
  Target,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { updateProfileSchema, type UpdateProfileInput } from "@/validators";
import {
  getAuthenticatedStudent,
  updateProfileCall,
  getProfileCareerOptions,
} from "@/features/student/actions";
import type { SelectOption } from "@/types";

export default function StudentProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [careerOptions, setCareerOptions] = useState<SelectOption[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, careers] = await Promise.all([
        getAuthenticatedStudent(),
        getProfileCareerOptions(),
      ]);
      setProfile(profileData);
      setCareerOptions(careers);

      // Pre-fill the form
      reset({
        fullName: (profileData as any).user?.fullName || "",
        nim: profileData.nim || "",
        semester: profileData.semester,
        careerTargetId: profileData.careerTargetId || undefined,
        bio: profileData.bio || "",
        phoneNumber: profileData.phoneNumber || "",
        birthDate: profileData.birthDate
          ? new Date(profileData.birthDate).toISOString().split("T")[0]
          : "",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat profil",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data: UpdateProfileInput) => {
    setSaving(true);
    try {
      const result = await updateProfileCall(data);
      if (result.success) {
        toast({ title: "Berhasil", description: result.message });
        await fetchProfile();
      } else {
        toast({ variant: "destructive", title: "Gagal", description: result.error });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Gagal menyimpan profil" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Profil Saya
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi pribadi dan preferensi karir Anda
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Read-only Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="card-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Informasi Akademik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{(profile as any)?.user?.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Universitas</Label>
                  <p className="text-sm font-medium">
                    {profile?.studyProgram?.university?.name || profile?.studyProgram?.name || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Program Studi</Label>
                  <p className="text-sm font-medium">{profile?.studyProgram?.name || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Editable Fields */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="card-glow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input id="fullName" {...register("fullName")} />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                {/* NIM */}
                <div className="space-y-2">
                  <Label htmlFor="nim">
                    <CreditCard className="inline h-3.5 w-3.5 mr-1" />
                    NIM
                  </Label>
                  <Input id="nim" placeholder="Nomor Induk Mahasiswa" {...register("nim")} />
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select
                    value={String(watch("semester") || 1)}
                    onValueChange={(v) => setValue("semester", Number(v), { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          Semester {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    <Phone className="inline h-3.5 w-3.5 mr-1" />
                    No. Telepon
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="08xxxxxxxxxx"
                    {...register("phoneNumber")}
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    <Calendar className="inline h-3.5 w-3.5 mr-1" />
                    Tanggal Lahir
                  </Label>
                  <Input id="birthDate" type="date" {...register("birthDate")} />
                </div>

                {/* Career Target */}
                <div className="space-y-2">
                  <Label>
                    <Target className="inline h-3.5 w-3.5 mr-1" />
                    Target Karir
                  </Label>
                  <Select
                    value={watch("careerTargetId") || ""}
                    onValueChange={(v) => setValue("careerTargetId", v, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih target karir" />
                    </SelectTrigger>
                    <SelectContent>
                      {careerOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Deskripsi Diri</Label>
                <Textarea
                  id="bio"
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                  rows={3}
                  {...register("bio")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <Button type="submit" disabled={saving || !isDirty} className="gap-2 min-w-[160px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Profil
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
