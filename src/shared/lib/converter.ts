import { UNITS } from "@/shared/lib/db";

export const convertValue = (value: number, from: string, to: string) => {
  const fromUnit = UNITS.find((unit) => unit.symbol === from);
  const toUnit = UNITS.find((unit) => unit.symbol === to);
  if (!fromUnit || !toUnit) {
    return 0;
  }
  return (value * fromUnit.rate) / toUnit.rate;
};
