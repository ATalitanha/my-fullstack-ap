"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();

  // State های فرم
  const [email, setEmail]       = useState("");      // ایمیل وارد شده
  const [password, setPassword] = useState("");      // رمز عبور وارد شده
  const [error, setError]       = useState<string | null>(null); // پیام خطا
  const [loading, setLoading]   = useState(false);   // وضعیت loading

  /**
   * ارسال فرم ورود
   * - جلوگیری از ریفرش صفحه
   * - تماس با API /api/auth/login
   * - ذخیره توکن در localStorage و هدایت به داشبورد در صورت موفقیت
   * - نمایش خطا در صورت عدم موفقیت
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        // ذخیره توکن در مرورگر
        localStorage.setItem("token", data.token);
        router.push("/dashboard"); // هدایت به داشبورد
      } else {
        setError(data.error || "ورود ناموفق بود.");
      }
    } catch {
      setError("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* هدر سایت */}
      <Header />

      {/* کارت ورود */}
      <div className={`min-h-screen flex items-center justify-center px-4 ${theme}`}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/20 
          backdrop-blur-xl bg-white/10 dark:bg-black/20"
        >
          {/* عنوان */}
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            خوش آمدی ✨
          </h1>

          {/* نمایش خطا */}
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

          {/* فرم ورود */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ایمیل */}
            <input
              placeholder="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* رمز عبور */}
            <input
              placeholder="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* دکمه ورود */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 
              text-white font-semibold shadow-lg transition duration-300 cursor-pointer 
              disabled:opacity-50"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </motion.button>
          </form>

          {/* لینک ثبت‌نام */}
          <p className="text-center text-gray-500 dark:text-gray-300 text-sm mt-6">
            حساب نداری؟{" "}
            <a href="/signup" className="text-indigo-400 hover:underline">
              ثبت‌نام
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
