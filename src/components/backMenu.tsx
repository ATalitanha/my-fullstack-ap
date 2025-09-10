<<<<<<< HEAD
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackMenu = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="border border-white/30 dark:border-black/30 dark:bg-gray-800/80 bg-gray-100/20 
        hover:bg-gray-700/50 dark:hover:bg-white/10 p-2 rounded-full 
        transition-all"
    >
      <ArrowLeft className="w-5 h-5 text-black dark:text-gray-200" />
    </button>
  );
};

export default BackMenu;
=======
import { ArrowLeft } from "lucide-react";

const BackMenu = () => {
    return (
        <a href="/">
            <button
            className="border border-white/30 dark:border-black/30 dark:bg-gray-800/80 bg-gray-100/20 
                hover:bg-gray-700/50 dark:hover:bg-white/10 p-2 rounded-full 
            transition-all"
        >
            <ArrowLeft className="w-5 h-5 text-black dark:text-gray-200"/>
        </button>
        </a>
    );
};

export default BackMenu;
>>>>>>> f6f5ea24dfe1143631d2b187580e7edf36b07876
