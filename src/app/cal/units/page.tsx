"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import { UNITS } from "@/lib/db";
import { convertValue } from "@/lib/converter";
import UnitSelect from "@/components/UnitSelect";
import CategorySelect from "@/components/CategorySelect";

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const filteredUnits = UNITS.filter((u) => u.category === category);

  const handleConvert = () => {
    if (!value) return;
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("ورودی نامعتبر");
      return;
    }
    setResult(convertValue(category, from, to, num));
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col items-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 w-full max-w-md rounded-3xl shadow-xl backdrop-blur-md bg-white/20 dark:bg-black/20 text-black dark:text-white flex flex-col gap-4"
      >
        <h1 className="text-2xl font-extrabold text-center mb-4">🔄 تبدیل واحد</h1>

        <motion.div
          key={result}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 text-center text-xl font-bold rounded-2xl min-h-[70px] bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
        >
          {result || ""}
        </motion.div>

        {/* سلکت دسته‌ها */}
        <CategorySelect category={category} setCategory={setCategory} />

        {/* ورودی */}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="عدد را وارد کنید"
          className="w-full p-4 rounded-2xl text-center font-bold bg-white/30 border border-gray-300 dark:bg-gray-800/50 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* سلکت‌های واحد */}
        <div className="flex sm:flex-row items-center gap-2 mb-4 w-full">
          <UnitSelect value={from} setValue={setFrom} units={filteredUnits} />
          <span className="text-lg">➡️</span>
          <UnitSelect value={to} setValue={setTo} units={filteredUnits} />
        </div>

        {/* دکمه تبدیل */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleConvert}
          className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          تبدیل کن
        </motion.button>
      </motion.div>
    </div>
  );
}
