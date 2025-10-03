"use client";

import Header from "@/components/ui/header";
import LoadingDots from "@/components/loading";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBitcoin, FaDollarSign, FaCoins } from "react-icons/fa"; // آیکون‌ها

type Item = {
  name: string;
  symbol: string;
  price: number;
  unit: string;
  change_percent: number;
};

export default function PricesTableCards() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://brsapi.ir/Api/Market/Gold_Currency.php?key=BVLBk8QhPqMvEaupWpZTTNdy84AARZQ2");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  if (!data)
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );

  let items: Item[] = [];
  if (category === "all") items = [...data.gold, ...data.currency, ...data.cryptocurrency];
  else items = data[category];

  items = items.filter((item: Item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const getIcon = (symbol: string) => {
    if (symbol.toLowerCase().includes("btc")) return <FaBitcoin className="text-yellow-500 w-6 h-6" />;
    if (symbol.toLowerCase().includes("usd") || symbol.toLowerCase().includes("eur")) return <FaDollarSign className="text-green-500 w-6 h-6" />;
    return <FaCoins className="text-orange-400 w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-5xl mx-auto space-y-6 mt-16">
        {/* هدر و جستجو */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">📊 جدول قیمت‌ها</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="جستجو..."
              className="border border-blue-400 dark:border-indigo-500 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/30 dark:bg-black/30 text-right placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-blue-400 dark:border-indigo-500 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/30 dark:bg-black/30"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">همه</option>
              <option value="gold">طلا و سکه</option>
              <option value="currency">ارزها</option>
              <option value="cryptocurrency">رمزارزها</option>
            </select>
          </div>
        </div>

        {/* کارت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl shadow-xl p-4 bg-white/20 dark:bg-black/20 backdrop-blur-md flex flex-col justify-between hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-3">
                  {getIcon(item.symbol)}
                  <h2 className="font-bold text-gray-700 dark:text-indigo-300 text-lg">{item.name}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-200 mt-2">
                  قیمت: <span className="font-semibold">{item.price.toLocaleString()} {item.unit}</span>
                </p>
                <p className={`mt-1 font-semibold ${item.change_percent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  تغییرات: {item.change_percent}%
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
