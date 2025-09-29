"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { evaluate, format as mathFormat } from "mathjs";

type HistoryItem = {
  id: string;
  expr: string;
  result: string;
  at: number;
};

const SCI_BUTTONS = [
  "(", ")", "√(", "^", "!",
  "sin(", "cos(", "tan(", "asin(", "acos(", "atan(",
  "ln(", "log(", "abs(", "exp("
];

const BASIC_BUTTONS = [
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","%","+"
];

function formatResult(res: unknown) {
  // مقدار را تا حد امکان قابل‌خواندن کند (بدون صفرهای اضافی)
  try {
    if (typeof res === "number") {
      // اگر عدد صحیح است نمایش بدون ممیز
      if (Number.isInteger(res)) return `${res}`;
      // وگرنه با حداکثر 12 رقم معقول نمایش بده و صفرهای اضافی را حذف کن
      return parseFloat(res.toPrecision(12)).toString();
    }
    return String(res);
  } catch {
    return String(res);
  }
}

export default function AdvancedCalculatorPage() {
  const [expr, setExpr] = useState<string>("");
  const exprRef = useRef(expr);
  useEffect(() => { exprRef.current = expr; }, [expr]);

  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem("adv_calc_history");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const [scientific, setScientific] = useState<boolean>(false);

  useEffect(() => {
    try { localStorage.setItem("adv_calc_history", JSON.stringify(history)); } catch {}
  }, [history]);

  // محاسبه امن با mathjs
  const compute = (expression: string) => {
    if (!expression.trim()) {
      setError("عبارت خالی است.");
      setResult("");
      return;
    }
    try {
      // پیش‌پردازش: تبدیل علامت ضرب × یا ÷ اگر وارد شده
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
      const r = evaluate(sanitized);
      const formatted = formatResult(r);
      setResult(formatted);
      setError(null);

      // save history
      const item: HistoryItem = { id: Date.now().toString(), expr: expression, result: formatted, at: Date.now() };
      setHistory(prev => [item, ...prev].slice(0, 100)); // حداکثر 100 مورد نگه دار
      return formatted;
    } catch (e) {
      setResult("");
      setError("خطا در محاسبه — عبارت را بررسی کنید.");
      return null;
    }
  };

  const handleButton = (val: string) => {
    // اگر نتیجه موجود است و کاربر روی عملگر کلیک کرد، زنجیره‌سازی: نتیجه + operator
    const ops = ["+","-","*","/","^","%"];
    if (result && ops.includes(val) && !exprRef.current) {
      setExpr(result + val);
      setResult("");
      return;
    }
    setExpr(prev => prev + val);
  };

  const handleClear = () => {
    setExpr("");
    setResult("");
    setError(null);
  };

  const handleAllClear = () => {
    handleClear();
    setHistory([]);
    try { localStorage.removeItem("adv_calc_history"); } catch {}
  };

  const handleBackspace = () => {
    if (result) {
      // اگر نتیحه نمایش داده شده، حذف آن به معنی پاک شدن نتیجه است
      setResult("");
      return;
    }
    setExpr(prev => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    const res = compute(expr);
    // اگر محاسبه موفق بود، نگه داشتن expr به عنوان history انجام شده
    if (res !== null) {
      // keep expr as-is (کاربر ممکن است بخواهد آن را ویرایش کند)
    }
  };

  const handleUseHistory = (item: HistoryItem) => {
    // استفاده مجدد: قرار دادن result به عنوان expr
    setExpr(item.result);
    setResult("");
    setError(null);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if ((/^[0-9+\-*/().%^]$/).test(key)) {
        e.preventDefault();
        setExpr(prev => prev + key);
      } else if (key === "Enter") {
        e.preventDefault();
        handleEvaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key.toLowerCase() === "c") {
        // single C => backspace, shift+C => clear all
        if (e.shiftKey) handleAllClear();
        else handleClear();
      } else if (key === "q") {
        handleAllClear();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expr, result]);

  const lastHistory = useMemo(() => history.slice(0, 20), [history]);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 flex flex-col items-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl p-6 rounded-3xl shadow-xl backdrop-blur-md bg-white/20 dark:bg-black/20 text-black dark:text-white flex flex-col gap-4"
        >
          <h1 className="text-2xl font-extrabold text-center">🧠 ماشین‌حساب حرفه‌ای</h1>

          {/* نمایش خطا */}
          <div className="text-center min-h-[1.25rem]">
            {error && <div className="text-red-600 font-semibold">{error}</div>}
          </div>

          {/* نمایشگر ورودی */}
          <motion.div
            className="p-5 rounded-2xl min-h-[70px] bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-right font-mono text-lg break-words"
          >
            <div className="whitespace-pre-wrap">{expr || " "}</div>
          </motion.div>

          {/* نمایشگر نتیجه */}
          <motion.div
            key={result}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 rounded-2xl min-h-[70px] bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-right font-bold text-2xl"
          >
            {result || "—"}
          </motion.div>

          {/* کنترل‌ها: حالت scientific / basic */}
          <div className="flex items-center justify-between gap-2">
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

            <div className="flex gap-2">
              <button onClick={handleBackspace} className="px-3 py-2 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white">⌫</button>
              <button onClick={handleClear} className="px-3 py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white">C</button>
              <button onClick={handleAllClear} className="px-3 py-2 rounded-2xl bg-gray-300 hover:bg-gray-400 text-black">AC</button>
            </div>
          </div>

          {/* دکمه‌ها (grid) */}
          <div className="grid grid-cols-4 gap-2">
            {BASIC_BUTTONS.map(b => (
              <motion.button
                key={b}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (b === "%") handleButton("%");
                  else if (b === ".") handleButton(".");
                  else handleButton(b);
                }}
                className={`py-3 rounded-2xl font-bold ${["/","*","-","+"].includes(b) ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-200"}`}
              >
                {b}
              </motion.button>
            ))}

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleButton("(")}
              className="py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 font-bold"
            >
              (
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleButton(")")}
              className="py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 font-bold"
            >
              )
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { handleButton("10^("); }} // shorthand for 10^(
              className="py-3 rounded-2xl bg-indigo-500 text-white font-bold"
            >
              10^
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { handleButton("ANS"); }}
              className="py-3 rounded-2xl bg-indigo-500 text-white font-bold"
            >
              ANS
            </motion.button>
          </div>

          {/* scientific panel */}
          <AnimatePresence>
            {scientific && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-4 gap-2">
                {SCI_BUTTONS.map(s => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      // اگر ANS یا sqrt shorthand
                      if (s === "√(") handleButton("sqrt(");
                      else handleButton(s);
                    }}
                    className="py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-200 font-semibold"
                  >
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* تاریخچه */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">تاریخچه</h3>
              <div className="flex gap-2">
                <button onClick={() => setHistory([])} className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-700">پاک کن</button>
                <button onClick={() => { if (history.length) { setExpr(history[0].result); setResult(""); } }} className="px-2 py-1 rounded-lg bg-blue-600 text-white">استفاده آخرین</button>
              </div>
            </div>

            <div className="p-2 rounded-2xl bg-white/10 dark:bg-black/20 shadow-inner max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent">
              <AnimatePresence>
                {lastHistory.map(h => (
                  <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-3 mb-2 rounded-lg bg-white/20 dark:bg-gray-800/50 flex justify-between items-start">
                    <div className="text-right">
                      <div className="font-mono text-sm text-gray-800 dark:text-gray-200">{h.expr}</div>
                      <div className="font-bold text-lg">{h.result}</div>
                      <small className="text-xs text-gray-400">{new Date(h.at).toLocaleString()}</small>
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
