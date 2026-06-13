import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Briefcase, TrendingUp } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
      {/* Left side panel - marketing (hidden on mobile) */}
      <div className="relative hidden w-full md:flex md:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-12 text-white border-r border-neutral-800">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-20%] h-[60%] w-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[60%] w-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
 
        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white/90 hover:text-white transition-colors duration-200">
            <Image
              src="/logo.png"
              alt="SmartCareer Logo"
              width={36}
              height={36}
              className="rounded-lg shadow-md border border-neutral-800"
            />
            <span>SmartCareer</span>
          </Link>
        </div>
 
        {/* Middle Content (Taglines & Brand Visuals) */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-transparent">
            Career Intelligence Platform for Economics Students
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed font-light">
            Platform berbasis AI yang memetakan kompetensi akademik dan nilai perkuliahan Anda langsung ke standar industri karir masa kini.
          </p>
 
          {/* Interactive Floating Dashboard Mockup elements */}
          <div className="mt-8 space-y-4">
            <div className="glass backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-200/60 font-semibold uppercase tracking-wider">Target Karir Teratas</p>
                <p className="text-sm font-semibold text-white">Financial Analyst — 92.5% Match Score</p>
              </div>
              <span className="text-xs bg-blue-500/25 text-blue-300 font-semibold px-2.5 py-0.5 rounded-full">
                Sangat Cocok
              </span>
            </div>
 
            <div className="glass backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors duration-300 ml-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-200/60 font-semibold uppercase tracking-wider">Rekomendasi Kurikulum</p>
                <p className="text-sm font-semibold text-white">Tingkatkan Nilai Akuntansi Keuangan II</p>
              </div>
              <span className="text-xs bg-blue-500/25 text-blue-300 px-2.5 py-0.5 rounded-full font-medium">
                AI Insight
              </span>
            </div>
          </div>
        </div>
 
        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} SmartCareer. All rights reserved.</p>
        </div>
      </div>

      {/* Right side panel - actual forms */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
