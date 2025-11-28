"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { evaluate } from "mathjs";
import Header from "@/components/ui/header";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";
import { AlertTriangle, Trash2 } from "lucide-react";
import HybridLoading from "@/app/loading";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const expressionRef = useRef(expression);
  const [result, setResult] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [parenError, setParenError] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const { history, loading, setHistory, saveHistory, deleteServerHistory } = useCalculatorHistory(result);

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
      if (lastNumberMatch && lastNumberMatch[0].includes(".")) return;
    }

    if (value === "(") {
      const lastChar = expressionRef.current.slice(-1);
      if (expressionRef.current === "" || OPERATIONS.includes(lastChar as Operation) || lastChar === "(") {
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
      if (openParens > closeParens && (/\d/.test(lastChar) || lastChar === ")")) {
        setExpression(prev => prev + ")");
      }
      return;
    }

    if (expressionRef.current.length >= 20) return;
    setExpression(prev => prev + value);
  }, [parenError, evalError, result, resetCalc]);

  const handleOperation = useCallback((op: string) => {
    if (parenError) setParenError(false);
    if (evalError) setEvalError(null);

    if (!expressionRef.current && !result) return;

    if (result) {
      setExpression(result + op);
      setResult("");
      return;
    }

    const lastChar = expressionRef.current.slice(-1);
    if (OPERATIONS.includes(lastChar as Operation)) {
      setExpression(prev => prev.slice(0, -1) + op);
      return;
    }
    setExpression(prev => prev + op);
  }, [parenError, evalError, result]);

  const calcResult = useCallback(() => {
    if (expressionRef.current.trim() === "") {
      setEvalError("Invalid expression");
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
      let expr = expressionRef.current.replace(/%/g, '/100');
      const r = evaluate(expr);
      if (r === undefined || Number.isNaN(r)) throw new Error("Invalid calculation");

      const finalResult = parseFloat(r.toPrecision(15)).toString();
      setResult(finalResult);
      saveHistory(expressionRef.current, finalResult);
      setEvalError(null);
    } catch {
      setEvalError("Invalid expression");
    }
  }, [saveHistory]);

  const handleBtnClick = useCallback((text: OperatorBtn) => {
    if (text === "CA") resetCalc();
    else if (text === "C" || text === "DEL") {
      if (result) return;
      setExpression(prev => prev.slice(0, -1));
    } else if (text === "+/-") {
      const match = expressionRef.current.match(/(-?\d+\.?\d*)$/);
      if (match) {
        const number = match[0];
        const inverted = number.startsWith("-") ? number.slice(1) : `-${number}`;
        setExpression(prev => prev.slice(0, prev.length - number.length) + inverted);
      }
    } else if (text === "=") calcResult();
    else if (text === "(" || text === ")") handleInput(text);
    else if (OPERATIONS.includes(text as Operation)) handleOperation(text);
    else handleInput(text);
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
      if (showConfirm) {
        if (key === "enter") { e.preventDefault(); confirmClear(); }
        if (key === "escape") { e.preventDefault(); cancelClear(); }
        return;
      }

      if (/^[0-9.()]$/.test(e.key)) handleInput(e.key);
      else if (OPERATIONS.includes(e.key as Operation)) handleOperation(e.key);
      else if (key === "enter" || key === "=") calcResult();
      else if (key === "backspace") handleBtnClick("C");
      else if (key === "delete") handleBtnClick("CA");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, handleOperation, calcResult, handleBtnClick, showConfirm, confirmClear, cancelClear]);

  if (isLoading) return <HybridLoading />;

  const getButtonClass = (text: OperatorBtn) => {
    if (text === "=") return "bg-gradient-to-r from-cyan-500 to-violet-500 text-white";
    if (OPERATIONS.includes(text as Operation)) return "text-cyan-500";
    if (["CA", "C", "DEL", "+/-", "%"].includes(text)) return "text-violet-500";
    return "text-zinc-900 dark:text-zinc-50";
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">ماشین حساب</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            محاسبات سریع و دقیق با قابلیت ذخیره تاریخچه ✨
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <div className="glass-effect rounded-2xl soft-shadow p-6">
              <CalculatorDisplay first={expression} op={""} second={""} result={result} />
              {parenError && <p className="text-red-500 text-sm text-center mt-2">پرانتزها نادرست است.</p>}
              {evalError && <p className="text-red-500 text-sm text-center mt-2">{evalError}</p>}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {BUTTONS.map(text => (
                  <motion.button
                    key={text}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={() => handleBtnClick(text)}
                    className={`p-4 rounded-2xl font-bold text-2xl transition-colors bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 ${getButtonClass(text)}`}
                  >
                    {text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:w-1/3">
            <div className="glass-effect rounded-2xl soft-shadow p-6 h-full">
              <HistoryList history={history} loading={loading} onClear={requestClearHistory} />
            </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={cancelClear}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl glass-effect soft-shadow p-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">پاک کردن تاریخچه</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                  آیا مطمئن هستید که می‌خواهید تمام تاریخچه محاسبات پاک شود؟
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={cancelClear}
                  className="px-6 py-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 transition-colors font-semibold flex-1"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={confirmClear}
                  className="px-6 py-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 transition-colors font-semibold flex-1"
                >
                  پاک کردن
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}