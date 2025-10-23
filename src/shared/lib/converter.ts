import { UNITS } from "@/shared/lib/db";

export const convertValue = (value: number, from: string, to: string) => {
  const fromUnit = UNITS.find((unit) => unit.value === from);
  const toUnit = UNITS.find((unit) => unit.value === to);
  if (!fromUnit || !toUnit || !fromUnit.factor || !toUnit.factor) {
    return 0;
  }
  return (value * fromUnit.factor) / toUnit.factor;
};
