import React from "react";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rian Hermawan",
      role: "Alumni Manajemen Unpad",
      company: "Junior Analyst di BCA",
      content:
        "Platform ini sangat membantu saya menyadari kesenjangan skill. Berkat rekomendasi belajar AI untuk mengambil sertifikasi FMVA, saya bisa bersaing di dunia perbankan investasi.",
      rating: 5,
      avatar: "R",
    },
    {
      name: "Siti Rahma",
      role: "Mahasiswa Akuntansi UI",
      company: "Semester 7",
      content:
        "Fitur Fit Score-nya sangat memotivasi saya untuk memperbaiki nilai makroekonomi dan akuntansi biaya. Sekarang saya punya gambaran karir yang jelas sebelum lulus.",
      rating: 5,
      avatar: "S",
    },
    {
      name: "Dr. Bambang Utomo",
      role: "Kaprodi Pembangunan UGM",
      company: "Fakultas Ekonomi",
      content:
        "Industry Mirror memberikan data kurikulum gap analitik yang sangat berharga. Kami bisa merevisi fokus mata kuliah pilihan kami agar relevan dengan tuntutan pasar kerja saat ini.",
      rating: 5,
      avatar: "B",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Testimoni</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Apa Kata Mereka Tentang Kami?
          </h3>
          <p className="text-muted-foreground font-light text-base sm:text-lg">
            Ratusan mahasiswa dan pengelola program studi telah merasakan manfaat pemetaan karir berbasis data ilmiah.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card text-card-foreground border border-border/50 rounded-2xl p-6 transition-all duration-300 card-glow-hover flex flex-col justify-between space-y-6 relative"
            >
              {/* Quote Icon watermark */}
              <Quote className="absolute right-6 top-6 h-8 w-8 text-teal-500/10 shrink-0" />
              
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-sm text-foreground font-light leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* User Profile Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <Avatar className="h-10 w-10 border border-teal-500/20">
                  <AvatarFallback className="bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold text-sm">
                    {t.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {t.role} &bull; <span className="font-semibold text-primary">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
