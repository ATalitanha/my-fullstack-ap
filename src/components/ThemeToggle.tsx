"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldUseDark = saved
      ? saved === "dark"
      : preferDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      title="تغییر تم"
      className="flex justify-center items-center border border-white/20 dark:border-black/30 dark:bg-gray-800/80 bg-gray-100/20 
        hover:bg-gray-700/80 dark:hover:bg-white/10 p-2 rounded-xs transition"
    >
      {isDark ? (
        
        <Moon className="w-5 h-5 text-gray-200" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
