"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";

// نوع داده کاربر
type User = { id: string; username: string };

export default function DashboardPage() {
  const router = useRouter();

  // State های اصلی
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * گرفتن access token از سرور یا refresh token
   * اگر موفق بود، اطلاعات کاربر در state ذخیره می‌شود
   * در غیر اینصورت به صفحه login هدایت می‌شود
   */
  const fetchAccessToken = async () => {
    try {
      const res = await fetch("/api/auth/refresh");
      const data = await res.json();

      if (res.ok) {
        setToken(data.accessToken);
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        console.log(payload);
        setUser({ id: payload.id, username: payload.username });
      } else {
        router.push("/login"); // هدایت به login در صورت خطا
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // فراخوانی دریافت توکن هنگام mount کامپوننت
  useEffect(() => {
    fetchAccessToken();
  }, []);

  /**
   * خروج کاربر
   * فراخوانی API logout و سپس هدایت به login
   */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // نمایش spinner در زمان لودینگ
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          در حال بارگذاری...
        </p>
      </div>
    );

  if (!user) return null; // اگر کاربر وجود نداشت، هیچ چیزی نمایش داده نشود

  return (
    <>
      {/* هدر سایت */}
      <Header />

      {/* کارت داشبورد */}
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${theme}
        bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-right
          backdrop-blur-xl bg-white/10 dark:bg-black/20 text-gray-900 dark:text-white"
        >
          {/* عنوان */}
          <h1 className="text-3xl font-bold text-center mb-6">داشبورد</h1>

          {/* اطلاعات کاربر */}
          <div className="bg-white/10 dark:bg-white/5 p-6 rounded-xl shadow-inner text-center space-y-3">
            <p className="text-xl font-semibold space-x-3">
              <span className="font-semibold">{user.username}</span>
              <span className="text-xl">خوش آمدی</span>
            </p>
          </div>

          {/* دکمه خروج */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleLogout}
            className="mt-6 p-3 rounded-xl bg-red-600 hover:bg-red-700 inline-block
            text-white font-semibold shadow-lg transition duration-300 cursor-pointer"
          >
            خروج
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
