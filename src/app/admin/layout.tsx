import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Settings,
  Scale,
  Users,
  LogOut,
  Shield,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
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

  // Fetch and verify the admin role
  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Logout server action handler
  async function handleLogout() {
    "use server";
    await logoutAction();
    redirect("/login");
  }

  const navigation = [
    {
      name: "Dashboard Monitor",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kelola Universitas",
      href: "/admin/universities",
      icon: Building2,
    },
    {
      name: "Kelola Program Studi",
      href: "/admin/programs",
      icon: GraduationCap,
    },
    {
      name: "Kelola Mata Kuliah",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Kelola Target Karir",
      href: "/admin/careers",
      icon: Briefcase,
    },
    {
      name: "Kelola Bobot Karir",
      href: "/admin/weights",
      icon: Scale,
    },
    {
      name: "Kelola Pengguna",
      href: "/admin/users",
      icon: Users,
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

        {/* Admin Card */}
        <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-rose-500 shrink-0" />
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              System Admin
            </p>
          </div>
          <p className="font-bold text-sm text-foreground line-clamp-1">
            {user.fullName}
          </p>
          <p className="text-[10px] text-muted-foreground line-clamp-1">
            Super Administrator
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
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
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 text-card-foreground">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-900 border border-border px-3 py-1 rounded-full flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              Console Administrator
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            {/* Simple Mobile Logout Button */}
            <form action={handleLogout} className="md:hidden">
              <Button size="icon" variant="ghost" className="text-red-600">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
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
