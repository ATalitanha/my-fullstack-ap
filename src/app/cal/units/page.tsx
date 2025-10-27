"use client";

import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import { UNITS } from "@/lib/db";
import { convertValue } from "@/lib/converter";
import UnitSelect from "@/components/UnitSelect";
import CategorySelect from "@/components/CategorySelect";
import { ArrowRightLeft, Calculator } from "lucide-react";

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

	useEffect(() => {
		handleConvert();
	}, [value, from, to, category]);

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto max-w-2xl">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">تبدیل واحد</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl">
							تبدیل سریع و دقیق بین واحدهای مختلف اندازه‌گیری ✨
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
						<div className="p-6 text-center text-2xl font-bold rounded-xl mb-8 bg-gray-100 dark:bg-gray-700">
							{result || "نتیجه"}
						</div>

						<div className="mb-6">
							<CategorySelect category={category} setCategory={setCategory} />
						</div>

						<div className="mb-6">
							<input
								type="number"
								min={0}
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="مقدار را وارد کنید"
								className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-center font-bold text-lg"
							/>
						</div>

						<div className="flex flex-col sm:flex-row items-center gap-4">
							<div className="flex-1 w-full">
								<UnitSelect
									value={from}
									setValue={setFrom}
									units={filteredUnits}
								/>
							</div>

							<div className="p-3 bg-primary/10 rounded-full">
								<ArrowRightLeft className="text-primary" size={20} />
							</div>

							<div className="flex-1 w-full">
								<UnitSelect value={to} setValue={setTo} units={filteredUnits} />
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
