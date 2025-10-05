"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChangeLog } from "@/components/change-log";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);

  const links = [
    { href: "/cal", label: "ماشین حساب", color: "from-blue-500 to-blue-700" },
    { href: "/messenger", label: "انتقال متن", color: "from-teal-500 to-teal-700" },
    { href: "/todo", label: "لیست کارها", color: "from-amber-500 to-orange-600" },
    { href: "/notes", label: "یادداشت‌ها", color: "from-purple-500 to-indigo-600" },
    { href: "/dashboard", label: "حساب کاربری", color: "from-pink-500 to-rose-600" },
    { href: "/login", label: "ورود / ثبت‌نام", color: "from-sky-500 to-cyan-600" },
    { href: "/Prices-table", label: "قیمت لحظه‌ای طلا و ارز", color: "from-green-500 to-emerald-600" },
  ];

  return (
    <>

      <main className="min-h-screen flex flex-col justify-center items-center pt-16 px-4 pb-16 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            خوش آمدید به <span className="text-blue-600 dark:text-blue-400">TanhaApp</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            مجموعه ابزارهای کاربردی و سریع در یک مکان ✨
          </p>
        </motion.div>

        {/* گرید کارت‌ها */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {links.map((link, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="rounded-2xl shadow-lg backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 overflow-hidden"
            >
              <Link
                href={link.href}
                className="flex flex-col items-center justify-center h-40 md:h-44 text-center text-gray-800 dark:text-gray-100 font-semibold text-lg relative group transition"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                />
                <span className="relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {link.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* دکمه تغییرات و تم */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={() => setIsChangeLogOpen(true)}
            className="px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md"
          >
            تغییرات نسخه
          </button>
          <ThemeToggle />
        </motion.div>
      </main>

      {/* مودال تغییرات */}
      <ChangeLog
        isOpen={isChangeLogOpen}
        onClose={() => setIsChangeLogOpen(false)}
      />
    </>
  );
}
