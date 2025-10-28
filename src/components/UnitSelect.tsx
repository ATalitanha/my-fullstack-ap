"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";

import { Unit } from "@/lib/type";

interface UnitSelectProps {
	value: string;
	setValue: (val: string) => void;
	units: Unit[];
}

export default function UnitSelect({ value, setValue, units }: UnitSelectProps) {
	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger className="flex items-center justify-between w-full p-5 h-[70px] bg-white/30 dark:bg-gray-800/50 rounded-2xl shadow-md">
				<Select.Value>
					{units.find((u) => u.value === value)?.label}
				</Select.Value>
				<Select.Icon>
					<ChevronDownIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					side="bottom"
					align="start"
					avoidCollisions={false}
					position="popper"
					className="z-50 w-full sm:w-[200px] max-h-60 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
				>
					<Select.Viewport
						className="p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all"
						style={{ scrollbarGutter: "stable" }}
					>
						{units.map((unit) => (
							<Select.Item
								key={unit.value}
								value={unit.value}
								onFocus={(e) => e.preventDefault()}
								className="p-3 text-gray-500 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white dark:text-white dark:hover:text-gray-700"
							>
								<Select.ItemText>{unit.label}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
