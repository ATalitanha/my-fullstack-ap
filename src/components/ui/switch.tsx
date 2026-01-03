"use client";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export default function Switch({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
        aria-label={label}
      >
        <SwitchPrimitive.Thumb className="block w-5 h-5 bg-white rounded-full shadow transform translate-x-0 data-[state=checked]:translate-x-6 transition-transform" />
      </SwitchPrimitive.Root>
    </label>
  );
}

