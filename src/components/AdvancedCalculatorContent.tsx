/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";
import { AnimatePresence } from "framer-motion"; // AnimatePresence رو مستقیم بیار (سبکه)
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// لود کردن کتابخانه‌های سنگین
const loadMathjs = () => import("mathjs");

// لازی لود کردن کامپوننت‌های سنگین
const MotionDiv = lazy(() =>
  import("framer-motion").then((m) => ({ default: m.motion.div })),
);
const MotionButton = lazy(() =>
  import("framer-motion").then((m) => ({ default: m.motion.button })),
);
const BlockMath = lazy(() =>
  import("react-katex").then((module) => ({
    default: module.BlockMath,
  })),
) as any;

// ایمپورت‌های سبک
import { History, RotateCcw, Trash2 } from "lucide-react";
import MouseHover from "@/shared/ui/mouseHover";

type HistoryItem = {
  id: string;
  expr: string;
  result: string;
  createdAt: string;
};

const SCI_BUTTONS = [
  "(",
  ")",
  "√(",
  "^",
  "!",
  "sin(",
  "cos(",
  "tan(",
  "asin(",
  "acos(",
  "atan(",
  "ln(",
  "log(",
  "abs(",
  "exp(",
];
const BASIC_BUTTONS = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "%",
  "+",
];

function formatResult(res: unknown): string {
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

export default function AdvancedCalculatorContent() {
  const [expr, setExpr] = useState<string>("");
  const exprRef = useRef(expr);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [scientific, setScientific] = useState<boolean>(false);
  const [mathjs, setMathjs] = useState<any>(null);

  useEffect(() => {
    loadMathjs().then((module) => {
      setMathjs(module);
    });
  }, []);

  useEffect(() => {
    exprRef.current = expr;
  }, [expr]);

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

  const saveHistory = async (expr: string, result: string) => {
    try {
      const res = await fetch("/api/adhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expr, result }),
      });
      const data = await res.json();
      setHistory((prev) => [data, ...prev.slice(0, 99)]);
    } catch {}
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch("/api/adhistory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch {}
  };

  const compute = useCallback(
    async (expression: string) => {
      if (!expression.trim()) {
        setError("Expression is empty.");
        setResult("");
        return;
      }
      if (!mathjs) return;

      try {
        const sanitized = expression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/%/g, "/100");
        const r = mathjs.evaluate(sanitized);
        const formatted = formatResult(r);
        setResult(formatted);
        setError(null);
        await saveHistory(expression, formatted);
        return formatted;
      } catch {
        setResult("");
        setError("Calculation error.");
        return null;
      }
    },
    [mathjs],
  );

  const handleButton = (val: string) => {
    const ops = ["+", "-", "*", "/", "^", "%"];
    if (result && ops.includes(val) && !exprRef.current) {
      setExpr(result + val);
      setResult("");
      return;
    }
    setExpr((prev) => prev + val);
  };

  const handleClear = () => {
    setExpr("");
    setResult("");
    setError(null);
  };

  const handleBackspace = useCallback(() => {
    if (result) setResult("");
    else setExpr((prev) => prev.slice(0, -1));
  }, [result]);

  const handleEvaluate = useCallback(() => {
    compute(expr);
  }, [expr, compute]);

  const handleUseHistory = (item: HistoryItem) => {
    setExpr(item.result);
    setResult("");
    setError(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[0-9+\-*/().%^]$/.test(key)) {
        e.preventDefault();
        setExpr((prev) => prev + key);
      } else if (key === "Enter") {
        e.preventDefault();
        handleEvaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key.toLowerCase() === "c") {
        handleClear();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleBackspace, handleEvaluate]);

  const lastHistory = useMemo(() => history.slice(0, 20), [history]);

  if (!mathjs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      }
    >
      <MouseHover />
      <div
        dir="rtl"
        className="min-h-screen pt-16 transition-colors duration-700 relative z-10 bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 relative"
            >
              <div className="text-center mb-6 min-h-8 absolute left-[50px] top-[34px] z-50">
                <AnimatePresence>
                  {error && (
                    <MotionDiv
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 backdrop-blur-lg"
                    >
                      <span className="text-red-700 dark:text-red-300 font-semibold">
                        {error}
                      </span>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                <div
                  dir="ltr"
                  className="p-6 bg-linear-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-800 dark:to-gray-700 text-gray-700 dark:text-white relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-purple-500/10" />
                  <div className="relative z-10 space-y-4">
                    <div className="text-right font-mono text-2xl wrap-break-word min-h-8">
                      <Suspense fallback={<div>Loading formula...</div>}>
                        <BlockMath math={expr || "0"} />
                      </Suspense>
                    </div>
                    <MotionDiv
                      key={result}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-right font-bold text-3xl md:text-4xl min-h-12"
                    >
                      {result || "—"}
                    </MotionDiv>
                  </div>
                </div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-3 justify-between">
                    <div className="flex gap-3">
                      <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setScientific((s) => !s)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                          scientific
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {scientific ? "Scientific 🔬" : "حالت علمی"}
                      </MotionButton>
                      <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEvaluate}
                        className="px-4 py-2 rounded-xl bg-linear-to-r from-green-500 to-green-600 text-white font-bold shadow-lg shadow-green-500/25"
                      >
                        محاسبه
                      </MotionButton>
                    </div>
                    <div className="flex gap-2">
                      <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBackspace}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                      >
                        ⌫
                      </MotionButton>
                      <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClear}
                        className="px-3 py-2 rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/25"
                      >
                        C
                      </MotionButton>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <AnimatePresence>
                    {scientific && (
                      <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-3 gap-3 mb-4"
                      >
                        {SCI_BUTTONS.map((s) => (
                          <MotionButton
                            key={s}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleButton(s === "√(" ? "sqrt(" : s)
                            }
                            className="py-3 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 font-semibold"
                          >
                            {s}
                          </MotionButton>
                        ))}
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                  <div className="grid grid-cols-4 gap-3">
                    {BASIC_BUTTONS.map((b) => (
                      <MotionButton
                        key={b}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleButton(b)}
                        className={`py-4 rounded-2xl font-bold text-lg transition-all ${
                          ["/", "*", "-", "+"].includes(b)
                            ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "bg-linear-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {b}
                      </MotionButton>
                    ))}
                  </div>
                </div>
              </div>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 h-full">
                <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-linear-to-br from-red-100/50 via-gray-100/50 to-blue-300/50 dark:from-red-600/9 dark:via-gray-800 dark:to-blue-600/9 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <History
                          className="text-blue-600 dark:text-blue-400"
                          size={20}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                          تاریخچه
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          محاسبات اخیر
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <MotionButton
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (history.length) {
                            setExpr(history[0].result);
                            setResult("");
                          }
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Use last result"
                      >
                        <RotateCcw size={18} />
                      </MotionButton>
                      <MotionButton
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setHistory([])}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Clear history"
                      >
                        <Trash2 size={18} />
                      </MotionButton>
                    </div>
                  </div>
                </div>
                <div className="p-4 h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80">
                  <AnimatePresence>
                    {lastHistory.length === 0 ? (
                      <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 text-gray-500 dark:text-gray-400"
                      >
                        <History
                          size={48}
                          className="mx-auto mb-4 opacity-50"
                        />
                        <p>No history yet</p>
                      </MotionDiv>
                    ) : (
                      <div className="space-y-3">
                        {lastHistory.map((h, index) => (
                          <MotionDiv
                            key={h.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-row-reverse items-center justify-between p-4 rounded-2xl bg-linear-to-br from-blue-200/50 via-gray-100/50 to-red-100/50 dark:from-blue-600/9 dark:via-gray-800 dark:to-red-600/9 border border-white/40 dark:border-gray-600/40 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => handleUseHistory(h)}
                          >
                            <div dir="ltr" className="flex flex-col">
                              <div className="mb-2 flex flex-col items-start">
                                <div className="text-sm text-gray-800 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                  <Suspense fallback={<div>...</div>}>
                                    <BlockMath math={`${h.expr}`} />
                                  </Suspense>
                                </div>
                                <div className="text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  <Suspense fallback={<div>...</div>}>
                                    <BlockMath math={`= ${h.result}`} />
                                  </Suspense>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <small className="text-xs text-gray-400">
                                  {new Date(h.createdAt).toLocaleString(
                                    "en-US",
                                  )}
                                </small>
                              </div>
                            </div>
                            <div>
                              <MotionButton
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHistory(h.id);
                                }}
                                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              >
                                حذف
                              </MotionButton>
                            </div>
                          </MotionDiv>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
