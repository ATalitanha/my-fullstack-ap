"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import { Sparkles, UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";

export default function SignupPage() {
  // مقادیر فرم
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // وضعیت خطا و لودینگ
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const router = useRouter();

  // ردیابی موقعیت ماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // تابع ارسال فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message || "ثبت نام ناموفق بود");
      }
    } catch {
      setError("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* افکت دنبال کننده ماوس */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`
        }}
      />

      {/* بخش اصلی */}
      <div className={`min-h-screen mt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        
        {/* افکت‌های پس‌زمینه */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* هدر فرم */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-4"
              >
                <Sparkles size={16} />
                <span>ایجاد حساب کاربری جدید</span>
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  ثبت نام
                </span>
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                حساب کاربری خود را ایجاد کنید و از تمام امکانات استفاده نمایید ✨
              </p>
            </motion.div>

            {/* کارت فرم */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-8">
              
              {/* نمایش پیام خطا */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* فرم ثبت نام */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* فیلد نام کاربری */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    نام کاربری
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User size={20} />
                    </div>
                    <input
                      placeholder="نام کاربری خود را وارد کنید"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                      text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                      transition-all duration-200 text-right"
                    />
                  </div>
                </div>

                {/* فیلد ایمیل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    آدرس ایمیل
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail size={20} />
                    </div>
                    <input
                      placeholder="example@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                      text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                      transition-all duration-200 text-right"
                    />
                  </div>
                </div>

                {/* فیلد رمز عبور */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      placeholder="رمز عبور قوی انتخاب کنید"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                      text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                      transition-all duration-200 text-right"
                    />
                  </div>
                </div>

                {/* دکمه ثبت نام */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                  text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                  transition-all duration-200 flex items-center justify-center gap-2 
                  disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ثبت نام...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      ایجاد حساب کاربری
                    </>
                  )}
                </motion.button>
              </form>

              {/* لینک ورود */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  قبلاً حساب دارید؟{" "}
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="/login"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    وارد شوید
                  </motion.a>
                </p>
              </motion.div>
            </div>

            {/* اطلاعات امنیتی */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                اطلاعات شما با استانداردهای امنیتی محافظت می‌شود
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}