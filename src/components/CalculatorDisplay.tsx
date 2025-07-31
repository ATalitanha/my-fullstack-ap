import { motion } from "framer-motion";

interface Props {
  first: string;
  op: string;
  second: string;
  result: string;
}

const CalculatorDisplay = ({ first, op, second, result }: Props) => {
  const expression = `${first} ${op} ${op === "√" ? "" : second} = ${result}`;

  return (
    <motion.div
      className="
        row-span-1 col-span-4
        bg-white/10 dark:bg-white/5
        backdrop-blur-md
        border border-white/20 dark:border-gray-700
        rounded-2xl
        p-4
        min-h-[70px]
        select-text
        overflow-hidden
        whitespace-nowrap
        text-right
        font-['Major_Mono_Display']
        text-2xl sm:text-3xl md:text-4xl
        text-black dark:text-gray-100
        shadow-inner shadow-gray-300 dark:shadow-black/30
        flex justify-end items-center gap-2
      "
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      title={expression.trim()}
    >
      <motion.span
        key={`${first}-${op}-${second}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="text-black dark:text-gray-200"
      >
        {first}
      </motion.span>

      {op && (
        <motion.span
          key={`op-${op}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-blue-400 dark:text-blue-300"
        >
          {` ${op} `}
        </motion.span>
      )}

      {op !== "√" && second && (
        <motion.span
          key={`second-${second}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-black dark:text-gray-200"
        >
          {second}
        </motion.span>
      )}

      {result && (
        <motion.span
          key={`result-${result}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-green-400 dark:text-green-300 font-black"
        >
          {` = ${result}`}
        </motion.span>
      )}
    </motion.div>
  );
};

export default CalculatorDisplay;
