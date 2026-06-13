import React from "react";
import { CheckCircle2, Award, Zap } from "lucide-react";

export function CareerMatchSection() {
  const calculations = [
    { course: "Analisis Laporan Keuangan", grade: 90, weight: 0.4, contribution: 36.0 },
    { course: "Manajemen Portofolio & Investasi", grade: 95, weight: 0.3, contribution: 28.5 },
    { course: "Makroekonomi Lanjutan", grade: 85, weight: 0.3, contribution: 25.5 },
  ];

  return (
    <section id="matching" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Explanation */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Zap className="h-3.5 w-3.5" />
              <span>Algoritma Pembobotan Ilmiah</span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Bagaimana Career Fit Score Dihitung?
            </h3>
            
            <p className="text-muted-foreground font-light leading-relaxed">
              Tidak semua mata kuliah memiliki bobot yang sama untuk setiap karir. Algoritma pembobotan kami
              mencocokkan nilai mata kuliah relevan dengan persentase kontribusi kompetensi karir tersebut di industri.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Normalisasi Nilai Konversi SKS</h4>
                  <p className="text-sm text-muted-foreground font-light">Nilai huruf (A, B, C) dikonversikan menjadi bobot numerik standar 0-100 secara presisi.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Pemetaan Bobot Relevansi Industri</h4>
                  <p className="text-sm text-muted-foreground font-light">Setiap mata kuliah memiliki bobot industri (Weight) berkisar antara 0 hingga 1.0.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Kalkulasi Formula Terbobot</h4>
                  <p className="text-sm text-muted-foreground font-light">
                    Menggunakan rumus matematis terstandar: <br />
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary font-mono block sm:inline mt-1 sm:mt-0">
                      Score = Σ(Grade × Weight) / Σ(Weight) × 100
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Math Table Mockup */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg bg-card text-card-foreground border border-border/50 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">Simulasi Perhitungan Bobot</h4>
                  <p className="text-xs text-muted-foreground">Target Karir: Investment Banker</p>
                </div>
                <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                  <Award className="h-3.5 w-3.5" />
                  90.0% Match (Excellent Fit)
                </span>
              </div>

              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold">
                        <th className="py-2">Mata Kuliah</th>
                        <th className="py-2 text-right">Nilai (G)</th>
                        <th className="py-2 text-right">Bobot (W)</th>
                        <th className="py-2 text-right">Kontribusi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs font-light text-foreground">
                      {calculations.map((c, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{c.course}</td>
                          <td className="py-3 text-right font-semibold">{c.grade}</td>
                          <td className="py-3 text-right">{c.weight * 100}%</td>
                          <td className="py-3 text-right font-semibold text-primary">{c.contribution.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Final Score Bar */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                    <span>Total Fit Score</span>
                    <span className="text-blue-600 dark:text-blue-400">90.0 / 100</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
