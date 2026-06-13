import React from "react";
import { Sparkles, BrainCircuit, Check, CheckSquare } from "lucide-react";

export function AiSection() {
  const strengths = ["Analisis data makroekonomi kuantitatif", "Konsep dasar akuntansi & perpajakan kuat"];
  const skillGaps = ["Pemodelan keuangan otomatis (Excel VBA)", "Pengantar pemrograman R/Python"];
  const certs = [
    { name: "CFA Foundation", provider: "CFA Institute" },
    { name: "Financial Modeling & Valuation Analyst (FMVA)", provider: "CFI" },
  ];

  return (
    <section id="ai" className="py-20 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Visual AI Output Mockup */}
          <div className="flex justify-center order-last lg:order-first">
            <div className="w-full max-w-lg bg-card text-card-foreground border border-border/50 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
              {/* Dynamic top gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 to-amber-500" />
              
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <h4 className="text-base font-bold text-foreground">AI Career Intelligence Report</h4>
                </div>
                <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold px-2 py-0.5 rounded-full">
                  Llama-3.3 Analyzed
                </span>
              </div>

              {/* Strengths & Skill Gaps mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Kelebihan Akademik</h5>
                  <ul className="space-y-2">
                    {strengths.map((s, idx) => (
                      <li key={idx} className="flex gap-2 text-xs font-light text-foreground">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Gaps */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Skill Gap Terdeteksi</h5>
                  <ul className="space-y-2">
                    {skillGaps.map((s, idx) => (
                      <li key={idx} className="flex gap-2 text-xs font-light text-foreground">
                        <span className="h-4 w-4 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">!</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certifications suggested */}
              <div className="space-y-3 border-t border-border/50 pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-primary">Sertifikasi Rekomendasi AI</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certs.map((c, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-border/50 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-foreground line-clamp-1">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.provider}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap mock */}
              <div className="space-y-3 border-t border-border/50 pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Timeline Rencana Aksi (Roadmap)</h5>
                <div className="relative border-l border-border/80 pl-4 ml-2 space-y-4 text-xs font-light text-foreground">
                  <div className="relative">
                    <div className="absolute left-[-21px] top-0.5 h-3.5 w-3.5 rounded-full bg-teal-600 border-2 border-white dark:border-slate-950" />
                    <p className="font-bold text-foreground">Bulan 1: Fokus Pemodelan Finansial</p>
                    <p className="text-[10px] text-muted-foreground">Pelajari Excel formula tingkat lanjut dan valuasi arus kas (DCF).</p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-[-21px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-800 border-2 border-white dark:border-slate-950" />
                    <p className="font-bold text-foreground">Bulan 2-3: Persiapan Sertifikasi FMVA</p>
                    <p className="text-[10px] text-muted-foreground">Ambil modul e-learning CFI FMVA dan selesaikan studi kasus industri.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Ditenagai Generative AI Cerdas</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Analisis Karir Personal yang Diproduksi oleh AI
            </h3>

            <p className="text-muted-foreground font-light leading-relaxed">
              Mata kuliah dan transkrip hanyalah angka mentah. Kecerdasan Buatan kami menganalisis pola nilai mata kuliah
              Anda secara kualitatif untuk membangun rekomendasi belajar, roadmap sertifikasi, dan analisis kesenjangan skill.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                  <CheckSquare className="h-3 w-3" />
                </div>
                <span className="text-sm font-semibold text-foreground">Llama-3.3-70b Structured Prompt Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                  <CheckSquare className="h-3 w-3" />
                </div>
                <span className="text-sm font-semibold text-foreground">Validasi Keluaran Skema JSON Zod yang Ketat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                  <CheckSquare className="h-3 w-3" />
                </div>
                <span className="text-sm font-semibold text-foreground">Sistem Caching Rekomendasi 24 Jam demi Efisiensi</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
