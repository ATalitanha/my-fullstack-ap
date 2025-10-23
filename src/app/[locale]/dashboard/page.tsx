"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import theme from "@/lib/theme";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, User, LogOut, Sparkles, Settings, Activity } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

type UserData = { id: string; username: string; email?: string };

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchAccessToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh");
      const data = await res.json();
      if (res.ok) {
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        setUser({
          id: payload.id,
          username: payload.username,
          email: payload.email
        });
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAccessToken();
  }, [fetchAccessToken]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          {t('loading')}
        </p>
      </div>
    );

  if (!user) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`
        }}
      />
      <header dir="ltr"
        className={`fixed w-full flex justify-between p-4 h-16 top-0 z-50 bg-transparent`}>
        <Link
          href="/"
          className="flex justify-center items-center p-2 w-10 h-10 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Link>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full 0 text-blue-600 dark:text-blue-400 text-sm"
          >
            <User size={14} />
            <span>{user.username}</span>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>
      <div className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-6"
            >
              <Sparkles size={16} />
              <span>{t('yourAccount')}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {t('dashboard')}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              {t('manageAccount')}
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <User className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('userInformation')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t('viewAndManage')}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-4 border border-white/40 dark:border-gray-600/40">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('username')}</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{user.username}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-4 border border-white/40 dark:border-gray-600/40">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('emailAddress')}</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{user.email || t('notProvided')}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700/40">
                    <div className="flex items-center gap-3">
                      <Activity className="text-blue-500" size={20} />
                      <div>
                        <p className="text-blue-800 dark:text-blue-300 font-semibold">{t('accountStatus')}</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">{t('accountNormal')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  {t('quickActions')}
                </h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-200 text-left font-semibold text-sm"
                  >
                    {t('editProfile')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-200 text-left font-semibold text-sm"
                  >
                    {t('changePassword')}
                  </motion.button>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('accountManagement')}</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                >
                  <LogOut size={18} />
                  {t('logout')}
                </motion.button>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('recentActivities')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">12</div>
                  <p>{t('calculationsPerformed')}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">8</div>
                  <p>{t('messagesSent')}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">5</div>
                  <p>{t('unitConversions')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
