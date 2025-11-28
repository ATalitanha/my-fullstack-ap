"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import Link from "next/link";
import { Calculator, ArrowRight, Ruler, Zap } from "lucide-react";
import HybridLoading from "../loading";

export default function Cal() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const calculatorTools = [
    {
      href: "/cal/calc",
      title: "ماشین حساب ساده",
      description: "محاسبات روزمره و عملیات پایه ریاضی",
      icon: Calculator,
      color: "text-cyan-500",
      delay: 0.1
    },
    {
      href: "/cal/units",
      title: "تبدیل واحد",
      description: "تبدیل بین واحدهای مختلف اندازه‌گیری",
      icon: Ruler,
      color: "text-violet-500",
      delay: 0.2
    },
    {
      href: "/cal/advanc-cal",
      title: "ماشین حساب پیشرفته",
      description: "محاسبات علمی و پیچیده با قابلیت‌های حرفه‌ای",
      icon: Zap,
      color: "text-pink-500",
      delay: 0.3
    }
  ];

  if (isLoading) {
    return <HybridLoading />;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      },
    }),
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">ابزارهای ماشین حساب</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            مجموعه‌ای کامل از ابزارهای محاسباتی برای نیازهای مختلف شما ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {calculatorTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.href}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              >
                <Link href={tool.href} className="block h-full">
                  <div className="glass-effect rounded-2xl soft-shadow h-full flex flex-col p-6 text-center items-center group">
                    <div className={`p-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 mb-4`}>
                      <IconComponent className={`${tool.color}`} size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                      {tool.title}
                    </h3>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed flex-1">
                      {tool.description}
                    </p>

                    <div className="mt-6 flex items-center justify-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                      <span>استفاده از ابزار</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
