"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Menu, LogOut, UserCircle, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : preferDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-white/30 dark:border-gray-800/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" aria-hidden />
          <Link href="/" className="font-extrabold text-[clamp(1rem,2vw,1.25rem)] tracking-tight text-gray-900 dark:text-white">Modern Web</Link>
        </div>

        <NavigationMenu.Root>
          <NavigationMenu.List className="hidden md:flex items-center gap-6 text-sm">
            <NavigationMenu.Item>
              <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">خانه</Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">داشبورد</Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <Link href="/notes" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">یادداشت‌ها</Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <Link href="/todo" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">کارها</Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-3">
          <button
            aria-label={isDark ? "Switch to light" : "Switch to dark"}
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-full h-9 w-9 bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700/40 text-gray-800 dark:text-gray-200 hover:shadow-md"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
                  <UserCircle className="h-4 w-4" />
                  {user.username}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="min-w-[180px] rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 shadow-xl p-2">
                <DropdownMenu.Item asChild>
                  <Link href="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">پروفایل</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                <DropdownMenu.Item asChild>
                  <button onClick={logout} className="w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 inline-flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> خروج
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-gray-700/40 text-gray-700 dark:text-gray-200">ورود</Link>
              <Link href="/signup" className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">ثبت‌نام</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

