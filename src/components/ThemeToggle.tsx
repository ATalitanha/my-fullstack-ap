"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * A component that allows the user to switch between light and dark themes.
 * The selected theme is persisted in local storage.
 * @returns {JSX.Element} The theme switcher button.
 */
const ThemeSwitcher = () => {
  // وضعیت فعلی تم: تاریک یا روشن
  const [isDark, setIsDark] = useState(false);

  // Load the theme from local storage or system preference on initial render.
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

  /**
   * Toggles the theme between light and dark and saves the new theme to local storage.
   */
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
      className="flex justify-center items-center cursor-pointer 
        p-2 w-9 h-9 rounded-full transition"
    >
      {/* نمایش آیکون بسته به حالت تم */}
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
        
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
