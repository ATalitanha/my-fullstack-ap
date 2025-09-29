"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

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

export default function CategorySelect({
  category,
  setCategory,
}: {
  category: string;
  setCategory: (cat: string) => void;
}) {
  return (
    <Select.Root value={category} onValueChange={setCategory}>
      <Select.Trigger className="w-full p-5 rounded-2xl min-h-[70px] bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-md mb-4">
        <Select.Value>{CATEGORIES.find(c => c.value === category)?.label}</Select.Value>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content side="bottom" align="start" className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg z-50">
          <Select.Viewport className="p-2">
            {CATEGORIES.map(c => (
              <Select.Item
                key={c.value}
                value={c.value}
                className="p-3 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white"
              >
                <Select.ItemText>{c.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
