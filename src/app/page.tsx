"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChangeLog } from "@/components/change-log";
import { Search, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/constants/LanguageContext";
import {useTranslation} from "@/hooks/useLanguage";

export default function HomePage() {
  /**
   * وضعیت عمومی صفحه اصلی و ردیابی موقعیت ماوس برای افکت‌ها
   */
  const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const { t, language } = useTranslation();
  const { formatNumber, formatDate } = useLanguage();

  
  useEffect(() => {
    setIsLoading(false);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /**
   * انیمیشن اولیه بخش قهرمان با بارگذاری تنبل GSAP
   */
  useEffect(() => {
    let ctx: any;
    const run = async () => {
      const { gsap } = await import("gsap");
      if (!heroRef.current) return;
      ctx = gsap.context(() => {
        gsap.from(heroRef.current!, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        });
        if (titleRef.current) {
          gsap.from(titleRef.current!, {
            opacity: 0,
            y: 10,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
          });
        }
      });
    };
    run();
    return () => ctx?.revert?.();
  }, []);

  const links = [
    {
      href: "/cal",
      label: t("app.main.links.cal"),
      color: "from-blue-500 to-blue-700",
      icon: "🧮",
      category: t("app.main.links.category.tools"),
      popular: true
    },
    {
      href: "/messenger",
      label: t("app.main.links.messenger"),
      color: "from-teal-500 to-teal-700",
      icon: "💬",
      category: t("app.main.links.category.communication")
    },
    {
      href: "/todo",
      label: t("app.main.links.todo"),
      color: "from-amber-500 to-orange-600",
      icon: "✅",
      category: t("app.main.links.category.communication"),
      popular: true
    },
    {
      href: "/notes",
      label: t("app.main.links.notes"),
      color: "from-purple-500 to-indigo-600",
      icon: "📝",
      category: t("app.main.links.category.communication")
    },
    {
      href: "/Prices-table",
      label: t("app.main.links.Prices-table"),
      color: "from-green-500 to-emerald-600",
      icon: "📊",
      category: t("app.main.links.category.finance"),
      new: true
    },
  ];

  const filteredLinks = links.filter(link =>
    link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(links.map(link => link.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`
        }}
      />
      <main className="min-h-screen flex flex-col justify-center items-center px-4 pb-16 bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-row items-center justify-between w-full mb-6 relative z-10 pt-20"
        >
          <button
            onClick={() => setIsChangeLogOpen(true)}
            className="px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2"
          >
            <Sparkles size={18} />
            {t("app.main.change")}
          </button>
        </motion.div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative z-10"
          ref={heroRef}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-6"
          >
            <Sparkles size={16} />
            <span>{t("app.main.BestTools")}</span>
          </motion.div>
          <h1 ref={titleRef} className="font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight text-[clamp(2rem,4vw,3.5rem)]">
            {t("app.main.be")}<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">TanhaApp</span> {t("app.main.welcome")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            {t("app.main.productivity")}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative w-full max-w-2xl mb-8 z-10"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t("app.main.serchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg shadow-lg"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-center mb-8 z-10"
        >
          <button
            onClick={() => setSearchTerm("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${searchTerm === ""
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-700/60"
              }`}
          >
            {t("app.main.All")}
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSearchTerm(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${searchTerm === category
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-700/60"
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredLinks.map((link) => (
              <motion.div
                key={link.href}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                {link.popular && (
                  <div className="absolute -top-2 -right-2 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                      <TrendingUp size={12} />
                      <span>{t("app.main.visited")}</span>
                    </div>
                  </div>
                )}
                {link.new && (
                  <div className="absolute -top-2 -right-2 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      <Zap size={12} />
                      <span>{t("app.main.new")}</span>
                    </div>
                  </div>
                )}
                <div className="rounded-2xl shadow-xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700/40 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white/90 dark:group-hover:bg-gray-800/90">
                  <Link
                    href={link.href}
                    className="flex flex-col items-center justify-center h-44 text-center font-semibold text-lg relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-all duration-500`}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 space-y-3">
                      <div className="text-3xl">{link.icon}</div>
                      <span className="text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block">
                        {link.label}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                        {link.category}
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filteredLinks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 relative z-10"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {t("app.main.NoResults")}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {t('app.main.NoTools')} &quot;{searchTerm}&quot;
            </p>
          </motion.div>
        )}
      </main>
      <ChangeLog
        isOpen={isChangeLogOpen}
        onClose={() => setIsChangeLogOpen(false)}
      />
    </>
  );
}
