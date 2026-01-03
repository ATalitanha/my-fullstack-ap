import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/30 dark:border-gray-800/30 bg-white/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Modern Web 2026</div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Frontend aligned with accessibility, performance, and integration.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">خانه</Link>
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">داشبورد</Link>
          <Link href="/notes" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">یادداشت‌ها</Link>
        </div>
        <div className="flex items-center md:items-end justify-between md:justify-end gap-4">
          <span className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()}</span>
          <Link href="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">حریم خصوصی</Link>
        </div>
      </div>
    </footer>
  );
}

