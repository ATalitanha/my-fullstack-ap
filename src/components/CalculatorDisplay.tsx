import { motion } from "framer-motion";

interface Props {
  first: string;
  op: string;
  second: string;
  result: string;
}

const CalculatorDisplay = ({ first, op, second, result }: Props) => (
  <motion.div
    key={result}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="row-span-1 col-span-4 border rounded-md border-white flex justify-end items-end p-2 min-h-[48px] text-xl"
  >
    {first}{op}{second}
    <motion.span
      key={result}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="ml-2 text-green-400 font-semibold"
    >
      {result}
    </motion.span>
  </motion.div>
);

export default CalculatorDisplay;
