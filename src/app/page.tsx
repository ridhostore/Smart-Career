import { Metadata } from "next";
import { LandingNavbar } from "@/features/landing/components/navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { CareerMatchSection } from "@/features/landing/components/career-match-section";
import { AiSection } from "@/features/landing/components/ai-section";
import { UniversitySection } from "@/features/landing/components/university-section";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { LandingFooter } from "@/features/landing/components/footer";

export const metadata: Metadata = {
  title: "Industry Mirror — Career Intelligence Platform for Economics Students",
  description:
    "Platform AI yang membantu mahasiswa ekonomi menemukan jalur karier terbaik berdasarkan performa akademik.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CareerMatchSection />
        <AiSection />
        <UniversitySection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
