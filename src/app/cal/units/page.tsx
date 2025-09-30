"use client";

// کتابخانه‌ها و کامپوننت‌ها
import { useState } from "react";
import { motion } from "framer-motion";

// کامپوننت‌های محلی
import Header from "@/components/ui/header";
import { UNITS } from "@/lib/db";
import { convertValue } from "@/lib/converter";
import UnitSelect from "@/components/UnitSelect";
import CategorySelect from "@/components/CategorySelect";

// صفحه تبدیل واحد
export default function UnitConverterPage() {
  // حالت‌ها (state) صفحه
  const [category, setCategory] = useState("length"); // دسته‌بندی انتخاب شده
  const [from, setFrom] = useState("m");             // واحد مبدأ
  const [to, setTo] = useState("cm");                // واحد مقصد
  const [value, setValue] = useState("");            // مقدار ورودی
  const [result, setResult] = useState("");          // نتیجه تبدیل

  // فیلتر واحدها بر اساس دسته‌بندی
  const filteredUnits = UNITS.filter((u) => u.category === category);

  // تابع تبدیل
  const handleConvert = () => {
    if (!value) return;                 // اگر ورودی خالی بود خروج
    const num = parseFloat(value);      
    if (isNaN(num)) {                   // بررسی معتبر بودن عدد
      setResult("ورودی نامعتبر");
      return;
    }
    // محاسبه نتیجه و ذخیره
    setResult(convertValue(category, from, to, num));
  };

  // توابع افزایش و کاهش مقدار ورودی
  const increment = () => setValue((prev) => String(Number(prev || 0) + 1));
  const decrement = () => setValue((prev) => String(Number(prev || 0) - 1));

  return (
    <div className="
      min-h-screen pt-16 flex flex-col items-center
      bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      p-4
    ">
      {/* هدر صفحه */}
      <Header />

      {/* کارت اصلی تبدیل واحد با انیمیشن */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          p-6 w-full max-w-md rounded-3xl
          shadow-xl backdrop-blur-md
          bg-white/20 dark:bg-black/20
          text-black dark:text-white
          flex flex-col gap-4
        "
      >
        {/* عنوان */}
        <h1 className="text-2xl font-extrabold text-center mb-4">🔄 تبدیل واحد</h1>

        {/* نمایش نتیجه با انیمیشن */}
        <motion.div
          key={result}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="
            p-5 text-center text-xl font-bold
            rounded-2xl min-h-[70px]
            bg-white/30 dark:bg-gray-800/50
            shadow-md backdrop-blur-md
            flex items-center justify-center
          "
        >
          {result || ""}
        </motion.div>

        {/* سلکت دسته‌بندی */}
        <CategorySelect category={category} setCategory={setCategory} />

        {/* ورودی عدد با اسپینر سفارشی */}
        <div className="relative w-full">
          <input
            type="number"
            min={0} // اجازه عدد منفی نمی‌دهد
            value={value}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              if (num < 0) {
                setValue("0"); // اگر منفی بود صفر می‌کنیم
              } else {
                setValue(e.target.value);
              }
            }}
            placeholder="عدد را وارد کنید"
            className="
              w-full px-5 py-3 rounded-2xl h-[70px]
              bg-white/30 dark:bg-gray-800/50
              border border-gray-200 dark:border-gray-700
              shadow-md text-center font-bold
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          {/* دکمه‌های + و - سفارشی */}
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col space-y-1">
            <button
              onClick={increment}
              className="
                w-6 h-6 bg-blue-500 dark:bg-blue-600
                text-white rounded-md
                hover:bg-blue-600 dark:hover:bg-blue-500
                flex items-center justify-center text-sm
                shadow-md
              "
            >
              +
            </button>
            <button
              onClick={decrement}
              className="
                w-6 h-6 bg-blue-500 dark:bg-blue-600
                text-white rounded-md
                hover:bg-blue-600 dark:hover:bg-blue-500
                flex items-center justify-center text-sm
                shadow-md
              "
            >
              −
            </button>
          </div>
        </div>

        {/* سلکت‌های واحد مبدأ و مقصد */}
        <div className="flex sm:flex-row items-center gap-2 mb-4 w-full">
          <UnitSelect value={from} setValue={setFrom} units={filteredUnits} />
          <span className="text-lg">➡️</span>
          <UnitSelect value={to} setValue={setTo} units={filteredUnits} />
        </div>

        {/* دکمه تبدیل با افکت انیمیشن */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleConvert}
          className="
            w-full py-4 rounded-2xl font-bold
            bg-blue-600 text-white hover:bg-blue-700
            transition shadow-md
          "
        >
          تبدیل کن
        </motion.button>
      </motion.div>
    </div>
  );
}
