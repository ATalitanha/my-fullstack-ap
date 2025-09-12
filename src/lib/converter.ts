import { UNITS } from "@/lib/db";

export function convertValue(category: string, from: string, to: string, value: number): string {
  let res: number | null = null;

  if (category === "temperature") {
    if (from === to) res = value;
    else if (from === "c" && to === "f") res = value * 9/5 + 32;
    else if (from === "c" && to === "k") res = value + 273.15;
    else if (from === "f" && to === "c") res = (value - 32) * 5/9;
    else if (from === "f" && to === "k") res = (value - 32) * 5/9 + 273.15;
    else if (from === "k" && to === "c") res = value - 273.15;
    else if (from === "k" && to === "f") res = (value - 273.15) * 9/5 + 32;
  } else {
    const fromUnit = UNITS.find((u) => u.value === from);
    const toUnit = UNITS.find((u) => u.value === to);
    if (fromUnit?.factor && toUnit?.factor) {
      res = value * (fromUnit.factor / toUnit.factor);
    }
  }

  if (res === null) return "خطا در تبدیل";

  // 🎯 فرمت خروجی: اگر اعشار نداره -> عدد صحیح
  // اگر اعشار داره -> تا 6 رقم مهم
  const formatted =
    Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(6)).toString();

  return `${formatted} ${UNITS.find((u) => u.value === to)?.label ?? ""}`;
}
