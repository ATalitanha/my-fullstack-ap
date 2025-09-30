"use client";

// ایمپورت‌های لازم از Radix UI و آیکون‌ها
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

// تایپ Unit که از کتابخانه محلی وارد شده
import { Unit } from "@/lib/type";

// تعریف پروپس‌های کامپوننت UnitSelect
interface UnitSelectProps {
  value: string;                   // مقدار انتخاب شده فعلی
  setValue: (val: string) => void; // تابع برای تغییر مقدار انتخاب شده
  units: Unit[];                   // لیست واحدها برای نمایش در منو
}

// کامپوننت UnitSelect
export default function UnitSelect({ value, setValue, units }: UnitSelectProps) {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      
      {/* تریگر (نمایش انتخاب فعلی و آیکون) */}
      <Select.Trigger
        className="
          w-full p-5 h-[70px] rounded-2xl
          bg-white/30 dark:bg-gray-800/50
          flex justify-between items-center
          shadow-md
        "
      >
        {/* نمایش برچسب واحد انتخاب شده */}
        <Select.Value>
          {units.find(u => u.value === value)?.label}
        </Select.Value>

        {/* آیکون فلش پایین */}
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      {/* منو پاپ‌آپ */}
      <Select.Portal>
        <Select.Content
          side="bottom"               // موقعیت منو زیر تریگر
          align="start"               // شروع منطبق با تریگر
          avoidCollisions={false}     // جلوگیری از تغییر موقعیت خودکار
          position="popper"           // استفاده از Popper برای پوزیشنینگ
          className="
            bg-white dark:bg-gray-800
            rounded-2xl shadow-lg z-50
            w-full sm:w-[200px] max-h-60
            min-w-[var(--radix-select-trigger-width)]  // عرض برابر با تریگر
          "
        >
          {/* اسکرول و ویوپورت آیتم‌ها */}
          <Select.Viewport
            className="
              p-2 h-full overflow-y-auto
              scrollbar-thin
              scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
              scrollbar-thumb-rounded
              scrollbar-track-transparent
              hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
              transition-all
            "
            style={{ scrollbarGutter: "stable" }} // جلوگیری از پرش اسکرول هنگام ظاهر شدن
          >
            {/* رندر تک‌تک آیتم‌های واحد */}
            {units.map(unit => (
              <Select.Item
                key={unit.value}           // کلید یکتا
                value={unit.value}         // مقدار آیتم
                onFocus={(e) => e.preventDefault()} // جلوگیری از فوکوس پیش‌فرض
                className="
                  p-3 rounded-lg cursor-pointer
                  hover:bg-blue-500 text-gray-500 dark:text-white
                  hover:text-white dark:hover:text-gray-700
                "
              >
                {/* نمایش برچسب واحد */}
                <Select.ItemText>{unit.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
