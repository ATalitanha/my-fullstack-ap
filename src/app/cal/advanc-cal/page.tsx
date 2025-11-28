"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/ui/header";
import { evaluate } from "mathjs";
import { History, Trash2, RotateCcw, FlaskConical } from "lucide-react";
import HybridLoading from "@/app/loading";

type HistoryItem = {
  id: string;
  expr: string;
  result: string;
  createdAt: string;
};

const SCI_BUTTONS = ["(", ")", "sqrt(", "^", "!", "sin(", "cos(", "tan(", "asin(", "acos(", "atan(", "ln(", "log(", "abs(", "exp("];
const BASIC_BUTTONS = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+"];

function formatResult(res: unknown): string {
  try {
    if (typeof res === "number") {
      if (Number.isInteger(res)) return `${res}`;
      return parseFloat(res.toPrecision(12)).toString();
    }
    return String(res);
  } catch {
    return "Error";
  }
}

export default function AdvancedCalculatorPage() {
  const [expr, setExpr] = useState<string>("");
  const exprRef = useRef(expr);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [scientific, setScientific] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { setIsLoading(false); }, []);
  useEffect(() => { exprRef.current = expr; }, [expr]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/adhistory");
        const data = await res.json();
        setHistory(data);
      } catch { }
    };
    fetchHistory();
  }, []);

  const saveHistory = async (expr: string, result: string) => {
    try {
      const res = await fetch("/api/adhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expr, result }),
      });
      const data = await res.json();
      setHistory(prev => [data, ...prev.slice(0, 99)]);
    } catch { }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch("/api/adhistory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch { }
  };

  const compute = useCallback(async (expression: string) => {
    if (!expression.trim()) {
      setError("Expression is empty.");
      return;
    }
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
      const r = evaluate(sanitized);
      const formatted = formatResult(r);
      setResult(formatted);
      setError(null);
      await saveHistory(expression, formatted);
    } catch {
      setError("Calculation error.");
    }
  }, []);

  const handleButton = (val: string) => {
    if (result && ["+", "-", "*", "/", "^", "%"].includes(val) && !exprRef.current) {
      setExpr(result + val);
      setResult("");
      return;
    }
    setExpr(prev => prev + val);
  };

  const handleClear = () => { setExpr(""); setResult(""); setError(null); };
  const handleBackspace = useCallback(() => { result ? setResult("") : setExpr(prev => prev.slice(0, -1)); }, [result]);
  const handleEvaluate = useCallback(() => { compute(expr); }, [expr, compute]);
  const handleUseHistory = (item: HistoryItem) => { setExpr(item.result); setResult(""); setError(null); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((/^[0-9+\-*/().%^]$/).test(e.key)) { e.preventDefault(); handleButton(e.key); }
      else if (e.key === "Enter") { e.preventDefault(); handleEvaluate(); }
      else if (e.key === "Backspace") { e.preventDefault(); handleBackspace(); }
      else if (e.key.toLowerCase() === "c") { handleClear(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleBackspace, handleEvaluate]);

  const lastHistory = useMemo(() => history.slice(0, 20), [history]);

  if (isLoading) return <HybridLoading />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">ماشین حساب حرفه‌ای</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            محاسبات پیچیده ریاضی با قابلیت‌های علمی پیشرفته ✨
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="glass-effect rounded-2xl soft-shadow overflow-hidden">
              <div className="p-6 bg-zinc-800/10 dark:bg-zinc-900/20 text-right">
                <div className="font-mono text-lg text-zinc-600 dark:text-zinc-400 break-all min-h-8">{expr || " "}</div>
                <motion.div key={result} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-4xl text-zinc-900 dark:text-zinc-50 min-h-12">{result || "0"}</motion.div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </div>

              <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex justify-between items-center">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setScientific(s => !s)} className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${scientific ? "bg-violet-500/20 text-violet-600 dark:text-violet-400" : "bg-zinc-200/50 dark:bg-zinc-800/50"}`}>
                    <FlaskConical size={16} /> {scientific ? "Scientific" : "Scientific"}
                  </motion.button>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBackspace} className="px-4 py-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 font-semibold">⌫</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClear} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 font-semibold">C</motion.button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <AnimatePresence>
                  {scientific && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-5 gap-3 mb-3">
                      {SCI_BUTTONS.map(s => <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleButton(s)} className="py-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold">{s}</motion.button>)}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-4 gap-3">
                  {BASIC_BUTTONS.map(b => <motion.button key={b} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleButton(b)} className={`py-4 rounded-2xl font-bold text-2xl ${["/", "*", "-", "+"].includes(b) ? "text-cyan-500" : "text-zinc-800 dark:text-zinc-200"} bg-zinc-200/30 dark:bg-zinc-800/30`}>{b}</motion.button>)}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleEvaluate} className="col-span-4 py-4 rounded-2xl font-bold text-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white">=</motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <div className="glass-effect rounded-2xl soft-shadow h-full">
              <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50"><History size={20} /> تاریخچه</div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { if (history.length) handleUseHistory(history[0]); }} className="p-2 text-zinc-500 hover:text-cyan-500" title="Use last result"><RotateCcw size={16} /></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setHistory([])} className="p-2 text-zinc-500 hover:text-red-500" title="Clear history"><Trash2 size={16} /></motion.button>
                </div>
              </div>
              <div className="p-4 h-[600px] overflow-y-auto scrollbar-custom">
                <AnimatePresence>
                  {lastHistory.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-zinc-500">
                      <History size={48} className="mx-auto mb-4 opacity-50" /> No history yet
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {lastHistory.map((h, i) => (
                        <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => handleUseHistory(h)} className="p-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 cursor-pointer group">
                          <div className="font-mono text-sm text-zinc-500 dark:text-zinc-400 break-all group-hover:text-cyan-500">{h.expr}</div>
                          <div className="font-bold text-lg text-zinc-900 dark:text-zinc-50 group-hover:text-violet-500">= {h.result}</div>
                          <div className="flex justify-between items-center mt-1">
                            <small className="text-xs text-zinc-400">{new Date(h.createdAt).toLocaleTimeString()}</small>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleDeleteHistory(h.id); }} className="p-1 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></motion.button>
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
      </main>
    </div>
  );
}
