"use client";

import { ChangeLog } from "@/components/change-log";
import ThemeToggle from "@/components/ThemeToggle";
import theme from "@/lib/theme";
import Link from "next/link";
import { useState } from "react";

export default function Calculator() {
  const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);
  return (
    <>
      <header className="fixed w-full flex justify-end p-4 h-16 top-0 bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-950
        transition-colors duration-500">
        <ThemeToggle />
      </header>
      <div className={`flex h-screen w-screen justify-center items-center ${theme}`}>
        <Link href={"/cal"} about="cal" className="inline-flex justify-center items-center py-2 px-5 m-5 rounded-xs bg-gray-500 hover:bg-gray-300 text-white">
          cal
        </Link>
        <button
          id="open"
          onClick={() => setIsChangeLogOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          باز کردن تغییرات
        </button>

        <ChangeLog isOpen={isChangeLogOpen} onClose={() => setIsChangeLogOpen(false)} />
      </div>
    </>
  );

};

