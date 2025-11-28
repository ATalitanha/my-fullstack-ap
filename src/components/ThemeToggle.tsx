"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = saved ? saved === "dark" : preferDark;
    
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
      )}
    </button>
  );
};

export default ThemeSwitcher;