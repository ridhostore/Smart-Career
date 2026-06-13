"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validators";
import { forgotPasswordAction } from "@/features/auth/actions";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await forgotPasswordAction(data);

      if (response.success) {
        setIsSent(true);
        toast({
          title: "Email Terkirim",
          description: "Instruksi reset password telah dikirim ke email Anda.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Gagal Mengirim",
          description: response.error || "Gagal mengirim instruksi reset password.",
        });
      }
    } catch (error) {
      console.error("Forgot password submission error:", error);
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
        <h2 className="text-3xl font-extrabold tracking-tight">Lupa Password?</h2>
        <p className="text-sm text-muted-foreground">
          Masukkan email terdaftar Anda untuk menerima tautan pemulihan kata sandi
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.form
            key="forgot-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="budi@mahasiswa.ac.id"
                  disabled={isLoading}
                  {...register("email")}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Kirim Tautan Pemulihan</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-teal-200 bg-teal-50/50 p-6 text-center dark:border-teal-900/30 dark:bg-teal-950/20"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400 mb-4">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Instruksi Terkirim!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kami telah mengirimkan tautan reset password ke email Anda. Silakan periksa kotak masuk
              dan folder spam Anda secara berkala.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Halaman Login</span>
        </Link>
      </div>
    </div>
  );
}
