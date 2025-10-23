"use client";

import { HistoryItem } from "@/features/calculator/hooks/useCalculatorHistory";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryListProps {
  history: HistoryItem[];
  loading: boolean;
  onClear: () => void;
}

const HistoryList = ({ history, loading, onClear }: HistoryListProps) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">History</h3>
        <button onClick={onClear} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-gray-100 rounded"
          >
            <p className="text-sm text-gray-600">{item.expression}</p>
            <p className="text-lg font-bold text-right">{item.result}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
