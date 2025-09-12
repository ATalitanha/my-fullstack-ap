"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Unit } from "@/lib/type";

export default function UnitSelect({
  value,
  setValue,
  units,
}: {
  value: string;
  setValue: (val: string) => void;
  units: Unit[];
}) {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger className="flex-1 p-3 rounded-2xl bg-white/30 border dark:bg-gray-800/50 justify-between flex">
        <Select.Value>{units.find(u => u.value === value)?.label}</Select.Value>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content side="bottom" align="start" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg z-50 w-full sm:w-[200px]">
          <Select.Viewport className="p-2">
            {units.map((unit) => (
              <Select.Item
                key={unit.value}
                value={unit.value}
                className="p-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white"
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
