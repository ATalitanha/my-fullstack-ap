"use client";
import { useEffect } from "react";

export default function ThemeProvider() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : preferDark;
    document.documentElement.classList.toggle("dark", next);
  }, []);
  return null;
}

