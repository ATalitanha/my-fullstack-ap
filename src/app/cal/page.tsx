"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import { evaluate } from "mathjs";
import HistoryList from "@/components/HistoryList";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const expressionRef = useRef(expression);

  const [result, setResult] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [parenError, setParenError] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  const {
    history,
    loading,
    setHistory,
    saveHistory,
    deleteServerHistory,
  } = useCalculatorHistory(result);

  useEffect(() => {
    expressionRef.current = expression;
  }, [expression]);

  const resetCalc = useCallback(() => {
    setExpression("");
    expressionRef.current = "";
    setResult("");
    setParenError(false);
    setEvalError(null);
  }, []);

  const handleInput = useCallback((value: string) => {
    if (parenError) setParenError(false);
    if (evalError) setEvalError(null);

    if (result && !OPERATIONS.includes(value as Operation)) {
      resetCalc();
      setExpression(value);
      return;
    }

    if (value === ".") {
      const lastNumberMatch = expressionRef.current.match(/(\d+\.?\d*)$/);
      if (lastNumberMatch && lastNumberMatch[0].includes(".")) {
        return;
      }
    }

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

    if (value === ")") {
      const openParens = (expressionRef.current.match(/\(/g) || []).length;
      const closeParens = (expressionRef.current.match(/\)/g) || []).length;
      const lastChar = expressionRef.current.slice(-1);

      if (
        openParens > closeParens &&
        (/\d/.test(lastChar) || lastChar === ")")
      ) {
        setExpression(prev => prev + ")");
      }
      return;
    }

    if (expressionRef.current.length >= 15) return;

    setExpression(prev => prev + value);
  }, [parenError, evalError, result, resetCalc]);

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

    if (OPERATIONS.includes(lastChar as Operation)) {
      setExpression(prev => prev.slice(0, -1) + op);
      expressionRef.current = expressionRef.current.slice(0, -1) + op;
      return;
    }

    setExpression(prev => prev + op);
    expressionRef.current = expressionRef.current + op;
  }, [parenError, evalError, result]);

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

  const handleBtnClick = useCallback((text: OperatorBtn) => {
    if (text === "CA") {
      resetCalc();
    }
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
    else if (text === "=") {
      calcResult();
    }
    else if (text === "(" || text === ")") {
      handleInput(text);
    }
    else if (OPERATIONS.includes(text as Operation)) {
      handleOperation(text);
    }
    else {
      handleInput(text);
    }
  }, [calcResult, handleInput, handleOperation, resetCalc, result]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // اگر فوکوس روی input یا textarea یا contenteditable هست، 
      // اجازه نده کلیدهای q, c, p کلیدهای ویژه را فعال کنند
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (showConfirm) {
        if (key === "enter") {
          e.preventDefault();
          confirmClear();
          return;
        }
        if (key === "escape") {
          e.preventDefault();
          cancelClear();
          return;
        }
        return;
      }

      if (isTyping) {
        // در حالت تایپ فقط اعداد، عملیات و پرانتزها را هندل کن
        if (/^[0-9.]$/.test(e.key)) {
          handleInput(e.key);
        } else if (OPERATIONS.includes(e.key as Operation)) {
          handleOperation(e.key);
        } else if (e.key === "(" || e.key === ")") {
          handleInput(e.key);
        }
        return;
      }

      // وقتی فوکوس روی ورودی نیست

      if (/^[0-9.]$/.test(e.key)) {
        handleInput(e.key);
        return;
      }

      if (OPERATIONS.includes(e.key as Operation)) {
        handleOperation(e.key);
        return;
      }

      if (e.key === "(" || e.key === ")") {
        handleInput(e.key);
        return;
      }

      if (key === "enter") {
        calcResult();
        return;
      }

      if (key === "backspace") {
        if (!result) {
          setExpression(prev => {
            const newExpr = prev.slice(0, -1);
            expressionRef.current = newExpr;
            return newExpr;
          });
        }
        return;
      }

      if (key === "c") {
        if (!result) {
          setExpression(prev => {
            const newExpr = prev.slice(0, -1);
            expressionRef.current = newExpr;
            return newExpr;
          });
        }
        return;
      }

      if (key === "q") {
        resetCalc();
        return;
      }

      if (key === "p") {
        requestClearHistory();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleInput,
    handleOperation,
    calcResult,
    resetCalc,
    requestClearHistory,
    result,
    showConfirm,
    confirmClear,
    cancelClear,
  ]);

  return (
    <>
      <Header />
      <div className={`min-h-screen mt-16 transition-colors duration-300 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <div className="flex flex-col gap-6 container mx-auto px-4 py-12 max-w-2xl">
          {/* پیام‌های خطا */}
          <div className="text-center mb-2 min-h-[1.5rem]">
            {parenError && (
              <div className="text-red-500 font-bold">
                عبارت وارد شده کامل نیست.
              </div>
            )}
            {evalError && (
              <div className="text-red-600 font-semibold">
                {evalError}
              </div>
            )}
          </div>

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
