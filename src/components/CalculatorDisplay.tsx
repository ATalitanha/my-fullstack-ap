interface CalculatorDisplayProps {
	first: string;
	op: string;
	second: string;
	result: string;
}

/**
 * Displays the current calculation expression and result.
 *
 * @param {CalculatorDisplayProps} props - The component props.
 * @returns {JSX.Element} The calculator display component.
 */
const CalculatorDisplay = ({
	first,
	op,
	second,
	result,
}: CalculatorDisplayProps) => {
	const expression = `${first || "0"} ${op} ${second}`.trim();
	const displayValue = result || second || first || "0";

	return (
		<div className="flex flex-col items-end justify-end w-full col-span-4 p-4 overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-800 min-h-[100px]">
			<div
				className="h-8 text-xl text-gray-500 dark:text-gray-400"
				title={expression}
			>
				{result ? expression : " "}
			</div>
			<div
				className="w-full text-5xl font-bold text-right text-gray-900 truncate dark:text-gray-100"
				title={displayValue}
			>
				{displayValue}
			</div>
		</div>
	);
};

export default CalculatorDisplay;
