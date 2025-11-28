"use client";

import Header from "@/components/ui/header";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBitcoin, FaDollarSign, FaCoins } from "react-icons/fa";
import { TrendingUp, TrendingDown, DollarSign, Search, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import HybridLoading from "../loading";

type Item = { name: string; symbol: string; price: number; unit: string; change_percent: number };
type MarketData = { gold: Item[]; currency: Item[]; cryptocurrency: Item[] };
type Category = "all" | "gold" | "currency" | "cryptocurrency";

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "همه دسته‌بندی‌ها" },
  { value: "gold", label: "طلا و سکه" },
  { value: "currency", label: "ارزها" },
  { value: "cryptocurrency", label: "رمزارزها" },
];

export default function PricesTableCards() {
  const [data, setData] = useState<MarketData | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("https://brsapi.ir/Api/Market/Gold_Currency.php?key=BVLBk8QhPqMvEaupWpZTTNdy84AARZQ2");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <HybridLoading />;
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <DollarSign className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
        <p className="text-zinc-600 dark:text-zinc-300 text-lg">Error fetching market data.</p>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Please check your connection.</p>
      </div>
    </div>
  );

  let items = (category === "all") ? [...data.gold, ...data.currency, ...data.cryptocurrency] : data[category];
  items = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (itemCategory: Category) => {
    if (itemCategory === "cryptocurrency") return <FaBitcoin className="text-yellow-500" size={20} />;
    if (itemCategory === "currency") return <FaDollarSign className="text-green-500" size={20} />;
    return <FaCoins className="text-orange-400" size={20} />;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">قیمت‌های لحظه‌ای</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            پیگیری آنی قیمت طلا، ارز و رمزارزها ✨
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-2xl soft-shadow p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="جستجو..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select.Root value={category} onValueChange={(v) => setCategory(v as Category)}>
              <Select.Trigger className="w-full md:w-56 flex justify-between items-center px-4 py-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                <Select.Value />
                <Select.Icon><ChevronDown size={20} /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content position="popper" sideOffset={5} className="w-56 rounded-lg glass-effect soft-shadow z-10">
                  <Select.Viewport className="p-2">
                    {categories.map(c => (
                      <Select.Item key={c.value} value={c.value} className="px-4 py-2 rounded-md hover:bg-cyan-500/10 text-zinc-800 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer outline-none">
                        <Select.ItemText>{c.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item, index) => {
              const itemCategory = data.gold.some(i => i.symbol === item.symbol) ? 'gold' : data.currency.some(i => i.symbol === item.symbol) ? 'currency' : 'cryptocurrency';
              return (
                <motion.div
                  key={item.symbol}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                  className="glass-effect rounded-2xl soft-shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getIcon(itemCategory)}
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white">{item.name}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{item.symbol}</p>
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-full ${item.change_percent >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {item.change_percent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">قیمت:</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{item.price.toLocaleString()} {item.unit}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                      <span className="text-zinc-600 dark:text-zinc-400">تغییرات:</span>
                      <span className={`font-bold ${item.change_percent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {item.change_percent >= 0 ? "+" : ""}{item.change_percent}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {items.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <DollarSign className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">No results found.</h3>
            <p className="text-zinc-500">No items match your search for "{search}".</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
