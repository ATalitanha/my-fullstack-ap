"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { evaluate } from "mathjs";

// کامپوننت‌ها
import Header from "@/shared/components/ui/header";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList";
import theme from "@/shared/lib/theme";

// هوک و ثابت‌ها
import { useCalculatorHistory } from "@/features/calculator/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";
import { AlertTriangle, Trash2, Sparkles } from "lucide-react";

export default function Calculator() {
  // وضعیت‌های داخلی
  const [expression, setExpression] = useState("");  // عبارت فعلی
  const expressionRef = useRef(expression);          // ریفرنس برای دسترسی در callbackها
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // موقعیت ماوس

  const [result, setResult] = useState("");          // نتیجه محاسبه
  const [showConfirm, setShowConfirm] = useState(false); // نمایش پنجره تایید پاک کردن تاریخچه
  const [parenError, setParenError] = useState(false);   // خطا در پرانتزها
  const [evalError, setEvalError] = useState<string | null>(null); // خطای محاسبه

  // تاریخچه ماشین‌حساب
  const {
    history,
    loading,
    setHistory,
    saveHistory,
    deleteServerHistory,
  } = useCalculatorHistory(result);

  // ردیابی موقعیت ماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // به‌روز رسانی ریفرنس هر بار که expression تغییر می‌کند
  useEffect(() => {
    expressionRef.current = expression;
  }, [expression]);

  // ریست کردن کل ماشین‌حساب
  const resetCalc = useCallback(() => {
    setExpression("");
    expressionRef.current = "";
    setResult("");
    setParenError(false);
    setEvalError(null);
  }, []);

  // مدیریت ورودی‌ها (اعداد، نقطه، پرانتز)
  const handleInput = useCallback((value: string) => {
    if (parenError) setParenError(false);
    if (evalError) setEvalError(null);

    // اگر نتیجه موجود باشد و کاراکتر ورودی عملیات نیست، ریست کن
    if (result && !OPERATIONS.includes(value as Operation)) {
      resetCalc();
      setExpression(value);
      return;
    }

    // مدیریت نقطه اعشار
    if (value === ".") {
      const lastNumberMatch = expressionRef.current.match(/(\d+\.?\d*)$/);
      if (lastNumberMatch && lastNumberMatch[0].includes(".")) return;
    }

    // مدیریت پرانتز باز
    if (value === "(") {
      const lastChar = expressionRef.current.slice(-1);
      if (
        expressionRef.current === "" ||
        OPERATIONS.includes(lastChar as Operation) ||
        lastChar === "("
      ) {
        setExpression(prev => prev + "(");
      } else if (/\d/.test(lastChar)) {
        setExpression(prev => prev + "*" + "(");
      }
      return;
    }

    // مدیریت پرانتز بسته
    if (value === ")") {
      const openParens = (expressionRef.current.match(/\(/g) || []).length;
      const closeParens = (expressionRef.current.match(/\)/g) || []).length;
      const lastChar = expressionRef.current.slice(-1);

      if (openParens > closeParens && (/\d/.test(lastChar) || lastChar === ")")) {
        setExpression(prev => prev + ")");
      }
      return;
    }

    // حداکثر طول عبارت
    if (expressionRef.current.length >= 15) return;

    setExpression(prev => prev + value);
  }, [parenError, evalError, result, resetCalc]);

  // مدیریت عملیات (+، -، *، / و ...)
  const handleOperation = useCallback((op: string) => {
    if (parenError) setParenError(false);
    if (evalError) setEvalError(null);

    if (!expressionRef.current && !result) return;

    if (result) {
      setExpression(result + op);
      expressionRef.current = result + op;
      setResult("");
      return;
    }

    const lastChar = expressionRef.current.slice(-1);

    // جایگزینی عملیات اگر عملیات قبلی هم باشد
    if (OPERATIONS.includes(lastChar as Operation)) {
      setExpression(prev => prev.slice(0, -1) + op);
      expressionRef.current = expressionRef.current.slice(0, -1) + op;
      return;
    }

    setExpression(prev => prev + op);
    expressionRef.current = expressionRef.current + op;
  }, [parenError, evalError, result]);

  // محاسبه نتیجه
  const calcResult = useCallback(() => {
    if (expressionRef.current.trim() === "") {
      setEvalError("خطا در محاسبه");
      setParenError(false);
      return;
    }

    const openParensCount = (expressionRef.current.match(/\(/g) || []).length;
    const closeParensCount = (expressionRef.current.match(/\)/g) || []).length;

    if (openParensCount !== closeParensCount) {
      setParenError(true);
      setEvalError(null);
      return;
    }

    setParenError(false);

    try {
      const r = evaluate(expressionRef.current);
      if (r === undefined || Number.isNaN(r)) throw new Error();

      if (/^\s*-?\d+(\.\d+)?\s*$/.test(expressionRef.current)) {
        setEvalError("عبارت وارد شده کامل نیست.");
        return;
      }

      const finalResult = r.toString();
      setResult(finalResult);
      saveHistory(expressionRef.current, finalResult);
      setEvalError(null);
    } catch {
      setEvalError("عبارت وارد شده کامل نیست.");
    }
  }, [saveHistory]);

  // مدیریت کلیک روی دکمه‌های ماشین‌حساب
  const handleBtnClick = useCallback((text: OperatorBtn) => {
    if (text === "CA") resetCalc();
    else if (text === "C" || text === "DEL") {
      if (result) return;
      setExpression(prev => {
        const newExpr = prev.slice(0, -1);
        expressionRef.current = newExpr;
        return newExpr;
      });
    }
    else if (text === "+/-") {
      const match = expressionRef.current.match(/(-?\d+\.?\d*)$/);
      if (match) {
        const number = match[0];
        const inverted = number.startsWith("-") ? number.slice(1) : "-" + number;
        setExpression(prev => {
          const newExpr = prev.slice(0, prev.length - number.length) + inverted;
          expressionRef.current = newExpr;
          return newExpr;
        });
      }
    }
    else if (text === "=") calcResult();
    else if (text === "(" || text === ")") handleInput(text);
    else if (OPERATIONS.includes(text as Operation)) handleOperation(text);
    else handleInput(text);
  }, [calcResult, handleInput, handleOperation, resetCalc, result]);

  // پاک کردن تاریخچه
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    deleteServerHistory();
  }, [setHistory, deleteServerHistory]);

  const requestClearHistory = useCallback(() => setShowConfirm(true), []);
  const cancelClear = useCallback(() => setShowConfirm(false), []);
  const confirmClear = useCallback(() => {
    handleClearHistory();
    setShowConfirm(false);
  }, [handleClearHistory]);

  // مدیریت کلیدهای صفحه‌کلید
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (showConfirm) {
        if (key === "enter") { e.preventDefault(); confirmClear(); return; }
        if (key === "escape") { e.preventDefault(); cancelClear(); return; }
        return;
      }

      if (isTyping) {
        if (/^[0-9.]$/.test(e.key)) handleInput(e.key);
        else if (OPERATIONS.includes(e.key as Operation)) handleOperation(e.key);
        else if (e.key === "(" || e.key === ")") handleInput(e.key);
        return;
      }

      if (/^[0-9.]$/.test(e.key)) { handleInput(e.key); return; }
      if (OPERATIONS.includes(e.key as Operation)) { handleOperation(e.key); return; }
      if (e.key === "(" || e.key === ")") { handleInput(e.key); return; }
      if (key === "enter") { calcResult(); return; }
      if (key === "backspace" || key === "c") {
        if (!result) {
          setExpression(prev => {
            const newExpr = prev.slice(0, -1);
            expressionRef.current = newExpr;
            return newExpr;
          });
        }
        return;
      }
      if (key === "q") { resetCalc(); return; }
      if (key === "p") { requestClearHistory(); return; }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, handleOperation, calcResult, resetCalc, requestClearHistory, result, showConfirm, confirmClear, cancelClear]);

  return (
    <>
      {/* هدر */}
      <Header />

      {/* افکت دنبال کننده ماوس */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`
        }}
      />

      {/* بخش اصلی ماشین‌حساب */}
      <div className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        
        {/* افکت‌های پس‌زمینه */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col gap-8 container mx-auto px-4 py-12 max-w-2xl relative z-10">
          
          {/* هدر صفحه */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-4"
            >
              <Sparkles size={16} />
              <span>ابزار محاسباتی پیشرفته</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                ماشین حساب
              </span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
              محاسبات سریع و دقیق با قابلیت ذخیره تاریخچه ✨
            </p>
          </motion.div>

          {/* پیام‌های خطا */}
          <div className="text-center mb-2 min-h-[2rem]">
            <AnimatePresence>
              {parenError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 backdrop-blur-lg"
                >
                  <AlertTriangle className="text-red-500" size={20} />
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    عبارت وارد شده کامل نیست.
                  </span>
                </motion.div>
              )}
              {evalError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 backdrop-blur-lg"
                >
                  <AlertTriangle className="text-red-500" size={20} />
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    {evalError}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* دکمه‌های ماشین‌حساب */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 grid-rows-6 gap-3 p-6 rounded-3xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700/40"
          >
            <CalculatorDisplay first={expression} op={""} second={""} result={result} />
            {BUTTONS.map(text => (
              <motion.button
                key={text}
                whileTap={{ scale: 0.95 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => handleBtnClick(text)}
                className={`
                  p-4 rounded-2xl font-bold text-lg transition-all duration-200
                  relative overflow-hidden group
                  ${text === "="
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                    : OPERATIONS.includes(text as Operation)
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                      : ["CA", "C", "DEL"].includes(text)
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                        : "bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl border border-white/40 dark:border-gray-600/40"
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                {/* افکت hover */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-200 ${
                  text === "=" ? "bg-white/20" :
                  OPERATIONS.includes(text as Operation) ? "bg-white/20" :
                  ["CA", "C", "DEL"].includes(text) ? "bg-white/20" :
                  "bg-gray-200/50 dark:bg-gray-600/50"
                } opacity-0 group-hover:opacity-100`} />
                
                <span className="relative z-10">
                  {text}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* تاریخچه */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700/40"
          >
            <HistoryList history={history} loading={loading} onClear={requestClearHistory} />
          </motion.div>
        </div>
      </div>

      {/* پنجره تایید پاک کردن تاریخچه */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={cancelClear}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 shadow-2xl border border-white/40 dark:border-gray-700/40 text-gray-800 dark:text-gray-100 select-none"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">پاک کردن تاریخچه</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  آیا مطمئن هستید که می‌خواهید تمام تاریخچه محاسبات پاک شود؟
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelClear}
                  className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold flex-1 border border-white/40"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmClear}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 font-semibold flex-1"
                >
                  پاک کردن
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}