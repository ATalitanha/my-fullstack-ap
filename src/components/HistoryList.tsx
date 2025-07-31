import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingDots from "@/components/loading";
import { HistoryItem } from "@/hooks/useCalculatorHistory";

interface Props {
  history: HistoryItem[];
  loading: boolean;
  onClear: () => void; // این فقط برای باز کردن دیالوگه، حذف مستقیم انجام نمیشه
}

const HistoryList = ({ history, loading, onClear }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      className="
        rounded-xl
        bg-white/10 dark:bg-black/30
        backdrop-blur-lg
        border border-white/20 dark:border-gray-700
        p-4 text-sm font-black
        shadow-lg
        transition-colors duration-300
        select-none
        max-h-60
        flex flex-col
      "
    >
      <div className="flex justify-between mb-3 items-center">
        <span className="font-black text-black dark:text-gray-300 text-lg">
          تاریخچه
        </span>
        <button
          onClick={onClear}
          className="font-black text-red-500 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 text-xs px-3 py-1 rounded-lg transition-colors shadow-md"
          aria-label="پاک‌کردن تاریخچه"
          type="button"
        >
          پاک‌کردن تاریخچه
        </button>
      </div>

      <div
        ref={scrollRef}
        className="
          flex-1
          overflow-y-auto
          pr-3
          scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
          scrollbar-thumb-rounded scrollbar-track-transparent
          hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
          transition-all
        "
        style={{ scrollbarGutter: "stable" }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-28">
            <LoadingDots />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 text-black dark:text-gray-500 font-black italic">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6m-6 3h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2z"
              />
            </svg>
            هیچ تاریخی وجود ندارد.
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
                className="
                  border-b border-white/20 py-3 last:border-none
                  text-black dark:text-gray-300
                  hover:bg-white/20 dark:hover:bg-white/30
                  rounded-lg
                  transition-colors
                  px-3
                  cursor-default
                  select-text
                  font-mono
                "
                title={`${item.expression} = ${item.result}`}
              >
                {`${item.expression} = ${item.result}`}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
