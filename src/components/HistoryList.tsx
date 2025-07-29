import { useEffect, useRef, useState } from "react";
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
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const requestClear = () => setShowConfirm(true);
  const cancelClear = () => setShowConfirm(false);
  const confirmClear = () => {
    onClear();
    setShowConfirm(false);
  };

  return (
    <>
      <div
        className="
          rounded-md
          bg-gradient-to-tr from-gray-800/90 to-gray-900/90
          dark:from-gray-900/90 dark:to-gray-950/90
          p-3 text-sm
          shadow-lg
          transition-colors duration-300
        "
      >
        <div className="flex justify-between mb-2 items-center">
          <span className="font-semibold text-gray-200 dark:text-gray-300 text-base select-none">
            تاریخچه
          </span>
          <button
            onClick={requestClear}
            className="text-red-500 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 text-xs px-2 py-1 rounded transition-colors"
            aria-label="پاک‌کردن تاریخچه"
          >
            پاک‌کردن تاریخچه
          </button>
        </div>

        <div
          ref={scrollRef}
          className="
            max-h-44 overflow-auto rounded-b-md pr-3
            scrollbar-thin
            scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
            scrollbar-thumb-rounded
            scrollbar-track-transparent
            hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
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
                    border-b border-white/20 py-2 last:border-none
                    text-gray-100 dark:text-gray-300
                    hover:bg-white/10 dark:hover:bg-white/20
                    rounded transition-colors
                  "
                >
                  {`${item.expression} ${item.result}`}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {showConfirm && (
        <>
          {/* پس‌زمینه بلور */}
          <div
            className="
              fixed inset-0
              bg-white/20 dark:bg-black/20
              backdrop-blur-md
              z-40
            "
            onClick={cancelClear}
          />

          {/* دیالوگ وسط صفحه */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="
              fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2
              rounded-md
              bg-gray-800 dark:bg-gray-900
              p-6
              shadow-lg
              text-gray-100 dark:text-gray-300
            "
          >
            <p className="mb-4 text-center font-medium">
              آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelClear}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                لغو
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white"
              >
                پاک کردن
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default HistoryList;
