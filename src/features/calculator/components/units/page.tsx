"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/shared/components/ui/header";
import { UNITS } from "@/shared/lib/db";
import { convertValue } from "@/lib/converter";
import UnitSelect from "@/components/UnitSelect";
import CategorySelect from "@/components/CategorySelect";
import { Sparkles, ArrowRightLeft, Calculator } from "lucide-react";

export default function UnitConverterPage() {
  // حالت‌ها (state) صفحه
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ردیابی موقعیت ماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // فیلتر واحدها بر اساس دسته‌بندی
  const filteredUnits = UNITS.filter((u) => u.category === category);

  // تابع تبدیل
  const handleConvert = () => {
    if (!value) return;
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("ورودی نامعتبر");
      return;
    }
    setResult(convertValue(category, from, to, num));
  };

  // توابع افزایش و کاهش مقدار ورودی
  const increment = () => setValue((prev) => String(Number(prev || 0) + 1));
  const decrement = () => setValue((prev) => String(Number(prev || 0) - 1));

  return (
    <>
      {/* هدر صفحه */}
      <Header />

      {/* افکت دنبال کننده ماوس */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`
        }}
      />

      {/* بخش اصلی تبدیل واحد */}
      <div className="min-h-screen pt-16 transition-colors duration-700 relative z-10 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        
        {/* افکت‌های پس‌زمینه */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-12 relative z-10">
          
          {/* هدر صفحه */}
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
              <span>ابزار تبدیل واحد پیشرفته</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                تبدیل واحد
              </span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              تبدیل سریع و دقیق بین واحدهای مختلف اندازه‌گیری ✨
            </p>
          </motion.div>

          {/* کارت اصلی تبدیل واحد */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl p-8 rounded-3xl text-gray-700 dark:text-white backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700/40"
          >
            {/* نمایش نتیجه */}
            <motion.div
              key={result}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 text-center text-2xl font-bold rounded-2xl min-h-[100px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg border border-white/40 dark:border-gray-600/40 flex items-center justify-center mb-8"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={result}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-gray-800 dark:text-gray-100"
                >
                  {result || "نتیجه تبدیل اینجا نمایش داده می‌شود"}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* سلکت دسته‌بندی */}
            <div className="mb-6">
              <CategorySelect category={category} setCategory={setCategory} />
            </div>

            {/* ورودی عدد با اسپینر */}
            <div className="relative w-full mb-6">
              <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  if (num < 0) {
                    setValue("0");
                  } else {
                    setValue(e.target.value);
                  }
                }}
                placeholder="عدد را وارد کنید"
                className="w-full px-6 py-4 rounded-2xl h-[70px] bg-white/80 dark:bg-gray-700/80 border border-white/40 dark:border-gray-600/40 shadow-lg text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              />

              {/* دکمه‌های + و - */}
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col space-y-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={increment}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg shadow-blue-500/25"
                >
                  +
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={decrement}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg shadow-blue-500/25"
                >
                  −
                </motion.button>
              </div>
            </div>

            {/* سلکت‌های واحد مبدأ و مقصد */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full">
              <div className="flex-1">
                <UnitSelect value={from} setValue={setFrom} units={filteredUnits} />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
              >
                <ArrowRightLeft className="text-white" size={20} />
              </motion.div>
              
              <div className="flex-1">
                <UnitSelect value={to} setValue={setTo} units={filteredUnits} />
              </div>
            </div>

            {/* دکمه تبدیل */}
            <motion.button
              whileHover={{ 
                scale: 1.02,
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConvert}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Calculator size={20} />
              تبدیل کن
            </motion.button>
          </motion.div>

          {/* اطلاعات اضافی */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              پشتیبانی از واحدهای طول، وزن، حجم، دما و زمان
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}