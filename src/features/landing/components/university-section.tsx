import { GraduationCap, BarChart3, Users, ArrowUpRight } from "lucide-react";

export function UniversitySection() {
  return (
    <section id="university" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Solusi untuk Pendidikan Tinggi</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Tingkatkan Keterserapan Kerja Lulusan Kampus Anda
            </h3>

            <p className="text-muted-foreground font-light leading-relaxed">
              Jembatani kesenjangan antara kurikulum akademik dengan tuntutan dunia kerja riil.
              Dashboard khusus universitas kami menyajikan data intelijen secara agregat untuk program studi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Users className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-foreground">Pemantauan Agregat</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Lihat distribusi IPK mahasiswa, kemajuan semester, dan pilihan target karir per program studi.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-foreground">Curriculum Gap Analysis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Ketahui mata kuliah mana yang kinerjanya kurang mendukung kesiapan kerja mahasiswa berdasarkan rekomendasi AI.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Visual Mockup */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg bg-card text-card-foreground border border-border/50 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">Dashboard Pengelola Fakultas</h4>
                  <p className="text-xs text-muted-foreground">Fakultas Ekonomi dan Bisnis</p>
                </div>
                <span className="text-xs text-primary font-semibold flex items-center gap-1">
                  Selengkapnya <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              {/* Stats Cards grid inside mockup */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-border/50 rounded-xl">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Mahasiswa</p>
                  <p className="text-base font-black text-foreground">1,482</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-border/50 rounded-xl">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Rata-rata IPK</p>
                  <p className="text-base font-black text-foreground">3.45</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-border/50 rounded-xl">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg Fit Score</p>
                  <p className="text-base font-black text-foreground">84.2%</p>
                </div>
              </div>

              {/* Course ranking visual bar mock */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performa Kesiapan Karir Terpopuler</p>
                
                <div className="space-y-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between font-light">
                      <span>Investment Analyst</span>
                      <span className="font-semibold text-teal-600">88.5% Fit</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-light">
                      <span>Corporate Accountant</span>
                      <span className="font-semibold text-teal-600">82.0% Fit</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-light">
                      <span>Data Analyst (Econ)</span>
                      <span className="font-semibold text-teal-600">74.5% Fit</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "74%" }} />
                    </div>
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
