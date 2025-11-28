"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/shared/hooks/useAuth';
import Link from "next/link";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

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
        setError(data.error || "ایمیل یا رمز عبور اشتباه است.");
      }
    } catch {
      setError("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              <span className="text-gradient">ورود به سیستم</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              به حساب کاربری خود وارد شوید و از امکانات استفاده کنید ✨
            </p>
          </div>

          <div className="glass-effect rounded-2xl soft-shadow p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 text-right">
                  آدرس ایمیل
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                    <Mail size={20} />
                  </div>
                  <input
                    placeholder="example@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80
                    text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                    transition-all duration-200 text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 text-right">
                  رمز عبور
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                    <Lock size={20} />
                  </div>
                  <input
                    placeholder="رمز عبور خود را وارد کنید"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80
                    text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                    transition-all duration-200 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600
                text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10
                transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال ورود...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>ورود به حساب</span>
                  </>
                )}
              </motion.button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                حساب کاربری ندارید؟{" "}
                <Link
                  href="/signup"
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors"
                >
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              اطلاعات شما با استانداردهای امنیتی محافظت می‌شود
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}