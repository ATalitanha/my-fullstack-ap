"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { evaluate } from "mathjs";
import { Sparkles, Calculator, History, Trash2, RotateCcw, ArrowLeft } from "lucide-react";

// ✳️ تعریف نوع داده برای آیتم‌های تاریخچه
type HistoryItem = {
  id: string;
  expr: string;      // عبارت ورودی کاربر
  result: string;    // نتیجه محاسبه‌شده
  createdAt: string; // زمان ایجاد رکورد
};

// ✳️ دکمه‌های حالت علمی (Scientific Mode)
const SCI_BUTTONS = [
  "(", ")", "√(", "^", "!",
  "sin(", "cos(", "tan(", "asin(", "acos(", "atan(",
  "ln(", "log(", "abs(", "exp("
];

// ✳️ دکمه‌های پایه (Basic)
const BASIC_BUTTONS = [
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","%","+"
];

// ✳️ تابع فرمت خروجی محاسبه (برای نمایش بهتر اعداد)
function formatResult(res: unknown) {
  try {
    if (typeof res === "number") {
      if (Number.isInteger(res)) return `${res}`;
      return parseFloat(res.toPrecision(12)).toString();
    }
    return String(res);
  } catch {
    return String(res);
  }
}

// ⚙️ کامپوننت اصلی ماشین‌حساب پیشرفته
export default function AdvancedCalculatorPage() {
  // ✳️ حالت‌ها (States)
  const [expr, setExpr] = useState<string>("");        // عبارت فعلی کاربر
  const exprRef = useRef(expr);                        // مرجع برای عبارت (برای رویدادهای کلید)
  const [result, setResult] = useState<string>("");    // نتیجه نهایی
  const [error, setError] = useState<string | null>(null); // پیام خطا
  const [history, setHistory] = useState<HistoryItem[]>([]); // تاریخچه محاسبات
  const [scientific, setScientific] = useState<boolean>(false); // وضعیت حالت علمی
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ردیابی موقعیت ماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🌀 به‌روزرسانی ref در هر تغییر عبارت
  useEffect(() => { exprRef.current = expr; }, [expr]);

  // 📜 گرفتن تاریخچه از دیتابیس هنگام بارگذاری اولیه صفحه
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/adhistory");
        const data = await res.json();
        setHistory(data);
      } catch {}
    };
    fetchHistory();
  }, []);

  // 💾 ذخیره رکورد جدید در تاریخچه (در دیتابیس و state)
  const saveHistory = async (expr: string, result: string) => {
    try {
      const res = await fetch("/api/adhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expr, result }),
      });
      const data = await res.json();
      setHistory(prev => [data, ...prev.slice(0, 99)]); // نگه‌داری حداکثر ۱۰۰ رکورد
    } catch {}
  };

  // 🗑 حذف یک آیتم از تاریخچه
  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch("/api/adhistory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch {}
  };

  // 🧮 انجام محاسبه عبارت کاربر
  const compute = async (expression: string) => {
    if (!expression.trim()) {
      setError("عبارت خالی است.");
      setResult("");
      return;
    }
    try {
      // جایگزینی نمادهای خاص با فرمت قابل‌فهم برای mathjs
      const sanitized = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/%/g, "/100");

      // ارزیابی عبارت و فرمت نتیجه
      const r = evaluate(sanitized);
      const formatted = formatResult(r);

      setResult(formatted);
      setError(null);

      // ذخیره در تاریخچه
      await saveHistory(expression, formatted);
      return formatted;
    } catch {
      setResult("");
      setError("خطا در محاسبه — عبارت را بررسی کنید.");
      return null;
    }
  };

  // 🧩 مدیریت کلیک دکمه‌ها
  const handleButton = (val: string) => {
    const ops = ["+","-","*","/","^","%"];

    // اگر نتیجه موجود باشد و کاربر عملگر وارد کند، از نتیجه به عنوان ورودی جدید استفاده شود
    if (result && ops.includes(val) && !exprRef.current) {
      setExpr(result + val);
      setResult("");
      return;
    }

    // در غیر این صورت مقدار جدید را به انتهای عبارت اضافه کن
    setExpr(prev => prev + val);
  };

  // ✴️ توابع کنترلی
  const handleClear = () => { setExpr(""); setResult(""); setError(null); }; // پاک کردن عبارت
  const handleAllClear = () => { handleClear(); setHistory([]); };           // پاک کردن کامل (عبارت + تاریخچه)
  const handleBackspace = () => { if (result) setResult(""); else setExpr(prev => prev.slice(0, -1)); }; // حذف آخرین کاراکتر
  const handleEvaluate = () => { compute(expr); };                           // محاسبه نهایی
  const handleUseHistory = (item: HistoryItem) => { setExpr(item.result); setResult(""); setError(null); }; // استفاده از نتیجه تاریخچه

  // ⌨️ مدیریت میانبرهای صفحه‌کلید
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;

      // ورود عدد یا عملگر
      if ((/^[0-9+\-*/().%^]$/).test(key)) {
        e.preventDefault();
        setExpr(prev => prev + key);
      }
      // اجرای محاسبه با Enter
      else if (key === "Enter") {
        e.preventDefault();
        handleEvaluate();
      }
      // حذف با Backspace
      else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      }
      // پاک‌سازی (C یا Shift+C یا Q)
      else if (key.toLowerCase() === "c") {
        if (e.shiftKey) handleAllClear(); else handleClear();
      } else if (key === "q") {
        handleAllClear();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expr, result]);

  // ✳️ فقط ۲۰ رکورد آخر تاریخچه نمایش داده می‌شود
  const lastHistory = useMemo(() => history.slice(0, 20), [history]);

  // 🎨 رابط کاربری
  return (
    <>
      <Header />

      {/* افکت دنبال کننده ماوس */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`
        }}
      />

      {/* بخش اصلی ماشین‌حساب */}
      <div className="min-h-screen mt-16 transition-colors duration-700 relative z-10 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        
        {/* افکت‌های پس‌زمینه */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          
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
              <span>ماشین حساب پیشرفته با قابلیت‌های علمی</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                ماشین حساب حرفه‌ای
              </span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              محاسبات پیچیده ریاضی با قابلیت‌های علمی پیشرفته ✨
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* بخش اصلی ماشین حساب */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {/* نمایش خطا */}
              <div className="text-center mb-6 min-h-[2rem]">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 backdrop-blur-lg"
                    >
                      <span className="text-red-700 dark:text-red-300 font-semibold">
                        {error}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* کارت اصلی ماشین حساب */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 overflow-hidden">
                
                {/* نمایشگرها */}
                <div className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
                  <div className="relative z-10 space-y-4">
                    {/* نمایش عبارت */}
                    <div className="text-right font-mono text-lg break-words min-h-[2rem]">
                      {expr || " "}
                    </div>
                    {/* نمایش نتیجه */}
                    <motion.div
                      key={result}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-right font-bold text-3xl md:text-4xl min-h-[3rem]"
                    >
                      {result || "—"}
                    </motion.div>
                  </div>
                </div>

                {/* دکمه‌های کنترلی */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-3 justify-between">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setScientific(s => !s)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                          scientific 
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {scientific ? "حالت علمی 🔬" : "حالت علمی"}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEvaluate}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg shadow-green-500/25"
                      >
                        محاسبه
                      </motion.button>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBackspace}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                      >
                        ⌫
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClear}
                        className="px-3 py-2 rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/25"
                      >
                        C
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAllClear}
                        className="px-3 py-2 rounded-xl bg-gray-500 text-white shadow-lg shadow-gray-500/25"
                      >
                        AC
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* دکمه‌های اصلی */}
                <div className="p-6">
                  {/* دکمه‌های علمی */}
                  <AnimatePresence>
                    {scientific && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-4 gap-3 mb-4"
                      >
                        {SCI_BUTTONS.map(s => (
                          <motion.button
                            key={s}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleButton(s === "√(" ? "sqrt(" : s)}
                            className="py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 font-semibold"
                          >
                            {s}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* دکمه‌های پایه */}
                  <div className="grid grid-cols-4 gap-3">
                    {BASIC_BUTTONS.map(b => (
                      <motion.button
                        key={b}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleButton(b)}
                        className={`py-4 rounded-2xl font-bold text-lg transition-all ${
                          ["/","*","-","+"].includes(b)
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {b}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* پنل تاریخچه */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 h-full">
                
                {/* هدر تاریخچه */}
                <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <History className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">تاریخچه</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">محاسبات اخیر</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { if (history.length) { setExpr(history[0].result); setResult(""); } }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                        title="استفاده از آخرین نتیجه"
                      >
                        <RotateCcw size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setHistory([])}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="پاک کردن تاریخچه"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* لیست تاریخچه */}
                <div className="p-4 h-[600px] overflow-y-auto">
                  <AnimatePresence>
                    {lastHistory.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 text-gray-500 dark:text-gray-400"
                      >
                        <History size={48} className="mx-auto mb-4 opacity-50" />
                        <p>تاریخچه‌ای وجود ندارد</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {lastHistory.map((h, index) => (
                          <motion.div
                            key={h.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border border-white/40 dark:border-gray-600/40 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => handleUseHistory(h)}
                          >
                            <div className="text-right mb-2">
                              <div className="font-mono text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                {h.expr}
                              </div>
                              <div className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                = {h.result}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <small className="text-xs text-gray-400">
                                {new Date(h.createdAt).toLocaleString('fa-IR')}
                              </small>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHistory(h.id);
                                }}
                                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              >
                                حذف
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}