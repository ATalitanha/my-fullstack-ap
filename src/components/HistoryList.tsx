// components/HistoryList.tsx
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
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      className="bg-black/10 dark:bg-white/10 rounded-md p-2 max-h-32 text-sm overflow-auto"
      ref={displayRef}
    >
      <div className="flex justify-between mb-1">
        <span className="font-semibold">تاریخچه</span>
        <button onClick={onClear} className="text-red-500 text-xs">پاک‌کردن تاریخچه</button>
      </div>

      {loading ? <LoadingDots /> : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 text-gray-500 dark:text-gray-400 font-medium italic select-none">
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
              className="border-b border-white/10 py-1"
            >
              {`${item.expression}  ${item.result}`}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default HistoryList;
