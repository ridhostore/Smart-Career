import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Linkedin, Twitter, Github, Mail, Phone, MapPin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Info & Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Image
              src="/logo.png"
              alt="SmartCareer Logo"
              width={36}
              height={36}
              className="rounded-lg shadow-md border border-neutral-800"
            />
            <span>SmartCareer</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Platform intelijen karir terintegrasi kecerdasan buatan (AI) untuk membantu mahasiswa ekonomi
            menemukan potensi karir terbaik dan meminimalkan tingkat pengangguran terdidik.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="#features" className="hover:text-white transition-colors duration-200">
                Fitur Unggulan
              </Link>
            </li>
            <li>
              <Link href="#matching" className="hover:text-white transition-colors duration-200">
                Analisis Karir
              </Link>
            </li>
            <li>
              <Link href="#ai" className="hover:text-white transition-colors duration-200">
                AI Recommendation
              </Link>
            </li>
            <li>
              <Link href="#university" className="hover:text-white transition-colors duration-200">
                Untuk Universitas
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Resources */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Bantuan</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="#faq" className="hover:text-white transition-colors duration-200">
                FAQ / Tanya Jawab
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Syarat & Ketentuan
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kontak</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <span>Jakarta, Indonesia</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500 shrink-0" />
              <span>support@smartcareer.id</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-500 shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SmartCareer. All rights reserved.</p>
        <p>Dibuat untuk mencerdaskan generasi penerus bangsa Indonesia.</p>
      </div>
    </footer>
  );
}
