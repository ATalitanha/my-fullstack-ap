"use client";

import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import { UNITS } from "@/lib/units";
import { convertValue } from "@/lib/converter";
import UnitSelect from "@/components/UnitSelect";
import CategorySelect from "@/components/CategorySelect";
import { Sparkles, ArrowRightLeft, Calculator } from "lucide-react";

export default function UnitConverterPage() {
	const [category, setCategory] = useState("length");
	const [from, setFrom] = useState("m");
	const [to, setTo] = useState("cm");
	const [value, setValue] = useState("");
	const [result, setResult] = useState("");

	const filteredUnits = UNITS.filter((u) => u.category === category);

	const handleConvert = () => {
		if (!value) return;
		const num = parseFloat(value);
		if (isNaN(num)) {
			setResult("ورودی نامعتبر");
			return;
		}
		setResult(convertValue(category, from, to, num));
	};

	const increment = () => setValue((prev) => String(Number(prev || 0) + 1));
	const decrement = () => setValue((prev) => String(Number(prev || 0) - 1));

	return (
		<>
			<Header />
			<div className="min-h-screen pt-16 bg-gray-100 dark:bg-gray-900">
				<div className="flex flex-col items-center justify-center px-4 py-12">
					<div className="mb-12 text-center">
						<h1 className="mb-6 text-4xl font-extrabold text-gray-800 dark:text-gray-100 md:text-5xl">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
								تبدیل واحد
							</span>
						</h1>
						<p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
							تبدیل سریع و دقیق بین واحدهای مختلف اندازه‌گیری ✨
						</p>
					</div>
					<div className="w-full max-w-2xl p-8 text-gray-700 bg-white border-2 border-gray-200 rounded-3xl dark:text-white dark:bg-gray-800 dark:border-gray-700">
						<div className="flex items-center justify-center p-6 mb-8 text-2xl font-bold text-center bg-gray-100 border-2 border-gray-200 rounded-2xl min-h-[100px] dark:bg-gray-700 dark:border-gray-600">
							<span className="text-gray-800 dark:text-gray-100">
								{result || "نتیجه تبدیل اینجا نمایش داده می‌شود"}
							</span>
						</div>
						<div className="mb-6">
							<CategorySelect category={category} setCategory={setCategory} />
						</div>
						<div className="relative w-full mb-6">
							<input
								type="number"
								min={0}
								value={value}
								onChange={(e) => {
									const num = parseFloat(e.target.value);
									if (num < 0) {
										setValue("0");
									} else {
										setValue(e.target.value);
									}
								}}
								placeholder="عدد را وارد کنید"
								className="w-full h-[70px] px-6 py-4 text-lg font-bold text-center bg-gray-100 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-700 dark:border-gray-600"
							/>
							<div className="absolute top-1/2 right-3 flex flex-col space-y-2 -translate-y-1/2">
								<button
									onClick={increment}
									className="flex items-center justify-center w-8 h-8 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
								>
									+
								</button>
								<button
									onClick={decrement}
									className="flex items-center justify-center w-8 h-8 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
								>
									−
								</button>
							</div>
						</div>
						<div className="flex flex-col items-center w-full gap-4 mb-8 sm:flex-row">
							<div className="flex-1">
								<UnitSelect
									value={from}
									setValue={setFrom}
									units={filteredUnits}
								/>
							</div>
							<div className="p-3 bg-blue-500 rounded-xl">
								<ArrowRightLeft className="text-white" size={20} />
							</div>
							<div className="flex-1">
								<UnitSelect value={to} setValue={setTo} units={filteredUnits} />
							</div>
						</div>
						<button
							onClick={handleConvert}
							className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700"
						>
							<Calculator size={20} />
							تبدیل کن
						</button>
					</div>
					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							پشتیبانی از واحدهای طول، وزن، حجم، دما و زمان
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
