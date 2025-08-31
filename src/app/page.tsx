"use client";

import { useState } from "react";
import Link from "next/link";

// کامپوننت‌ها
import { ChangeLog } from "@/components/change-log";
import ThemeToggle from "@/components/ThemeToggle";
import theme from "@/lib/theme";

export default function Calculator() {
  // وضعیت نمایش پنجره ChangeLog
  const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);

  return (
    <>
      {/* هدر ثابت بالای صفحه با سوئیچ تم */}
      <header
        className="
          fixed w-full flex justify-end p-4 h-16 top-0
          bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300
          dark:from-gray-900 dark:via-gray-800 dark:to-gray-950
          transition-colors duration-500
        "
      >
        <ThemeToggle />
      </header>

      {/* محتوای اصلی */}
      <div
        className={`flex lg:flex-row flex-col h-screen w-screen px-14 justify-center items-stretch md:items-center ${theme}`}
      >
        {/* دکمه باز کردن Change Log */}
        <button
          id="open"
          onClick={() => setIsChangeLogOpen(true)}
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          باز کردن تغییرات
        </button>

        {/* پنجره ChangeLog */}
        <ChangeLog
          isOpen={isChangeLogOpen}
          onClose={() => setIsChangeLogOpen(false)}
        />
        {/* لینک‌ها به صفحات مختلف */}
        <Link
          href="/cal"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="cal"
        >
          ماشین حساب
        </Link>

        <Link
          href="/messenger"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="cal"
        >
          انتقال متن
        </Link>

        <Link
          href="/notes"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="cal"
        >
          یادداشت ها
        </Link>

        <Link
          href="/dashboard"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="cal"
        >
          حساب کاربری
        </Link>
        <Link
          href="/login"
          className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white"
          about="cal"
        >
          ورود/ثبت نام
        </Link>

        
      </div>
    </>
  );
}
