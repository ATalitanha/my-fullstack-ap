"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import { Sparkles, LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // State های فرم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ردیابی موقعیت ماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /**
   * ارسال فرم ورود
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
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.error || "Incorrect email or password.");
      }
    } catch {
      setError("An error occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* افکت دنبال کننده ماوس */}
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`
        }}
      />

      {/* بخش اصلی */}
      <div className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>

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
                <span>Login to your account</span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Login
                </span>
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Log in to your account and use the features ✨
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

              {/* فرم ورود */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* فیلد ایمیل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    Email Address
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
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40
                      text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                      transition-all duration-200 text-right"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* دکمه ورود */}
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
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Login
                    </>
                  )}
                </motion.button>
              </form>

              {/* لینک ثبت‌نام */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="/signup"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign up
                  </motion.a>
                </p>
              </motion.div>

              {/* لینک فراموشی رمز عبور */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-4"
              >
                <a
                  href="/forgot-password"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Forgot your password?
                </a>
              </motion.div> */}
            </div>

            {/* اطلاعات امنیتی */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your information is protected by security standards
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}