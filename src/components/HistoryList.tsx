import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingDots from "@/components/loading";
import { HistoryItem } from "@/hooks/useCalculatorHistory";
import { History } from "lucide-react";

/**
 * Props for the HistoryList component.
 * @property {HistoryItem[]} history - An array of history items.
 * @property {boolean} loading - Whether the history is currently loading.
 * @property {() => void} onClear - Function to call when the clear history button is clicked.
 */
interface Props {
  history: HistoryItem[];
  loading: boolean;
  onClear: () => void; // فقط برای باز کردن دیالوگ، حذف مستقیم انجام نمیشه
}

/**
 * A component that displays a list of calculator history items.
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} The history list component.
 */
const HistoryList = ({ history, loading, onClear }: Props) => {
  // ref برای اسکرول اتوماتیک به پایین لیست
  const scrollRef = useRef<HTMLDivElement>(null);

  // When the history changes, scroll to the bottom of the list.
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
      {/* هدر تاریخچه و دکمه پاک‌کردن */}
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

      {/* کانتینر لیست تاریخچه */}
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
        {/* حالت لودینگ */}
        {loading ? (
          <div className="flex justify-center items-center h-28">
            <LoadingDots />
          </div>
        ) : history.length === 0 ? (
          // حالت خالی بودن تاریخچه
          <div className="flex flex-col items-center justify-center h-28 text-black dark:text-gray-500 font-black italic">
            <History className="h-10 w-10 mb-2 opacity-50" />
            هیچ تاریخی وجود ندارد.
          </div>
        ) : (
          // نمایش آیتم‌های تاریخچه با انیمیشن ورود و خروج
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
                title={`${item.expression} = ${item.result}`} // نمایش مقدار کامل روی hover
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
