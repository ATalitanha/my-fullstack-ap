import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingDots from "@/components/loading";
import { HistoryItem } from "@/hooks/useCalculatorHistory";

interface Props {
  history: HistoryItem[];
  loading: boolean;
  onClear: () => void;
}

const HistoryList = ({ history, loading, onClear }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleClear = () => {
    if (confirm("آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟")) {
      onClear();
    }
  };

  return (
    <div className="rounded-md bg-gradient-to-tr from-gray-800/80 to-gray-900/80 dark:from-gray-200/20 dark:to-gray-100/20 p-3 text-sm">

      {/* سربرگ ثابت */}
      <div className="flex justify-between mb-2 items-center">
        <span className="font-semibold text-gray-200 dark:text-gray-700 text-base">تاریخچه</span>
        <button
          onClick={handleClear}
          className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
          aria-label="پاک‌کردن تاریخچه"
        >
          پاک‌کردن تاریخچه
        </button>
      </div>

      {/* لیست تاریخچه با اسکرول جداگانه */}
      <div
        ref={scrollRef}
        className="
          max-h-44 overflow-auto rounded-md pr-1
          scrollbar-thin 
          scrollbar-thumb-blue-500/60 
          scrollbar-thumb-rounded 
          scrollbar-track-transparent 
          hover:scrollbar-thumb-blue-400/80 
          transition-all
        "
        style={{ scrollbarGutter: "stable" }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <LoadingDots />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-gray-400 dark:text-gray-500 font-medium italic select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-6 3h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2z" />
            </svg>
            هیچ تاریخی وجود ندارد.
          </div>
        ) : (
          <AnimatePresence>
            {history.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border-b border-white/20 py-2 last:border-none text-gray-100 dark:text-gray-700"
              >
                {`${item.expression} ${item.result}`}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
