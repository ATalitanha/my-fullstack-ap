"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  // وضعیت فعلی تم: تاریک یا روشن
  const [isDark, setIsDark] = useState(false);

  // بارگذاری اولیه وضعیت تم
  useEffect(() => {
    // بررسی تم ذخیره شده در localStorage
    const saved = localStorage.getItem("theme");

    // بررسی تم پیش‌فرض سیستم
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // تصمیم‌گیری: استفاده از تم ذخیره شده یا پیش‌فرض سیستم
    const shouldUseDark = saved ? saved === "dark" : preferDark;

    // اعمال کلاس dark روی تگ HTML
    document.documentElement.classList.toggle("dark", shouldUseDark);

    // به‌روزرسانی state
    setIsDark(shouldUseDark);
  }, []);

  // تابع تغییر تم
  const toggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // تغییر کلاس dark روی تگ HTML
    document.documentElement.classList.toggle("dark", newTheme);

    // ذخیره تم جدید در localStorage
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      title="تغییر تم"
      className="flex justify-center items-center border border-white/30 dark:border-black/30 
        dark:bg-gray-800/80 bg-gray-100/20 hover:bg-gray-700/50 dark:hover:bg-white/10 
        p-2 w-9 h-9 rounded-full transition"
    >
      {/* نمایش آیکون بسته به حالت تم */}
      {isDark ? (
        <Moon className="w-5 h-5 text-gray-200" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
