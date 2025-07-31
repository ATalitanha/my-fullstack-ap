"use client";

import ThemeToggle from "@/components/ThemeToggle";
import theme from "@/lib/theme";
import Link from "next/link";

export default function Calculator() {

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
      </div>
    </>
  );

};

