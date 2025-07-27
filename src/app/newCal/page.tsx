/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingDots from "./loading";

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  createdAt: string;
}

const OPERATIONS = ["*", "+", "-", "/", "√", "^"];

export default function Calculator() {
  const [firstOperand, setFirstOperand] = useState("");
  const [secondOperand, setSecondOperand] = useState("");
  const [operation, setOperation] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.warn("Unexpected response:", data);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [result]);


  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (result) saveHistory();
  }, [result]);

  useEffect(() => {
    if (deleteCount > 0) deleteServerHistory();
  }, [deleteCount]);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [firstOperand, secondOperand, operation, result]);

  const handleInput = (e: any) => {
    const value = e.target.innerText;
    if (OPERATIONS.includes(value)) return;

    if (!operation && firstOperand.length < 8) {
      setFirstOperand(prev => prev + value);
    } else if (result === "" && secondOperand.length < 8) {
      setSecondOperand(prev => prev + value);
    }
  };

  const handleOperation = (e: any) => {
    const op = e.target.innerText;
    if (firstOperand) {
      setOperation(op);
      if (op === "√") setSecondOperand("0");
    }
  };

  const CAHandler = () => {
    setFirstOperand("");
    setSecondOperand("");
    setOperation("");
    setResult("");
  };

  const DELHandler = () => {
    if (result) return;
    if (secondOperand) return setSecondOperand(prev => prev.slice(0, -1));
    if (operation) return setOperation("");
    if (firstOperand) return setFirstOperand(prev => prev.slice(0, -1));
  };

  const clearLastOperand = () => {
    if (result) return;
    if (secondOperand) setSecondOperand("");
    else setFirstOperand("");
  };

  const calcResult = () => {
    try {
      const a = parseFloat(firstOperand);
      const b = parseFloat(secondOperand);
      let r = 0;

      switch (operation) {
        case "+": r = a + b; break;
        case "-": r = a - b; break;
        case "*": r = a * b; break;
        case "/": r = b !== 0 ? a / b : NaN; break;
        case "^": r = Math.pow(a, b); break;
        case "√": r = a >= 0 ? Math.sqrt(a) : NaN; break;
        default: return;
      }

      const expression = `${firstOperand} ${operation} ${operation === "√" ? "" : secondOperand}`;
      const finalResult = Number.isNaN(r) ? "error" : `=${r}`;
      setResult(finalResult);
    } catch {
      setResult("=Error");
    }
  };

  const clearHistory = () => {
    setDeleteCount(prev => prev + 1);
    setHistory([]);
  };

  const invertSignals = () => {
    if (secondOperand) setSecondOperand(`${parseFloat(secondOperand) * -1}`);
    else if (firstOperand) setFirstOperand(`${parseFloat(firstOperand) * -1}`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    if (!isNaN(Number(key)) || key === ".") handleInput({ target: { innerText: key } });
    if (OPERATIONS.includes(key)) handleOperation({ target: { innerText: key } });
    if (key === "Enter") calcResult();
    if (key === "Backspace") DELHandler();
    if (key === "c" || key === "C") clearLastOperand();
    if (key === "q" || key === "Q") CAHandler();
    if (key === "p" || key === "P") clearHistory();
  };

  const saveHistory = async () => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: `${firstOperand} ${operation} ${operation === "√" ? "" : secondOperand}`,
          result,
        })
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to post history:", err);
      }
    } catch (err) {
      console.error("Save history error:", err);
    }
  };

  const deleteServerHistory = async () => {
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to delete history:", err);
      } else {
        console.log("Server history deleted");
      }
    } catch (err) {
      console.error("Delete history error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 grid-rows-6 gap-1">
        <motion.div
          key={result}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="row-span-1 col-span-4 border rounded-md border-white flex justify-end items-end p-2 min-h-[48px] text-xl"
        >
          {firstOperand}{operation}{secondOperand}
          <motion.span
            key={result}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="ml-2 text-green-400 font-semibold"
          >
            {result}
          </motion.span>
        </motion.div>

        {["CA", "C", "DEL", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="].map((text, i) => (
          <button
            key={text + i}
            onClick={
              text === "CA" ? CAHandler :
                text === "C" ? clearLastOperand :
                  text === "DEL" ? DELHandler :
                    text === "=" ? calcResult :
                      text === "+/-" ? invertSignals :
                        OPERATIONS.includes(text) ? handleOperation :
                          handleInput
            }
            className={`p-4 border rounded-md ${text === "=" ? "text-green-500" : ""}`}
          >
            {text}
          </button>
        ))}

        {["^", "√"].map(op => (
          <button key={op} onClick={handleOperation} className="p-4 border rounded-md">{op}</button>
        ))}
      </div>

      <div
  className="bg-black/10 dark:bg-white/10 rounded-md p-2 max-h-32 text-sm overflow-auto"
  ref={displayRef}
>
  <div className="flex justify-between mb-1">
    <span className="font-semibold">History</span>
    <button onClick={clearHistory} className="text-red-500 text-xs">
      Clear History
    </button>
  </div>

  {loading ? (
    <LoadingDots />
  ) : history.length === 0 ? (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        h-24
        text-gray-500
        dark:text-gray-400
        font-medium
        italic
        select-none
      "
    >
      No history available.
    </div>
  ) : (
    <AnimatePresence>
      {history.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="border-b border-white/10 py-1"
        >
          {`${item.expression}  ${item.result}`}
        </motion.div>
      ))}
    </AnimatePresence>
  )}
</div>

    </div>
  );
}
