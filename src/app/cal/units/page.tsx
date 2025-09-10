"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

type Unit = {
  category: string;
  label: string;
  value: string;
  factor?: number;
};

// واحدها
const UNITS: Unit[] = [
  // طول
  { category: "length", label: "متر", value: "m", factor: 1 },
  { category: "length", label: "سانتی‌متر", value: "cm", factor: 0.01 },
  { category: "length", label: "کیلومتر", value: "km", factor: 1000 },
  { category: "length", label: "میلی‌متر", value: "mm", factor: 0.001 },
  { category: "length", label: "اینچ", value: "in", factor: 0.0254 },
  { category: "length", label: "فوت", value: "ft", factor: 0.3048 },
  { category: "length", label: "یارد", value: "yd", factor: 0.9144 },
  { category: "length", label: "مایل", value: "mile", factor: 1609.34 },

  // وزن
  { category: "weight", label: "کیلوگرم", value: "kg", factor: 1 },
  { category: "weight", label: "گرم", value: "g", factor: 0.001 },
  { category: "weight", label: "تن", value: "t", factor: 1000 },
  { category: "weight", label: "پوند", value: "lb", factor: 0.453592 },
  { category: "weight", label: "اونس", value: "oz", factor: 0.0283495 },

  // حجم
  { category: "volume", label: "لیتر", value: "l", factor: 1 },
  { category: "volume", label: "میلی‌لیتر", value: "ml", factor: 0.001 },
  { category: "volume", label: "متر مکعب", value: "m3", factor: 1000 },
  { category: "volume", label: "گالن (US)", value: "gal", factor: 3.78541 },
  { category: "volume", label: "پیمانه", value: "cup", factor: 0.24 },

  // دما
  { category: "temperature", label: "سانتی‌گراد", value: "c" },
  { category: "temperature", label: "فارنهایت", value: "f" },
  { category: "temperature", label: "کلوین", value: "k" },

  // زمان
  { category: "time", label: "ثانیه", value: "s", factor: 1 },
  { category: "time", label: "دقیقه", value: "min", factor: 60 },
  { category: "time", label: "ساعت", value: "h", factor: 3600 },
  { category: "time", label: "روز", value: "day", factor: 86400 },
  { category: "time", label: "هفته", value: "week", factor: 604800 },
  { category: "time", label: "سال", value: "year", factor: 31536000 },

  // سرعت
  { category: "speed", label: "متر بر ثانیه", value: "m/s", factor: 1 },
  { category: "speed", label: "کیلومتر بر ساعت", value: "km/h", factor: 0.277778 },
  { category: "speed", label: "مایل بر ساعت", value: "mph", factor: 0.44704 },
  { category: "speed", label: "گره", value: "knot", factor: 0.514444 },

  // انرژی
  { category: "energy", label: "ژول", value: "J", factor: 1 },
  { category: "energy", label: "کالری", value: "cal", factor: 4.184 },
  { category: "energy", label: "کیلوکالری", value: "kcal", factor: 4184 },
  { category: "energy", label: "کیلووات ساعت", value: "kWh", factor: 3.6e6 },

  // فشار
  { category: "pressure", label: "پاسکال", value: "Pa", factor: 1 },
  { category: "pressure", label: "بار", value: "bar", factor: 1e5 },
  { category: "pressure", label: "اتمسفر", value: "atm", factor: 101325 },
  { category: "pressure", label: "میلی‌متر جیوه", value: "mmHg", factor: 133.322 },
  { category: "pressure", label: "psi", value: "psi", factor: 6894.76 },

  // مساحت
  { category: "area", label: "متر مربع", value: "m2", factor: 1 },
  { category: "area", label: "کیلومتر مربع", value: "km2", factor: 1e6 },
  { category: "area", label: "هکتار", value: "ha", factor: 10000 },
  { category: "area", label: "اینچ مربع", value: "in2", factor: 0.00064516 },
  { category: "area", label: "فوت مربع", value: "ft2", factor: 0.092903 },
  { category: "area", label: "یارد مربع", value: "yd2", factor: 0.836127 },

  // روشنایی
  { category: "light", label: "لوکس", value: "lux", factor: 1 },
  { category: "light", label: "فوت‌کاندلا", value: "fc", factor: 10.764 },
];

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const filteredUnits = UNITS.filter((u) => u.category === category);

  const convert = () => {
    if (!value) return;
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("ورودی نامعتبر");
      return;
    }

    let res: number | null = null;

    if (category === "temperature") {
      if (from === to) res = num;
      else if (from === "c" && to === "f") res = num * 9 / 5 + 32;
      else if (from === "c" && to === "k") res = num + 273.15;
      else if (from === "f" && to === "c") res = (num - 32) * 5 / 9;
      else if (from === "f" && to === "k") res = (num - 32) * 5 / 9 + 273.15;
      else if (from === "k" && to === "c") res = num - 273.15;
      else if (from === "k" && to === "f") res = (num - 273.15) * 9 / 5 + 32;
    } else {
      const fromUnit = UNITS.find((u) => u.value === from);
      const toUnit = UNITS.find((u) => u.value === to);
      if (fromUnit?.factor && toUnit?.factor) {
        res = num * (fromUnit.factor / toUnit.factor);
      }
    }

    if (res !== null) {
      const formatted = parseFloat(res.toString()).toString();
      setResult(`${formatted} ${filteredUnits.find(u => u.value === to)?.label}`);
    } else {
      setResult("خطا در تبدیل");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 flex flex-col items-center
                      bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100
                      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 w-full max-w-md rounded-3xl shadow-xl
                     backdrop-blur-md bg-white/20 dark:bg-black/20 text-black dark:text-white
                     flex flex-col gap-4 max-h-[calc(100vh-64px)] overflow-auto"
        >
          <h1 className="text-2xl font-extrabold text-center mb-4">🔄 تبدیل واحد</h1>

          <motion.div
            dir="rtl"
            key={result}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 text-center text-xl font-bold rounded-2xl min-h-[70px]
                       bg-white/30 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >
            {result || ""}
          </motion.div>

          {/* تب‌های دسته‌بندی */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {["length","weight","volume","temperature","time","speed","energy","pressure","area","light"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  const first = UNITS.find(u => u.category === cat)?.value;
                  setFrom(first || "");
                  setTo(first || "");
                  setValue("");
                  setResult("");
                }}
                className={`px-4 py-2 rounded-full font-bold transition
                  ${category === cat 
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }
                  hover:scale-105 flex-1 sm:flex-none text-center`}
              >
                {cat === "length" ? "📏 طول" :
                 cat === "weight" ? "⚖️ وزن" :
                 cat === "volume" ? "🧪 حجم" :
                 cat === "temperature" ? "🌡️ دما" :
                 cat === "time" ? "⏱️ زمان" :
                 cat === "speed" ? "🏎️ سرعت" :
                 cat === "energy" ? "⚡ انرژی" :
                 cat === "pressure" ? "🔧 فشار" :
                 cat === "area" ? "🗺️ مساحت" :
                 "💡 روشنایی"}
              </button>
            ))}
          </div>

          {/* ورودی عدد */}
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="عدد را وارد کنید"
            className="w-full p-4 rounded-2xl text-center font-bold
                       bg-white/30 border border-gray-300 dark:bg-gray-800/50 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* سلکت‌ها */}
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
            <SelectComponent label="از" value={from} setValue={setFrom} units={filteredUnits} />
            <span className="text-lg">➡️</span>
            <SelectComponent label="به" value={to} setValue={setTo} units={filteredUnits} />
          </div>

          {/* دکمه تبدیل */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={convert}
            className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            تبدیل کن
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}

// کامپوننت سلکت
function SelectComponent({
  label,
  value,
  setValue,
  units,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  units: Unit[];
}) {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger className="flex-1 p-3 rounded-2xl bg-white/30 border border-gray-300 dark:bg-gray-800/50 dark:border-gray-700
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 justify-between items-center flex">
        <Select.Value className="text-center w-full">{units.find(u => u.value === value)?.label}</Select.Value>
        <Select.Icon className="ml-2">
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
                className="p-2 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white flex items-center"
              >
                <Select.ItemText className="w-full">{unit.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
