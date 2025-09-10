"use client";

import { useState } from "react";

type Unit = { value: string; label: string; category: string };

const UNITS: Unit[] = [
  // طول
  { value: "m", label: "متر", category: "length" },
  { value: "km", label: "کیلومتر", category: "length" },
  { value: "cm", label: "سانتی‌متر", category: "length" },
  { value: "mm", label: "میلی‌متر", category: "length" },
  { value: "in", label: "اینچ", category: "length" },
  { value: "ft", label: "فوت", category: "length" },
  // وزن
  { value: "g", label: "گرم", category: "weight" },
  { value: "kg", label: "کیلوگرم", category: "weight" },
  { value: "lb", label: "پوند", category: "weight" },
  { value: "oz", label: "اونس", category: "weight" },
  // حجم
  { value: "l", label: "لیتر", category: "volume" },
  { value: "ml", label: "میلی‌لیتر", category: "volume" },
  { value: "gal", label: "گالن", category: "volume" },
  { value: "cup", label: "پیمانه", category: "volume" },
  // دما
  { value: "c", label: "سلسیوس", category: "temperature" },
  { value: "f", label: "فارنهایت", category: "temperature" },
  { value: "k", label: "کلوین", category: "temperature" },
  // زمان
  { value: "s", label: "ثانیه", category: "time" },
  { value: "min", label: "دقیقه", category: "time" },
  { value: "h", label: "ساعت", category: "time" },
  { value: "d", label: "روز", category: "time" },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<string>("length");
  const [from, setFrom] = useState<string>("m");
  const [to, setTo] = useState<string>("km");
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const filteredUnits = UNITS.filter((u) => u.category === category);

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("ورودی نامعتبر");
      return;
    }

    let res: number | null = null;

    switch (category) {
      case "length": {
        // تبدیل همه واحدها به متر
        let meters = num;
        if (from === "km") meters = num * 1000;
        if (from === "cm") meters = num / 100;
        if (from === "mm") meters = num / 1000;
        if (from === "in") meters = num * 0.0254;
        if (from === "ft") meters = num * 0.3048;

        // از متر به واحد مقصد
        if (to === "km") res = meters / 1000;
        if (to === "cm") res = meters * 100;
        if (to === "mm") res = meters * 1000;
        if (to === "in") res = meters / 0.0254;
        if (to === "ft") res = meters / 0.3048;
        if (to === "m") res = meters;
        break;
      }
      case "weight": {
        let grams = num;
        if (from === "kg") grams = num * 1000;
        if (from === "lb") grams = num * 453.59237;
        if (from === "oz") grams = num * 28.3495;

        if (to === "kg") res = grams / 1000;
        if (to === "lb") res = grams / 453.59237;
        if (to === "oz") res = grams / 28.3495;
        if (to === "g") res = grams;
        break;
      }
      case "volume": {
        let liters = num;
        if (from === "ml") liters = num / 1000;
        if (from === "gal") liters = num * 3.78541;
        if (from === "cup") liters = num * 0.24;

        if (to === "ml") res = liters * 1000;
        if (to === "gal") res = liters / 3.78541;
        if (to === "cup") res = liters / 0.24;
        if (to === "l") res = liters;
        break;
      }
      case "temperature": {
        if (from === "c") {
          if (to === "f") res = num * 9 / 5 + 32;
          else if (to === "k") res = num + 273.15;
          else res = num;
        }
        if (from === "f") {
          if (to === "c") res = (num - 32) * 5 / 9;
          else if (to === "k") res = (num - 32) * 5 / 9 + 273.15;
          else res = num;
        }
        if (from === "k") {
          if (to === "c") res = num - 273.15;
          else if (to === "f") res = (num - 273.15) * 9 / 5 + 32;
          else res = num;
        }
        break;
      }
      case "time": {
        let seconds = num;
        if (from === "min") seconds = num * 60;
        if (from === "h") seconds = num * 3600;
        if (from === "d") seconds = num * 86400;

        if (to === "s") res = seconds;
        if (to === "min") res = seconds / 60;
        if (to === "h") res = seconds / 3600;
        if (to === "d") res = seconds / 86400;
        break;
      }
    }

    setResult(res !== null ? `${res} ${filteredUnits.find((u) => u.value === to)?.label}` : "خطا در تبدیل");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">🔄 تبدیل واحد</h2>

      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          const firstUnit = UNITS.find((u) => u.category === e.target.value)?.value;
          setFrom(firstUnit || "");
          setTo(firstUnit || "");
          setResult("");
          setValue("");
        }}
        className="w-full p-2 mb-3 border rounded"
      >
        <option value="length">طول</option>
        <option value="weight">وزن</option>
        <option value="volume">حجم</option>
        <option value="temperature">دما</option>
        <option value="time">زمان</option>
      </select>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="عدد را وارد کنید"
        className="w-full p-2 mb-3 border rounded"
      />

      <div className="flex gap-2 mb-3">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          {filteredUnits.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>

        <span className="self-center">➡️</span>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          {filteredUnits.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={convert}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        تبدیل
      </button>

      {result && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-center">
          نتیجه: {result}
        </div>
      )}
    </div>
  );
}
