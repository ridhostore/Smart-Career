"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileSidebarProps {
  universityName: string;
  userName: string;
  userEmail: string;
  position: string;
  handleLogout: () => void;
}

export default function MobileSidebar({
  universityName,
  userName,
  userEmail,
  position,
  handleLogout,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/university/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Analisis Kelulusan",
      href: "/university/analytics",
      icon: TrendingUp,
    },
    {
      name: "Kelola Mahasiswa",
      href: "/university/students",
      icon: GraduationCap,
    },
    {
      name: "AI Penyelarasan Kurikulum",
      href: "/university/curriculum",
      icon: BrainCircuit,
    },
  ];

  return (
    <>
      {/* Hamburger Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden text-foreground hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Drawer Overlay & Content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="relative flex w-72 max-w-xs flex-col bg-card text-card-foreground border-r border-border p-6 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Close Button */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center gap-2 pb-6 border-b border-border mb-4 mt-2">
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
            <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-900/50 mb-6">
              <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider line-clamp-1 mb-1">
                {universityName}
              </p>
              <p className="font-bold text-sm text-foreground line-clamp-1">
                {userName}
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {position}
              </p>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Section */}
            <div className="pt-4 border-t border-border mt-auto">
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
        </div>
      )}
    </>
  );
}
