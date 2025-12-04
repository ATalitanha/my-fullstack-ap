"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChangeLog } from "@/components/change-log";
import { Search, Sparkles, Zap, TrendingUp, ArrowRight } from "lucide-react";
import Header from "@/components/ui/header";

export default function HomePage() {
  const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const links = [
    {
      href: "/cal",
      label: "ماشین حساب",
      description: "محاسبات ساده و پیشرفته",
      color: "from-blue-500 to-cyan-500",
      icon: "🧮",
      category: "ابزار",
      popular: true
    },
    {
      href: "/messenger",
      label: "انتقال متن",
      description: "ارسال و مدیریت پیام‌ها",
      color: "from-emerald-500 to-teal-500",
      icon: "💬",
      category: "ارتباطات"
    },
    {
      href: "/todo",
      label: "لیست کارها",
      description: "مدیریت وظایف روزانه",
      color: "from-amber-500 to-orange-500",
      icon: "✅",
      category: "ارتباطات",
      popular: true
    },
    {
      href: "/notes",
      label: "یادداشت‌ها",
      description: "ذخیره و سازماندهی یادداشت‌ها",
      color: "from-purple-500 to-violet-500",
      icon: "📝",
      category: "ارتباطات"
    },
    {
      href: "/Prices-table",
      label: "قیمت لحظه‌ای",
      description: "قیمت طلا، ارز و رمزارز",
      color: "from-green-500 to-emerald-500",
      icon: "📊",
      category: "مالی",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-8"
          >
            <button
              onClick={() => setIsChangeLogOpen(true)}
              className="glass rounded-2xl px-6 py-3 font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-200 flex items-center gap-2 shadow-soft"
            >
              <Sparkles className="w-5 h-5" />
              تغییرات نسخه
            </button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-200/50 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 text-sm mb-8 shadow-soft"
            >
              <Sparkles className="w-4 h-4" />
              <span>A Collection of the Best Tools</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              به{" "}
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                TanhaApp
              </span>{" "}
              خوش آمدید
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              مجموعه‌ای کامل از ابزارهای کاربردی و هوشمند برای بهبود بهره‌وری روزانه شما
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بین ابزارها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-6 pr-12 rounded-2xl glass border border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all duration-200 shadow-soft"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            <button
              onClick={() => setSearchTerm("")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                searchTerm === ""
                  ? "bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg"
                  : "glass text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/50"
              }`}
            >
              همه
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  searchTerm === category
                    ? "bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg"
                    : "glass text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/50"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.1 
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  {/* Badge */}
                  {(link.popular || link.new) && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg ${
                        link.popular ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-emerald-500 to-green-500"
                      }`}>
                        {link.popular ? <TrendingUp className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                        <span>{link.popular ? "پربازدید" : "جدید"}</span>
                      </div>
                    </div>
                  )}

                  <Link href={link.href} className="block h-full">
                    <div className="glass rounded-3xl p-8 h-full border border-white/20 dark:border-gray-700/50 shadow-soft hover:shadow-modern-lg transition-all duration-300 group-hover:border-primary-300/50 dark:group-hover:border-primary-700/50">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {link.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {link.label}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {link.description}
                        </p>
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {link.category}
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredLinks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                نتیجه‌ای یافت نشد
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                هیچ ابزاری با "{searchTerm}" مطابقت ندارد
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <ChangeLog
        isOpen={isChangeLogOpen}
        onClose={() => setIsChangeLogOpen(false)}
      />
    </>
  );
}