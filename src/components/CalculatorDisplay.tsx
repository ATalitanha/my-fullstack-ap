import { motion } from "framer-motion";

/**
 * Props for the CalculatorDisplay component.
 * @property {string} first - The first number in the expression.
 * @property {string} op - The operator.
 * @property {string} second - The second number in the expression.
 * @property {string} result - The result of the calculation.
 */
interface Props {
	first: string; // عدد اول
	op: string; // عملگر (+, -, *, /, √ و غیره)
	second: string; // عدد دوم (برای جذر، دومین عدد خالی است)
	result: string; // نتیجه عملیات
}

/**
 * A component that displays the state of a calculator, including the current expression and result.
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} The calculator display.
 */
const CalculatorDisplay = ({ first, op, second, result }: Props) => {
	// رشته کامل نمایش داده شده به عنوان tooltip
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
			initial={{ opacity: 0, scale: 0.95 }} // انیمیشن ورود
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			title={expression.trim()} // tooltip هنگام hover
		>
			{/* عدد اول */}
			<motion.span
				key={`${first}-${op}-${second}`}
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.2 }}
				className="text-black dark:text-gray-200"
			>
				{first}
			</motion.span>

			{/* عملگر */}
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

			{/* عدد دوم (برای √ نمایش داده نمی‌شود) */}
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

			{/* نتیجه */}
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
