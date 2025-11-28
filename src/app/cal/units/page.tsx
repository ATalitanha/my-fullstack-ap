"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { UNITS } from "@/lib/db";
import { convertValue } from "@/lib/converter";
import UnitSelect from "@/components/UnitSelect";
import CategorySelect from "@/components/CategorySelect";
import { ArrowRightLeft, Minus, Plus } from "lucide-react";
import HybridLoading from "@/app/loading";

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [value, setValue] = useState("1");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const filteredUnits = UNITS.filter((u) => u.category === category);

  const handleConvert = () => {
    if (!value) return;
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("Invalid Input");
      return;
    }
    setResult(convertValue(category, from, to, num));
  };

  useEffect(() => {
    handleConvert();
  }, [value, from, to, category]);

  const increment = () => setValue((prev) => String(Number(prev || 0) + 1));
  const decrement = () => setValue((prev) => String(Math.max(0, Number(prev || 0) - 1)));

  if (isLoading) {
    return <HybridLoading />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">تبدیل واحد</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            تبدیل سریع و دقیق بین واحدهای مختلف اندازه‌گیری ✨
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-3xl mx-auto p-8 rounded-2xl glass-effect soft-shadow"
        >
          <div className="mb-6">
            <CategorySelect category={category} setCategory={setCategory} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* From */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">From</label>
              <UnitSelect value={from} setValue={setFrom} units={filteredUnits} />
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full p-4 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
                />
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col gap-1">
                  <button onClick={increment} className="w-6 h-6 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-md flex items-center justify-center hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 transition-colors"><Plus size={14} /></button>
                  <button onClick={decrement} className="w-6 h-6 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-md flex items-center justify-center hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 transition-colors"><Minus size={14} /></button>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
                className="p-3 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-full shadow-lg text-white"
              >
                <ArrowRightLeft size={24} />
              </motion.button>
            </div>

            {/* To */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-800 dark:text-zinc-200">To</label>
              <UnitSelect value={to} setValue={setTo} units={filteredUnits} />
              <div className="p-4 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 min-h-[58px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={result}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-bold text-xl text-zinc-900 dark:text-zinc-50"
                  >
                    {result}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}