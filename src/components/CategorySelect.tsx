"use client";

// ایمپورت‌های لازم از Radix UI و آیکون‌ها
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

// تعریف دسته‌بندی‌ها با برچسب و آیکون
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

// کامپوننت CategorySelect
export default function CategorySelect({
  category,
  setCategory,
}: {
  category: string;                  // دسته‌بندی انتخاب شده فعلی
  setCategory: (cat: string) => void; // تابع تغییر دسته‌بندی
}) {
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
          side="bottom"               // نمایش زیر تریگر
          align="start"               // تراز با شروع تریگر
          avoidCollisions={false}     // جلوگیری از تغییر خودکار موقعیت
          position="popper"           // استفاده از Popper برای پوزیشنینگ
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
                key={c.value}           // کلید یکتا
                value={c.value}         // مقدار آیتم
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
