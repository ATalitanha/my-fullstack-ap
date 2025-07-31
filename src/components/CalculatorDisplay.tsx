import { motion } from "framer-motion";

interface Props {
  first: string;
  op: string;
  second: string;
  result: string;
}

const CalculatorDisplay = ({ first, op, second, result }: Props) => {
  // ساخت رشته نمایش کل عبارت با نتیجه (مثل: "3 + 5 = 8")
  const expression = `${first} ${op} ${op === "√" ? "" : second} = ${result}`;

  return (
    <motion.div
      className="
        row-span-1 col-span-4
        bg-black/20 dark:bg-white/10
        border border-white/20
        rounded-xs
        p-3
        min-h-[60px]
        select-text
        overflow-hidden
        whitespace-nowrap
        text-black dark:text-gray-400
        font-black text-lg
        flex justify-start items-center
        gap-2
      "
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      title={expression.trim()}
    >
      {/* برای انیمیشن، می‌تونیم هر بخش رو جدا بذاریم با key جدا */}
      <motion.span
        key={`${first}-${op}-${second}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {first}
      </motion.span>

      {op && (
        <motion.span
          key={op}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {` ${op} `}
        </motion.span>
      )}

      {op !== "√" && (
        <motion.span
          key={second}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {second}
        </motion.span>
      )}

      <motion.span
        key={`result-${result}`}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-green-400 dark:text-green-300 font-black"
      >
        {` ${result}`}
      </motion.span>
    </motion.div>
  );
};

export default CalculatorDisplay;
