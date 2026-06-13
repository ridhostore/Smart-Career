import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SmartCareer — Career Intelligence Platform",
    template: "%s | SmartCareer",
  },
  description:
    "Platform AI yang membantu mahasiswa ekonomi menemukan jalur karier terbaik berdasarkan performa akademik.",
  keywords: [
    "career intelligence",
    "mahasiswa ekonomi",
    "rekomendasi karir",
    "AI career platform",
    "smartcareer",
  ],
  authors: [{ name: "SmartCareer Team" }],
  creator: "SmartCareer",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "SmartCareer — Career Intelligence Platform",
    description:
      "Platform AI yang membantu mahasiswa ekonomi menemukan jalur karier terbaik berdasarkan performa akademik.",
    siteName: "SmartCareer",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCareer — Career Intelligence Platform",
    description:
      "Platform AI yang membantu mahasiswa ekonomi menemukan jalur karier terbaik berdasarkan performa akademik.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
