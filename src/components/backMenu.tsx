"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackMenu = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex justify-center items-center cursor-pointer 
        p-2 w-9 h-9 rounded-full transition"
    >
      <ArrowLeft className="w-5 h-5 text-black dark:text-gray-200" />
    </button>
  );
};

export default BackMenu;
