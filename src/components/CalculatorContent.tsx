/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import HybridLoading from "@/app/loading";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList";
import {
  BUTTONS,
  OPERATIONS,
  type Operation,
  type OperatorBtn,
} from "@/constants";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import theme from "@/lib/theme";

// داینامیک ایمپورت برای motion components
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false },
);

const MotionButton = dynamic(
  () => import("framer-motion").then((m) => m.motion.button),
  { ssr: false },
);

// لود کردن mathjs به صورت lazy
let mathjs: any = null;
const loadMathjs = async () => {
  if (!mathjs) {
    const module = await import("mathjs");
    mathjs = module;
  }
  return mathjs;
};

export default function CalculatorContent() {
  const [expression, setExpression] = useState("");
  const expressionRef = useRef(expression);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [parenError, setParenError] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mathjsLoaded, setMathjsLoaded] = useState(false);

  // لود کردن mathjs
  useEffect(() => {
    const initMathjs = async () => {
      await loadMathjs();
      setMathjsLoaded(true);
      setIsLoading(false);
    };
    initMathjs();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { history, loading, setHistory, saveHistory, deleteServerHistory } =
    useCalculatorHistory(result);

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

  const handleInput = useCallback(
    (value: string) => {
      if (parenError) setParenError(false);
      if (evalError) setEvalError(null);

      if (result && !OPERATIONS.includes(value as Operation)) {
        resetCalc();
        setExpression(value);
        return;
      }

      if (value === ".") {
        const lastNumberMatch = expressionRef.current.match(/(\d+\.?\d*)$/);
        if (lastNumberMatch?.[0].includes(".")) return;
      }

      if (value === "(") {
        const lastChar = expressionRef.current.slice(-1);
        if (
          expressionRef.current === "" ||
          OPERATIONS.includes(lastChar as Operation) ||
          lastChar === "("
        ) {
          setExpression((prev) => `${prev}(`);
        } else if (/\d/.test(lastChar)) {
          setExpression((prev) => `${prev}*(`);
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
          setExpression((prev) => `${prev})`);
        }
        return;
      }

      if (expressionRef.current.length >= 15) return;

      setExpression((prev) => prev + value);
    },
    [parenError, evalError, result, resetCalc],
  );

  const handleOperation = useCallback(
    (op: string) => {
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
        setExpression((prev) => prev.slice(0, -1) + op);
        expressionRef.current = expressionRef.current.slice(0, -1) + op;
        return;
      }

      setExpression((prev) => prev + op);
      expressionRef.current = expressionRef.current + op;
    },
    [parenError, evalError, result],
  );

  const calcResult = useCallback(() => {
    if (!mathjsLoaded) return;

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
      const r = mathjs.evaluate(expressionRef.current);
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
  }, [saveHistory, mathjsLoaded]);

  const handleBtnClick = useCallback(
    (text: OperatorBtn) => {
      if (text === "CA") resetCalc();
      else if (text === "C" || text === "DEL") {
        if (result) return;
        setExpression((prev) => {
          const newExpr = prev.slice(0, -1);
          expressionRef.current = newExpr;
          return newExpr;
        });
      } else if (text === "+/-") {
        const match = expressionRef.current.match(/(-?\d+\.?\d*)$/);
        if (match) {
          const number = match[0];
          const inverted = number.startsWith("-")
            ? number.slice(1)
            : `-${number}`;
          setExpression((prev) => {
            const newExpr =
              prev.slice(0, prev.length - number.length) + inverted;
            expressionRef.current = newExpr;
            return newExpr;
          });
        }
      } else if (text === "=") calcResult();
      else if (text === "(" || text === ")") handleInput(text);
      else if (OPERATIONS.includes(text as Operation)) handleOperation(text);
      else handleInput(text);
    },
    [calcResult, handleInput, handleOperation, resetCalc, result],
  );

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
        if (/^[0-9.]$/.test(e.key)) handleInput(e.key);
        else if (OPERATIONS.includes(e.key as Operation))
          handleOperation(e.key);
        else if (e.key === "(" || e.key === ")") handleInput(e.key);
        return;
      }

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
      if (key === "backspace" || key === "c") {
        if (!result) {
          setExpression((prev) => {
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

  if (isLoading || !mathjsLoaded) {
    return <HybridLoading />;
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`,
        }}
      />

      <div
        dir="ltr"
        className={`relative min-h-screen pt-16 transition-colors duration-700 z-10 ${theme} bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col gap-8 container mx-auto px-4 max-w-2xl relative z-10">
          <div className="text-center mb-2 min-h-8 absolute left-[50px] top-[34px] z-50">
            <AnimatePresence>
              {parenError && (
                <MotionDiv
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 backdrop-blur-lg"
                >
                  <AlertTriangle className="text-red-500" size={20} />
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    عبارت وارد شده کامل نیست.
                  </span>
                </MotionDiv>
              )}
              {evalError && (
                <MotionDiv
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 backdrop-blur-lg"
                >
                  <AlertTriangle className="text-red-500" size={20} />
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    {evalError}
                  </span>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 grid-rows-6 gap-3 p-6 rounded-3xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700/40"
          >
            <CalculatorDisplay
              first={expression}
              op={""}
              second={""}
              result={result}
            />
            {BUTTONS.map((text) => (
              <MotionButton
                key={text}
                whileTap={{ scale: 0.95 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => handleBtnClick(text)}
                className={`
                  p-4 rounded-2xl font-bold text-lg transition-all duration-200
                  relative overflow-hidden group
                  ${
                    text === "="
                      ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                      : OPERATIONS.includes(text as Operation)
                        ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                        : ["CA", "C", "DEL"].includes(text)
                          ? "bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                          : "bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl border border-white/40 dark:border-gray-600/40"
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                <div
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-200 ${
                    text === "="
                      ? "bg-white/20"
                      : OPERATIONS.includes(text as Operation)
                        ? "bg-white/20"
                        : ["CA", "C", "DEL"].includes(text)
                          ? "bg-white/20"
                          : "bg-gray-200/50 dark:bg-gray-600/50"
                  } opacity-0 group-hover:opacity-100`}
                />
                <span className="relative z-10">{text}</span>
              </MotionButton>
            ))}
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700/40"
          >
            <HistoryList
              history={history}
              loading={loading}
              onClear={requestClearHistory}
            />
          </MotionDiv>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-3xl z-50"
              onClick={cancelClear}
            />
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow text-gray-100 select-none"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">پاک کردن تاریخچه</h3>
                <p className="text-sm">
                  آیا مطمئن هستید که می‌خواهید تمام تاریخچه محاسبات پاک شود؟
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelClear}
                  className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  لغو
                </MotionButton>
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmClear}
                  className="px-5 py-2 rounded-lg text-white transition shadow-md bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  پاک کردن
                </MotionButton>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
