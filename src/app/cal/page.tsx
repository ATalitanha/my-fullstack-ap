"use client";

import { useEffect, useState, useCallback } from "react";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import { evaluate } from "mathjs";

export default function Calculator() {
  // ذخیره کل عبارت به صورت رشته
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    history,
    loading,
    setHistory,
    saveHistory,
    deleteServerHistory,
  } = useCalculatorHistory(result);

  const resetCalc = () => {
    setExpression("");
    setResult("");
  };

  const handleInput = (value: string) => {
    // اگر نتیجه قبل موجود است و کاربر عدد زد، ریست می‌کنیم (شروع از نو)
    if (result && !OPERATIONS.includes(value as Operation)) {
      resetCalc();
      setExpression(value);
      return;
    }

    // جلوگیری از وارد کردن چند نقطه متوالی برای هر عدد
    if (value === ".") {
      // پیدا کردن آخرین عدد در expression
      const lastNumberMatch = expression.match(/(\d+\.?\d*)$/);
      if (lastNumberMatch && lastNumberMatch[0].includes(".")) {
        return; // اجازه نمیدیم نقطه دوباره وارد بشه
      }
    }

    // فقط اجازه میدیم تا 15 کاراکتر در expression باشه برای جلوگیری از overflow
    if (expression.length >= 15) return;

    setExpression(prev => prev + value);
  };

  const handleOperation = (op: string) => {
    if (!expression && !result) return;

    if (result) {
      // وقتی نتیجه موجوده و کاربر عملگر میزنه، expression رو با نتیجه شروع کن و عملگر اضافه کن
      setExpression(result + op);
      setResult("");
      return;
    }

    // اگر آخرین کاراکتر عملگر بود، جایگزینش کن
    if (OPERATIONS.includes(expression.slice(-1) as Operation)) {
      setExpression(prev => prev.slice(0, -1) + op);
      return;
    }

    if (op === "√") {
      setExpression(prev => prev + "sqrt(");
      return;
    }

    setExpression(prev => prev + op);
  };

  const handleBtnClick = (text: OperatorBtn) => {
    if (text === "CA") resetCalc();
    else if (text === "C") {
      if (result) return;
      setExpression(prev => prev.slice(0, -1));
    }
    else if (text === "DEL") {
      if (result) return;
      setExpression(prev => prev.slice(0, -1));
    }
    else if (text === "+/-") {
      // معکوس کردن علامت آخرین عدد در expression
      const match = expression.match(/(-?\d+\.?\d*)$/);
      if (match) {
        const number = match[0];
        const inverted = number.startsWith("-") ? number.slice(1) : "-" + number;
        setExpression(prev => prev.slice(0, prev.length - number.length) + inverted);
      }
    }
    else if (text === "=") calcResult();
    else if (OPERATIONS.includes(text as Operation)) handleOperation(text);
    else handleInput(text);
  };

  const calcResult = () => {
    try {
      // اگر عبارت باز پرانتز sqrt( داریم، باید پرانتزشو ببندیم
      let exprToEval = expression;
      const openSqrtCount = (exprToEval.match(/sqrt\(/g) || []).length;
      const closeParenCount = (exprToEval.match(/\)/g) || []).length;
      for (let i = 0; i < openSqrtCount - closeParenCount; i++) {
        exprToEval += ")";
      }

      const r = evaluate(exprToEval);

      const finalResult = (r !== undefined && !Number.isNaN(r)) ? r.toString() : "Error";

      setResult(finalResult);
      saveHistory(expression, finalResult);
    } catch {
      setResult("Error");
    }
  };

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    deleteServerHistory();
  }, [setHistory, deleteServerHistory]);

  const requestClearHistory = () => setShowConfirm(true);
  const cancelClear = () => setShowConfirm(false);
  const confirmClear = () => {
    handleClearHistory();
    setShowConfirm(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (/^[0-9.]$/.test(key)) handleInput(key);
      else if (OPERATIONS.includes(key as Operation)) handleOperation(key);
      else if (key === "Enter") calcResult();
      else if (key === "Backspace") handleBtnClick("DEL");
      else if (key.toLowerCase() === "c") handleBtnClick("C");
      else if (key.toLowerCase() === "q") handleBtnClick("CA");
      else if (key.toLowerCase() === "p") requestClearHistory();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClearHistory]);

  return (
    <>
      <Header />
      <div className={`min-h-screen mt-16 transition-colors duration-300 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <div className="flex flex-col gap-6 container mx-auto px-4 py-12 max-w-2xl">
          <div className="grid grid-cols-4 grid-rows-6 gap-2 p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <CalculatorDisplay
              first={expression}
              op={""}
              second={""}
              result={result}
            />
            {BUTTONS.map(text => (
              <motion.button
                key={text}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handleBtnClick(text)}
                className={`
                  p-5 rounded-xl font-black text-xl transition-colors duration-75
                  ${text === "="
                    ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:hover:bg-green-600 dark:active:bg-green-700"
                    : OPERATIONS.includes(text as Operation)
                      ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 dark:active:bg-blue-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                  }
                `}
              >
                {text}
              </motion.button>
            ))}
          </div>
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <HistoryList history={history} loading={loading} onClear={requestClearHistory} />
          </div>
        </div>
      </div>

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
              className="fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-900 p-6 shadow-2xl text-gray-100 select-none"
            >
              <p className="mb-5 text-center font-bold">
                آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟
              </p>
              <div className="flex justify-center gap-5">
                <button
                  onClick={cancelClear}
                  className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  لغو
                </button>
                <button
                  onClick={confirmClear}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow-md"
                >
                  پاک کردن
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
