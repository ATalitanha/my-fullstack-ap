"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * A component that renders a back button.
 * When clicked, it navigates to the previous page in the browser's history.
 * @returns {JSX.Element} The back button component.
 */
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
