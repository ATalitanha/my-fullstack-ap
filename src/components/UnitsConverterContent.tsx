"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CategorySelect from "@/components/CategorySelect";
import UnitSelect from "@/components/UnitSelect";
import { useTranslation } from "@/hooks/useLanguage";
import { convertValue } from "@/lib/converter";
import { UNITS } from "@/lib/db";
import Card from "@/shared/ui/Card";
import MouseHover from "@/shared/ui/mouseHover";

// داینامیک ایمپورت برای motion components
const MotionDiv = dynamic(
	() => import("framer-motion").then((m) => m.motion.div),
	{ ssr: false },
);

const MotionButton = dynamic(
	() => import("framer-motion").then((m) => m.motion.button),
	{ ssr: false },
);

const MotionSpan = dynamic(
	() => import("framer-motion").then((m) => m.motion.span),
	{ ssr: false },
);

export default function UnitConverterContent() {
	const [category, setCategory] = useState("length");
	const [from, setFrom] = useState("m");
	const [to, setTo] = useState("cm");
	const [value, setValue] = useState("");
	const [result, setResult] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const { t, language } = useTranslation("app.units");

	useEffect(() => {
		setIsLoading(false);
	}, []);

	const filteredUnits = UNITS.filter((u) => u.category === category);

	const handleConvert = () => {
		if (!value) return;
		const num = parseFloat(value);
		if (Number.isNaN(num)) {
			setResult(t("invalid_input"));
			return;
		}
		setResult(convertValue(category, from, to, num));
	};

	const increment = () => setValue((prev) => String(Number(prev || 0) + 1));
	const decrement = () => setValue((prev) => String(Number(prev || 0) - 1));

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<>
			<MouseHover />

			<div className="min-h-screen pt-16 transition-colors duration-700 relative z-10 bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
				</div>

				<div className="flex flex-col items-center justify-center px-4 py-12 relative z-10">
					<MotionDiv
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="w-full max-w-2xl"
					>
						<Card className="p-8 text-gray-700 dark:text-white">
							<MotionDiv
								key={result}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="p-6 text-center text-2xl font-bold rounded-2xl min-h-[100px] bg-linear-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg border border-white/40 dark:border-gray-600/40 flex items-center justify-center mb-8"
							>
								<AnimatePresence mode="wait">
									<MotionSpan
										key={result}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="text-gray-800 dark:text-gray-100"
									>
										{result || t("result_placeholder")}
									</MotionSpan>
								</AnimatePresence>
							</MotionDiv>

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
									placeholder={t("placeholder")}
									className="w-full px-6 py-4 rounded-2xl h-[70px] bg-white/80 dark:bg-gray-700/80 border border-white/40 dark:border-gray-600/40 shadow-lg text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
								/>

								<div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col space-y-2">
									<MotionButton
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={increment}
										className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg shadow-blue-500/25"
									>
										+
									</MotionButton>
									<MotionButton
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={decrement}
										className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg shadow-blue-500/25"
									>
										−
									</MotionButton>
								</div>
							</div>

							<div
								dir="ltr"
								className="flex flex-row items-center gap-4 mb-8 w-full"
							>
								<div className="flex-1">
									<UnitSelect
										value={from}
										setValue={setFrom}
										units={filteredUnits}
									/>
								</div>

								<MotionDiv
									onClick={() => {
										setTo(from);
										setFrom(to);
									}}
									whileHover={{ scale: 1.1, rotate: 180 }}
									className="w-[70px] bg-linear-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center h-[70px] cursor-pointer"
								>
									<ArrowRight
										className={`text-white transition-transform ${language === "fa" ? "rotate-180" : ""}`}
										size={30}
									/>
								</MotionDiv>

								<div className="flex-1">
									<UnitSelect
										value={to}
										setValue={setTo}
										units={filteredUnits}
									/>
								</div>
							</div>

							<MotionButton
								whileHover={{
									scale: 1.02,
									y: -2,
								}}
								whileTap={{ scale: 0.98 }}
								onClick={handleConvert}
								className="w-full py-4 rounded-2xl font-bold text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
							>
								<Calculator size={20} />
								{t("convert")}
							</MotionButton>
						</Card>
					</MotionDiv>

					<MotionDiv
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-8 text-center"
					>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							{t("footer_text")}
						</p>
					</MotionDiv>
				</div>
			</div>
		</>
	);
}

// اسکلتون لودینگ
const LoadingSkeleton = () => (
	<div className="min-h-screen pt-16 bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
		<div className="flex flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-2xl animate-pulse">
				<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />
				<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
				<div className="h-[70px] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6" />
				<div className="flex gap-4 mb-8">
					<div className="flex-1 h-[70px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />
					<div className="w-[70px] h-[70px] bg-gray-200 dark:bg-gray-700 rounded-xl" />
					<div className="flex-1 h-[70px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />
				</div>
				<div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
			</div>
		</div>
	</div>
);
