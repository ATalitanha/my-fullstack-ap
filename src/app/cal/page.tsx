"use client";

import { useEffect, useState, useCallback } from "react";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";

export default function Calculator() {
  const [firstOperand, setFirstOperand] = useState("");
  const [secondOperand, setSecondOperand] = useState("");
  const [operation, setOperation] = useState<Operation | "">("");
  const [result, setResult] = useState("");

  const {
    history,
    loading,
    setHistory,
    saveHistory,
    deleteServerHistory,
  } = useCalculatorHistory(result);

  // وضعیت نمایش دیالوگ تایید پاک کردن تاریخچه
  const [showConfirm, setShowConfirm] = useState(false);

  const resetCalc = () => {
    setFirstOperand("");
    setSecondOperand("");
    setOperation("");
    setResult("");
  };

  const handleInput = (value: string) => {
    if (OPERATIONS.includes(value as Operation)) return;

    if (!operation && firstOperand.length < 8 && (value !== "." || !firstOperand.includes("."))) {
      setFirstOperand(prev => prev + value);
    } else if (!result && secondOperand.length < 8 && (value !== "." || !secondOperand.includes("."))) {
      setSecondOperand(prev => prev + value);
    }
  };

  const handleOperation = (op: string) => {
    if (!firstOperand) return;

    if (op === "√") {
      setOperation("√");
      setSecondOperand("0");
    } else if (OPERATIONS.includes(op as Operation)) {
      setOperation(op as Operation);
    }
  };

  const handleBtnClick = (text: OperatorBtn) => {
    if (text === "CA") resetCalc();
    else if (text === "C") {
      if (result) return;
      if (secondOperand) setSecondOperand("");
      else setFirstOperand("");
    }
    else if (text === "DEL") {
      if (result) return;
      if (secondOperand) setSecondOperand(prev => prev.slice(0, -1));
      else if (operation) setOperation("");
      else if (firstOperand) setFirstOperand(prev => prev.slice(0, -1));
    }
    else if (text === "+/-") {
      if (result) return;
      if (secondOperand) setSecondOperand(`${parseFloat(secondOperand) * -1}`);
      else if (firstOperand) setFirstOperand(`${parseFloat(firstOperand) * -1}`);
    }
    else if (text === "=") calcResult();
    else if (OPERATIONS.includes(text as Operation)) handleOperation(text as Operation);
    else handleInput(text);
  };

  const calcResult = () => {
    try {
      const a = parseFloat(firstOperand);
      const b = parseFloat(secondOperand);
      let r: number | undefined;

      switch (operation) {
        case "+": r = a + b; break;
        case "-": r = a - b; break;
        case "*": r = a * b; break;
        case "/": r = b !== 0 ? a / b : NaN; break;
        case "^": r = Math.pow(a, b); break;
        case "√": r = a >= 0 ? Math.sqrt(a) : NaN; break;
      }

      const expression = `${firstOperand} ${operation} ${operation === "√" ? "" : secondOperand}`;
      const finalResult = (r !== undefined && !Number.isNaN(r)) ? `${r}` : "Error";

      setResult(finalResult);

      if (!Number.isNaN(r) && operation) saveHistory(expression, finalResult);
    } catch {
      setResult("Error");
    }
  };

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    deleteServerHistory();
  }, [setHistory, deleteServerHistory]);

  // باز کردن دیالوگ تاییدیه
  const requestClearHistory = () => {
    setShowConfirm(true);
  };

  // لغو دیالوگ
  const cancelClear = () => {
    setShowConfirm(false);
  };

  // تایید حذف تاریخچه
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
          {/* Calculator Section */}
          <div className="grid grid-cols-4 grid-rows-6 gap-2 p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            <CalculatorDisplay
              first={firstOperand}
              op={operation}
              second={secondOperand}
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

          {/* History Section */}
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl">
            {/* به جای حذف مستقیم، دیالوگ رو باز می‌کنیم */}
            <HistoryList history={history} loading={loading} onClear={requestClearHistory} />
          </div>
        </div>
      </div>

      {/* دیالوگ تایید حذف تاریخچه */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* پس‌زمینه تار و بلور */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={cancelClear}
            />

            {/* دیالوگ وسط صفحه */}
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
                  type="button"
                >
                  لغو
                </button>
                <button
                  onClick={confirmClear}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow-md"
                  type="button"
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
