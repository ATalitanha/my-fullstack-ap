"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";

export default function SignupPage() {
  // مقادیر فرم
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  
  // وضعیت خطا و لودینگ
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // تابع ارسال فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // جلوگیری از رفرش صفحه
    setError(null);
    setLoading(true); // فعال شدن لودینگ

    try {
      // درخواست ثبت نام به سرور
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login"); // اگر موفق بود، به صفحه ورود هدایت می‌شود
      } else {
        setError("ثبت نام ناموفق بود"); // نمایش پیام خطا
      }
    } catch {
      setError("خطایی در ارتباط با سرور رخ داد."); // خطای شبکه یا سرور
    } finally {
      setLoading(false); // پایان لودینگ
    }
  };

  return (
    <>
      <Header />

      {/* کانتینر اصلی */}
      <div className={`min-h-screen flex items-center justify-center px-4 ${theme}`}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10 dark:bg-black/20 p-8"
        >
          {/* عنوان صفحه */}
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            ایجاد حساب کاربری
          </h1>

          {/* نمایش پیام خطا */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-red-500/80 text-white text-sm text-center font-semibold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* فرم ثبت نام */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* فیلد نام کاربری */}
            <input
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
            />

            {/* فیلد ایمیل */}
            <input
              placeholder="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
            />

            {/* فیلد رمز عبور */}
            <input
              placeholder="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
            />

            {/* دکمه ثبت نام */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 
              text-white font-semibold shadow-lg transition duration-300 cursor-pointer 
              disabled:opacity-50"
            >
              {loading ? "در حال ثبت نام..." : "ثبت نام"}
            </motion.button>
          </form>

          {/* لینک ورود برای کاربران قبلی */}
          <p className="text-center text-gray-500 dark:text-gray-300 text-sm mt-6">
            قبلاً حساب داری؟{" "}
            <a href="/login" className="text-indigo-400 hover:underline">
              ورود
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
