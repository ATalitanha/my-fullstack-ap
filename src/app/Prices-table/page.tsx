"use client";

import Header from "@/shared/components/ui/header";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBitcoin, FaDollarSign, FaCoins, FaSearch } from "react-icons/fa";
import { Sparkles, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import theme from "@/shared/lib/theme";

type Item = {
  name: string;
  symbol: string;
  price: number;
  unit: string;
  change_percent: number;
};

const categories = [
  { value: "all", label: "همه دسته‌بندی‌ها" },
  { value: "gold", label: "طلا و سکه" },
  { value: "currency", label: "ارزها" },
  { value: "cryptocurrency", label: "رمزارزها" },
];

export default function PricesTableCards() {
  const [data, setData] = useState<{gold: Item[], currency: Item[], cryptocurrency: Item[]} | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://brsapi.ir/Api/Market/Gold_Currency.php?key=BVLBk8QhPqMvEaupWpZTTNdy84AARZQ2"
        );
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          در حال بارگذاری اطلاعات بازار...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            خطا در دریافت اطلاعات بازار
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            لطفاً اتصال اینترنت خود را بررسی کنید
          </p>
        </div>
      </div>
    );
  }

  let items: Item[] = [];
  if (data) {
    if (category === "all") items = [...data.gold, ...data.currency, ...data.cryptocurrency];
    else items = data[category as keyof typeof data];
  }

  items = items.filter(
    (item: Item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (symbol: string, category: string) => {
    if (category === "cryptocurrency") return <FaBitcoin className="text-yellow-500 w-5 h-5" />;
    if (category === "currency") return <FaDollarSign className="text-green-500 w-5 h-5" />;
    return <FaCoins className="text-orange-400 w-5 h-5" />;
  };

  return (
    <>
      <Header />
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`,
        }}
      />
      <div
        className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-6"
            >
              <Sparkles size={16} />
              <span>اطلاعات لحظه‌ای بازار</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                قیمت‌های لحظه‌ای
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              پیگیری آنی قیمت طلا، ارز و رمزارزها ✨
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس نام یا نماد..."
                    className="w-full px-4 py-3 pr-10 rounded-2xl bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-gray-600/40 
                    text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                    transition-all duration-200 text-right"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-64 relative">
                <Select.Root value={category} onValueChange={setCategory}>
                  <Select.Trigger
                    className="
                      w-full px-4 py-3 pr-10 rounded-2xl
                      bg-white/60 dark:bg-gray-700/60
                      border border-white/40 dark:border-gray-600/40
                      flex justify-between items-center
                      text-gray-800 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                      shadow-md transition-all duration-200
                    "
                  >
                    <Select.Value>{categories.find((c) => c.value === category)?.label}</Select.Value>
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content
                      side="bottom"
                      align="start"
                      avoidCollisions={false}
                      position="popper"
                      className="
                        bg-white dark:bg-gray-800
                        rounded-2xl shadow-lg z-50
                        w-full sm:w-[200px] max-h-60
                        min-w-[var(--radix-select-trigger-width)]
                      "
                    >
                      <Select.Viewport
                        className="
                          p-2 h-full overflow-y-auto
                          scrollbar-thin
                          scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
                          scrollbar-thumb-rounded
                          scrollbar-track-transparent
                          hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
                          transition-all
                        "
                        style={{ scrollbarGutter: "stable" }}
                      >
                        {categories.map((cat) => (
                          <Select.Item
                            key={cat.value}
                            value={cat.value}
                            className="
                              p-3 rounded-lg cursor-pointer
                              hover:bg-blue-500 text-gray-500 dark:text-white
                              hover:text-white dark:hover:text-gray-700
                            "
                          >
                            <Select.ItemText>{cat.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.gold?.length || 0}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">طلا و سکه</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.currency?.length || 0}</div>
                <div className="text-sm text-green-600 dark:text-green-400">ارز</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.cryptocurrency?.length || 0}</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">رمزارز</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{items.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">نمایش داده شده</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-6 hover:shadow-3xl transition-all duration-300 group relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getIcon(item.symbol, category)}
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{item.symbol}</p>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-xl ${
                        item.change_percent >= 0
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {item.change_percent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">قیمت:</span>
                      <span className="font-bold text-gray-800 dark:text-white text-lg">{item.price.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">واحد:</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{item.unit}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">تغییرات:</span>
                      <span
                        className={`font-bold ${
                          item.change_percent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {item.change_percent >= 0 ? "+" : ""}
                        {item.change_percent}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none ${
                      item.change_percent >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {items.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">نتیجه‌ای یافت نشد</h3>
              <p className="text-gray-500 dark:text-gray-500">هیچ موردی با &quot;{search}&quot; مطابقت ندارد</p>
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center mt-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📊 اطلاعات بازار</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                اطلاعات نمایش داده شده به صورت لحظه‌ای از منابع معتبر دریافت می‌شود و ممکن است با تاخیر همراه باشد.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
