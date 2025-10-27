import LoadingDots from "@/components/loading";
import { HistoryItem } from "@/hooks/useCalculatorHistory";
import { Trash2 } from "lucide-react";

interface HistoryListProps {
	history: HistoryItem[];
	loading: boolean;
	onClear: () => void;
}

/**
 * Renders a list of calculation history items.
 * Allows clearing the entire history.
 * @param {HistoryListProps} props - The component props.
 * @returns {JSX.Element} The history list component.
 */
const HistoryList = ({ history, loading, onClear }: HistoryListProps) => {
	return (
		<div className="w-full p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
					تاریخچه محاسبات
				</h3>
				<button
					onClick={onClear}
					className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-600 transition-colors rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
					title="پاک کردن تاریخچه"
				>
					<Trash2 size={16} />
					<span>پاک کردن</span>
				</button>
			</div>
			<div className="pr-2 overflow-y-auto max-h-60">
				{loading ? (
					<div className="flex items-center justify-center h-24">
						<LoadingDots />
					</div>
				) : history.length === 0 ? (
					<div className="py-8 text-center text-gray-500 dark:text-gray-400">
						تاریخچه‌ای برای نمایش وجود ندارد.
					</div>
				) : (
					<ul className="space-y-2">
						{history.map((item) => (
							<li
								key={item.id}
								className="p-3 font-mono text-sm text-gray-700 bg-gray-100 rounded-md dark:text-gray-300 dark:bg-gray-700"
							>
								{`${item.expression} = ${item.result}`}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default HistoryList;
