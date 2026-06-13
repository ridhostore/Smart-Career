"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Compass, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginInput } from "@/validators";
import { loginAction } from "@/features/auth/actions";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await loginAction(data);

      if (response.success && response.data) {
        toast({
          title: "Login Berhasil",
          description: "Mengarahkan Anda ke dashboard...",
        });

        // Wait a tiny bit for the toast to be seen before redirecting
        setTimeout(() => {
          router.push(response.data!.redirectUrl);
          router.refresh();
        }, 800);
      } else {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: response.error || "Terjadi kesalahan saat login",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast({
        variant: "destructive",
        title: "Koneksi Bermasalah",
        description: "Gagal terhubung ke server. Silakan coba beberapa saat lagi.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile view Logo */}
      <div className="flex md:hidden flex-col items-center justify-center space-y-2 text-center mb-8">
        <Image
          src="/logo.png"
          alt="SmartCareer Logo"
          width={48}
          height={48}
          className="rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800"
        />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">SmartCareer</h1>
      </div>

      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight">Selamat Datang</h2>
        <p className="text-sm text-muted-foreground">
          Masuk ke akun Anda untuk melihat analisa kompetensi karir
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              placeholder="nama@mahasiswa.ac.id"
              type="email"
              className="pl-10"
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              disabled={isLoading}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full relative overflow-hidden" disabled={isLoading}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </motion.div>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Masuk Ke Platform
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Belum memiliki akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
