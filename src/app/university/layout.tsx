import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  BrainCircuit,
  LogOut,
  Building,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./MobileSidebar";

export default async function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Fetch the full university admin profile including university details
  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: {
      universityAdmin: {
        include: {
          university: true,
        },
      },
    },
  });

  if (!user || user.role !== "university" || !user.universityAdmin) {
    redirect("/login");
  }

  const adminProfile = user.universityAdmin;
  const universityName = adminProfile.university.name;

  // Logout server action handler
  async function handleLogout() {
    "use server";
    await logoutAction();
    redirect("/login");
  }

  const navigation = [
    {
      name: "Dashboard Overview",
      href: "/university/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Daftar Mahasiswa",
      href: "/university/students",
      icon: GraduationCap,
    },
    {
      name: "Analitik Karir & Kelas",
      href: "/university/analytics",
      icon: TrendingUp,
    },
    {
      name: "AI Penyelarasan Kurikulum",
      href: "/university/curriculum",
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card text-card-foreground shrink-0">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
          <Image
            src="/logo.png"
            alt="SmartCareer Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800"
          />
          <span className="font-extrabold text-base tracking-tight text-foreground">
            SmartCareer
          </span>
        </div>

        {/* University Admin Profile Card */}
        <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 mb-1">
            <Building className="h-4 w-4 text-blue-600 shrink-0" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider line-clamp-1">
              {universityName}
            </p>
          </div>
          <p className="font-bold text-sm text-foreground line-clamp-1">
            {user.fullName}
          </p>
          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
            {adminProfile.position || "Administrator Kampus"}
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-primary transition-all duration-200"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-border">
          <form action={handleLogout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Log out</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 text-card-foreground">
          <div className="flex items-center gap-3">
            <MobileSidebar
              universityName={universityName}
              userName={user.fullName}
              userEmail={user.email}
              position={adminProfile.position || "Administrator Kampus"}
              handleLogout={logoutAction}
            />
            <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-900 border border-border px-3 py-1 rounded-full flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Portal Akademik &bull; Kampus
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </header>

        {/* Page content scrollable */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
