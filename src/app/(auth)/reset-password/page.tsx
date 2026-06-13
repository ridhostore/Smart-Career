"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Loader2, KeyRound, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validators";
import { resetPasswordAction } from "@/features/auth/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await resetPasswordAction(data);

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Password Diperbarui",
          description: "Password baru Anda berhasil disimpan.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Pembaruan Gagal",
          description: response.error || "Gagal memperbarui password.",
        });
      }
    } catch (error) {
      console.error("Reset password submission error:", error);
      toast({
        variant: "destructive",
        title: "Koneksi Bermasalah",
        description: "Gagal terhubung ke server. Silakan coba kembali.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight">Atur Ulang Password</h2>
        <p className="text-sm text-muted-foreground">
          Masukkan kata sandi baru Anda di bawah ini
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="reset-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...register("password")}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                  className="pl-10"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Perbarui Password</span>
                  <KeyRound className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 text-center dark:border-blue-900/30 dark:bg-blue-950/20 space-y-4"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Password Diperbarui!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Password baru Anda berhasil disimpan. Anda sekarang dapat masuk kembali ke dalam platform menggunakan password baru tersebut.
              </p>
            </div>
            <Button onClick={() => router.push("/login")} className="w-full gap-2">
              <span>Masuk Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
