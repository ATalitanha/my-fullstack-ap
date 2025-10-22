"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BackMenu = () => {
  return (
    <Link
      href="/"
      className="flex justify-center items-center p-2 w-10 h-10 rounded-xl transition-all duration-200"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </Link>
  );
};

export default BackMenu;
