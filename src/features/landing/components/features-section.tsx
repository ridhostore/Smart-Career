import React from "react";
import { Cpu, TrendingUp, AlertTriangle, BookOpen, Link2, BarChart3 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Cpu className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Pemetaan Kompetensi AI",
      description: "Memetakan secara otomatis transkrip nilai kuliah dan SKS mahasiswa ke dalam standar kompetensi industri kerja nyata.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Fit Score Dinamis",
      description: "Menghitung kecocokan karir mahasiswa (0-100%) secara dinamis dan real-time berdasarkan peningkatan nilai akademis.",
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Analisis Skill Gap",
      description: "Menemukan kelemahan materi kuliah dan mendeteksi skill teknis yang masih kurang untuk menduduki posisi karir impian.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Rekomendasi Belajar AI",
      description: "Mendapatkan rekomendasi kurikulum, sertifikasi profesional, dan kursus eksternal yang dipersonalisasi oleh AI.",
    },
    {
      icon: <Link2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Portal Lowongan Kerja",
      description: "Dapatkan deep-link pencarian kerja langsung ke LinkedIn, Glints, dan JobStreet yang disaring khusus untuk kecocokan profil Anda.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Dashboard Universitas",
      description: "Analitis komprehensif bagi dosen pengelola prodi untuk meninjau rata-rata IPK, kesiapan industri, dan curriculum gap alumni.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Fitur Utama</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Layanan Terbaik untuk Persiapan Karir Masa Depanmu
          </h3>
          <p className="text-muted-foreground font-light text-base sm:text-lg">
            Sistem terintegrasi yang didesain khusus bagi mahasiswa ekonomi untuk menganalisis kesiapan kerja secara ilmiah.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-card text-card-foreground border border-border/50 rounded-2xl p-6 transition-all duration-300 card-glow-hover flex flex-col space-y-4"
            >
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shrink-0">
                {f.icon}
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-foreground">{f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
