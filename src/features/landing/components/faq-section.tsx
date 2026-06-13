"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FaqSection() {
  const faqs = [
    {
      q: "Bagaimana sistem menentukan kecocokan karir saya?",
      a: "Sistem mencocokkan transkrip nilai Anda dengan bobot mata kuliah spesifik untuk suatu karir. Misalnya, jika Anda ingin menjadi Financial Analyst, mata kuliah seperti Manajemen Keuangan dan Akuntansi memiliki bobot kontribusi yang sangat tinggi dibandingkan dengan mata kuliah sosiologi. Perhitungan dihitung menggunakan formula weighted average.",
    },
    {
      q: "Apakah platform ini berbayar untuk mahasiswa?",
      a: "Tidak, platform ini 100% gratis untuk seluruh mahasiswa aktif di Indonesia. Anda dapat menginput nilai, melacak kecocokan karir, dan mendapatkan rekomendasi AI secara cuma-cuma.",
    },
    {
      q: "Bagaimana AI memberikan rekomendasi belajar?",
      a: "Kami mengintegrasikan Groq SDK (Llama-3.3) yang menganalisis nilai mata kuliah Anda secara kualitatif. AI mendeteksi letak kelemahan akademik Anda, lalu menyusun roadmap belajar terstruktur beserta sertifikasi profesional (seperti CFA, FMVA, dll.) yang disarankan.",
    },
    {
      q: "Bagaimana cara universitas mengintegrasikan data mahasiswanya?",
      a: "Pengelola program studi atau fakultas dapat mendaftarkan lisensi universitas. Melalui dashboard admin, universitas dapat mengunggah data kurikulum dan menyinkronkan profil akademik mahasiswa untuk analisis curriculum gap makro.",
    },
    {
      q: "Apakah data transkrip nilai saya aman?",
      a: "Sangat aman. Kami menggunakan sistem basis data Supabase PostgreSQL yang dilindungi oleh Row Level Security (RLS) berlapis. Informasi pribadi Anda tidak akan pernah disebarluaskan tanpa persetujuan Anda.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Pertanyaan yang Sering Diajukan
          </h3>
          <p className="text-muted-foreground font-light text-base sm:text-lg">
            Temukan jawaban cepat mengenai operasional platform, keamanan data, dan integrasi kecerdasan buatan.
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div
                key={idx}
                className="bg-card text-card-foreground border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                {/* Header / Question */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base">
                    <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Body / Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/30 font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
