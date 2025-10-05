"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { evaluate } from "mathjs";

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
      <div className="min-h-screen pt-16 flex flex-col items-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">

        {/* 🧩 باکس اصلی ماشین حساب */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl p-6 rounded-3xl shadow-xl backdrop-blur-md bg-white/20 dark:bg-black/20 text-black dark:text-white flex flex-col gap-4"
        >
          {/* عنوان */}
          <h1 className="text-2xl font-extrabold text-center">🧠 ماشین‌حساب حرفه‌ای</h1>

          {/* نمایش خطا */}
          <div className="text-center min-h-[1.25rem]">
            {error && <div className="text-red-600 font-semibold">{error}</div>}
          </div>

          {/* نمایش عبارت */}
          <motion.div className="p-5 rounded-2xl min-h-[70px] bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-right font-mono text-lg break-words">
            <div className="whitespace-pre-wrap">{expr || " "}</div>
          </motion.div>

          {/* نمایش نتیجه */}
          <motion.div
            key={result}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 rounded-2xl min-h-[70px] bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-right font-bold text-2xl"
          >
            {result || "—"}
          </motion.div>

          {/* دکمه‌های کنترلی بالا */}
          <div className="flex items-center justify-between gap-2">

            {/* دکمه حالت علمی و محاسبه */}
            <div className="flex gap-2">
              <button
                onClick={() => setScientific(s => !s)}
                className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold"
              >
                {scientific ? "Scientific ON" : "Scientific OFF"}
              </button>

              <button
                onClick={() => { if (expr) handleEvaluate(); }}
                className="px-4 py-2 rounded-2xl bg-blue-600 text-white font-bold"
              >
                محاسبه
              </button>
            </div>

            {/* دکمه‌های پاک‌سازی */}
            <div className="flex gap-2">
              <button onClick={handleBackspace} className="px-3 py-2 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white">⌫</button>
              <button onClick={handleClear} className="px-3 py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white">C</button>
              <button onClick={handleAllClear} className="px-3 py-2 rounded-2xl bg-gray-300 hover:bg-gray-400 text-black">AC</button>
            </div>
          </div>

          {/* دکمه‌های اصلی */}
          <div className="grid grid-cols-4 gap-2">
            {BASIC_BUTTONS.map(b => (
              <motion.button
                key={b}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleButton(b)}
                className={`py-3 rounded-2xl font-bold ${["/","*","-","+"].includes(b)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-200"
                }`}
              >
                {b}
              </motion.button>
            ))}
          </div>

          {/* دکمه‌های حالت علمی */}
          <AnimatePresence>
            {scientific && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-4 gap-2"
              >
                {SCI_BUTTONS.map(s => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleButton(s === "√(" ? "sqrt(" : s)}
                    className="py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-200 font-semibold"
                  >
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 📜 بخش تاریخچه */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">تاریخچه</h3>
              <div className="flex gap-2">
                <button onClick={() => setHistory([])} className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-700">پاک کن</button>
                <button onClick={() => { if (history.length) { setExpr(history[0].result); setResult(""); } }} className="px-2 py-1 rounded-lg bg-blue-600 text-white">استفاده آخرین</button>
              </div>
            </div>

            {/* لیست تاریخچه */}
            <div className="p-2 rounded-2xl bg-white/10 dark:bg-black/20 shadow-inner max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent">
              <AnimatePresence>
                {lastHistory.map(h => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 mb-2 rounded-lg bg-white/20 dark:bg-gray-800/50 flex justify-between items-start"
                  >
                    <div className="text-right">
                      <div className="font-mono text-sm text-gray-800 dark:text-gray-200">{h.expr}</div>
                      <div className="font-bold text-lg">{h.result}</div>
                      <small className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleUseHistory(h)} className="px-2 py-1 rounded-lg bg-yellow-500 text-white">استفاده</button>
                      <button onClick={() => handleDeleteHistory(h.id)} className="px-2 py-1 rounded-lg bg-red-600 text-white">حذف</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
