"use client";

import * as Select from "@radix-ui/react-select";
import {
	ChevronDownIcon,
	Ruler,
	Weight,
	Pipette,
	Thermometer,
	Clock,
	Wind,
	Zap,
	DraftingCompass,
	Landmark,
	Lightbulb,
	Database,
	Power,
	Waves,
	Baseline,
} from "lucide-react";

export const CATEGORIES = [
	{ value: "length", label: "طول", icon: <Ruler size={18} /> },
	{ value: "weight", label: "وزن", icon: <Weight size={18} /> },
	{ value: "volume", label: "حجم", icon: <Pipette size={18} /> },
	{ value: "temperature", label: "دما", icon: <Thermometer size={18} /> },
	{ value: "time", label: "زمان", icon: <Clock size={18} /> },
	{ value: "speed", label: "سرعت", icon: <Wind size={18} /> },
	{ value: "energy", label: "انرژی", icon: <Zap size={18} /> },
	{ value: "pressure", label: "فشار", icon: <DraftingCompass size={18} /> },
	{ value: "area", label: "مساحت", icon: <Landmark size={18} /> },
	{ value: "light", label: "روشنایی", icon: <Lightbulb size={18} /> },
	{ value: "storage", label: "داده", icon: <Database size={18} /> },
	{ value: "power", label: "توان", icon: <Power size={18} /> },
	{ value: "frequency", label: "فرکانس", icon: <Waves size={18} /> },
	{ value: "angle", label: "زاویه", icon: <Baseline size={18} /> },
];

export default function CategorySelect({
	category,
	setCategory,
}: {
	category: string;
	setCategory: (cat: string) => void;
}) {
	return (
		<Select.Root value={category} onValueChange={setCategory}>
			<Select.Trigger className="flex items-center justify-between w-full p-5 h-[70px] bg-white/30 dark:bg-gray-800/50 rounded-2xl shadow-md">
				<Select.Value>
					<div className="flex items-center gap-2">
						{CATEGORIES.find((c) => c.value === category)?.icon}
						<span>{CATEGORIES.find((c) => c.value === category)?.label}</span>
					</div>
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
					className="z-50 min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
				>
					<Select.Viewport
						className="p-2 max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all"
						style={{ scrollbarGutter: "stable" }}
					>
						{CATEGORIES.map((c) => (
							<Select.Item
								key={c.value}
								value={c.value}
								onFocus={(e) => e.preventDefault()}
								className="p-3 text-gray-500 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white dark:text-white dark:hover:text-gray-700"
							>
								<Select.ItemText>
									<div className="flex items-center gap-2">
										{c.icon}
										<span>{c.label}</span>
									</div>
								</Select.ItemText>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
