"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
// ایمپورت‌های لازم از Radix UI و آیکون‌ها
import * as Select from "@radix-ui/react-select";
import { useTranslation } from "@/hooks/useLanguage";

/**
 * A select component that allows the user to choose a category for unit conversion.
 * @param {object} props - The component props.
 * @param {string} props.category - The currently selected category.
 * @param {(category: string) => void} props.setCategory - A function to set the selected category.
 * @returns {JSX.Element} The category select component.
 */
export default function CategorySelect({
	category,
	setCategory,
}: {
	category: string; // دسته‌بندی انتخاب شده فعلی
	setCategory: (cat: string) => void; // تابع تغییر دسته‌بندی
}) {
	const { t } = useTranslation("app.units.categories");

	const CATEGORIES = [
		{ value: "length", label: t("length") },
		{ value: "weight", label: t("weight") },
		{ value: "volume", label: t("volume") },
		{ value: "temperature", label: t("temperature") },
		{ value: "time", label: t("time") },
		{ value: "speed", label: t("speed") },
		{ value: "energy", label: t("energy") },
		{ value: "pressure", label: t("pressure") },
		{ value: "area", label: t("area") },
		{ value: "light", label: t("light") },
		{ value: "storage", label: t("storage") },
		{ value: "power", label: t("power") },
		{ value: "frequency", label: t("frequency") },
		{ value: "angle", label: t("angle") },
	];

	return (
		<Select.Root value={category} onValueChange={setCategory}>
			{/* تریگر: نمایش دسته‌بندی انتخاب شده و آیکون فلش */}
			<Select.Trigger
				className="
          w-full p-5 h-[70px] rounded-2xl
          bg-white/30 dark:bg-gray-800/50
          flex justify-between items-center
          shadow-md
        "
			>
				{/* نمایش برچسب دسته‌بندی انتخاب شده */}
				<Select.Value>
					{CATEGORIES.find((c) => c.value === category)?.label}
				</Select.Value>

				{/* آیکون فلش پایین */}
				<Select.Icon>
					<ChevronDownIcon />
				</Select.Icon>
			</Select.Trigger>

			{/* منوی پاپ‌آپ */}
			<Select.Portal>
				<Select.Content
					side="bottom" // نمایش زیر تریگر
					align="start" // تراز با شروع تریگر
					avoidCollisions={false} // جلوگیری از تغییر خودکار موقعیت
					position="popper" // استفاده از Popper برای پوزیشنینگ
					className="
            bg-white dark:bg-gray-800
            rounded-2xl shadow-lg z-50
            min-w-[var(--radix-select-trigger-width)]  // عرض برابر با تریگر
          "
				>
					{/* ویوپورت آیتم‌ها با اسکرول */}
					<Select.Viewport
						className="
              p-2 max-h-44 overflow-y-auto
              scrollbar-thin
              scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
              scrollbar-thumb-rounded
              scrollbar-track-transparent
              hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
              transition-all
            "
						style={{ scrollbarGutter: "stable" }} // جلوگیری از پرش اسکرول
					>
						{/* رندر تک‌تک آیتم‌های دسته‌بندی */}
						{CATEGORIES.map((c) => (
							<Select.Item
								key={c.value} // کلید یکتا
								value={c.value} // مقدار آیتم
								onFocus={(e) => e.preventDefault()} // جلوگیری از فوکوس پیش‌فرض
								className="
                  p-3 rounded-lg cursor-pointer
                  hover:bg-blue-500 text-gray-500 dark:text-white
                  hover:text-white dark:hover:text-gray-700
                "
							>
								{/* نمایش برچسب آیتم */}
								<Select.ItemText>{c.label}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
