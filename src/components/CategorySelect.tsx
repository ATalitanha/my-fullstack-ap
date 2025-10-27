"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export const CATEGORIES = [
	{ value: "length", label: "📏 طول" },
	{ value: "weight", label: "⚖️ وزن" },
	{ value: "volume", label: "🧪 حجم" },
	{ value: "temperature", label: "🌡️ دما" },
	{ value: "time", label: "⏱️ زمان" },
	{ value: "speed", label: "🏎️ سرعت" },
	{ value: "energy", label: "⚡ انرژی" },
	{ value: "pressure", label: "🔧 فشار" },
	{ value: "area", label: "🗺️ مساحت" },
	{ value: "light", label: "💡 روشنایی" },
	{ value: "storage", label: "💾 داده" },
	{ value: "power", label: "🔋 توان" },
	{ value: "frequency", label: "🎵 فرکانس" },
	{ value: "angle", label: "📐 زاویه" },
];

interface CategorySelectProps {
	category: string;
	setCategory: (category: string) => void;
}

/**
 * A dropdown select component for choosing a unit conversion category.
 *
 * @param {CategorySelectProps} props - The component props.
 * @returns {JSX.Element} The category select component.
 */
export default function CategorySelect({
	category,
	setCategory,
}: CategorySelectProps) {
	return (
		<Select.Root value={category} onValueChange={setCategory}>
			<Select.Trigger className="flex items-center justify-between w-full px-4 py-3 text-lg bg-gray-100 border-2 border-transparent rounded-md dark:bg-gray-700 focus:border-primary focus:outline-none">
				<Select.Value placeholder="یک دسته انتخاب کنید...">
					{CATEGORIES.find((c) => c.value === category)?.label}
				</Select.Value>
				<Select.Icon>
					<ChevronDownIcon className="w-5 h-5" />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					side="bottom"
					position="popper"
					className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
				>
					<Select.ScrollUpButton className="flex items-center justify-center h-8 cursor-default">
						<ChevronUpIcon />
					</Select.ScrollUpButton>
					<Select.Viewport className="p-2">
						<Select.Label className="px-3 py-2 text-sm text-gray-500">
							دسته‌بندی‌ها
						</Select.Label>
						{CATEGORIES.map(({ value, label }) => (
							<Select.Item
								key={value}
								value={value}
								className="px-3 py-2 rounded-md cursor-pointer hover:bg-primary/10 focus:outline-none focus:bg-primary/10"
							>
								<Select.ItemText>{label}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Viewport>
					<Select.ScrollDownButton className="flex items-center justify-center h-8 cursor-default">
						<ChevronDownIcon />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
