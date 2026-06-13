"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Dynamic blurred colored background blobs */}
      <div className="absolute top-[10%] left-[-10%] h-[35%] w-[35%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow" />
      <div className="absolute top-[30%] right-[-10%] h-[35%] w-[35%] rounded-full bg-amber-500/10 blur-[100px] animate-pulse-slow" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text content side */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Platform Karir Mahasiswa Ekonomi No.1 di Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-foreground">
              Beri Arah Karirmu dengan <span className="gradient-text font-black">AI Career Intelligence</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              Ubah performa akademik dan nilai SKS perkuliahan ekonomi Anda menjadi analitik kesiapan karir yang
              akurat. Temukan kesenjangan keahlian, dapatkan roadmap belajar AI, dan jelajahi ribuan lowongan
              kerja terkurasi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 gap-2">
                  <span>Mulai Analisis Karir</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium">
                  Pelajari Fitur
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/50 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-foreground">10k+</p>
                <p className="text-xs text-muted-foreground">Mahasiswa Terdaftar</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">50+</p>
                <p className="text-xs text-muted-foreground">Univ Terintegrasi</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-xs text-muted-foreground">Akurasi Rekomendasi</p>
              </div>
            </div>
          </div>

          {/* Interactive Floating Mockup side */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md animate-float">
              {/* Decorative behind glow card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl blur-[20px] opacity-25" />

              {/* Main glass card mockup */}
              <div className="relative bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-2xl space-y-6">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Kecerdasan Buatan AI</h4>
                      <p className="text-[10px] text-muted-foreground">Terakhir diperbarui: Baru saja</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/20">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                {/* Score section */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between border border-border/50">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Jalur Karir Pilihan</p>
                    <p className="text-base font-extrabold text-foreground">Investment Banker</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Kecocokan (Fit Score)</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">92.4%</p>
                  </div>
                </div>

                {/* Skill Gaps List mock */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Analisis Kesenjangan Skill</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-border/30">
                      <span className="font-medium">Valuasi Keuangan (DCF/LBO)</span>
                      <span className="text-emerald-500 font-semibold">Tinggi (Kuasai)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-border/30">
                      <span className="font-medium">Pemodelan Keuangan (Excel)</span>
                      <span className="text-emerald-500 font-semibold">Cukup (Mata Kuliah: A)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="font-medium">Sertifikasi CFA Level 1</span>
                      <span className="text-amber-500 font-semibold">Rekomendasi Baru</span>
                    </div>
                  </div>
                </div>

                {/* Decorative visual charts mockup */}
                <div className="pt-2">
                  <div className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/20 border border-blue-500/20 flex items-center justify-center relative overflow-hidden">
                    <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">Menghitung Proyeksi Gaji: Rp 12.5M - 18M/tahun</span>
                    {/* decorative wave lines inside */}
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500/40" />
                  </div>
                </div>

              </div>

              {/* Smaller overlay card 1 */}
              <div className="absolute top-[-30px] right-[-30px] hidden sm:block bg-background border border-border p-3 rounded-lg shadow-xl flex items-center gap-2 max-w-[150px]">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  GPA
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Rata-rata IPK</p>
                  <p className="text-sm font-extrabold">3.82 / 4.0</p>
                </div>
              </div>

              {/* Smaller overlay card 2 */}
              <div className="absolute bottom-[-20px] left-[-30px] hidden sm:block bg-background border border-border p-3 rounded-lg shadow-xl flex items-center gap-2 max-w-[170px]">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  AI
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Rekomendasi Kursus</p>
                  <p className="text-xs font-bold">Financial Modeling</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
