"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Header from "@/components/ui/header";
import { evaluate } from "mathjs";
import { Sparkles, History, Trash2, RotateCcw } from "lucide-react";

type HistoryItem = {
	id: string;
	expr: string;
	result: string;
	createdAt: string;
};

const SCI_BUTTONS = [
	"(",
	")",
	"√(",
	"^",
	"!",
	"sin(",
	"cos(",
	"tan(",
	"asin(",
	"acos(",
	"atan(",
	"ln(",
	"log(",
	"abs(",
	"exp(",
];

const BASIC_BUTTONS = [
	"7",
	"8",
	"9",
	"/",
	"4",
	"5",
	"6",
	"*",
	"1",
	"2",
	"3",
	"-",
	"0",
	".",
	"%",
	"+",
];

function formatResult(res: unknown): string {
	try {
		if (typeof res === "number") {
			if (Number.isInteger(res)) return `${res}`;
			return parseFloat(res.toPrecision(12)).toString();
		}
		return String(res);
	} catch {
		return String(res);
	}
}

export default function AdvancedCalculatorPage() {
	const [expr, setExpr] = useState<string>("");
	const exprRef = useRef(expr);
	const [result, setResult] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [scientific, setScientific] = useState<boolean>(false);

	useEffect(() => {
		exprRef.current = expr;
	}, [expr]);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await fetch("/api/history");
				const data = await res.json();
				setHistory(data);
			} catch {}
		};
		fetchHistory();
	}, []);

	const saveHistory = async (expr: string, result: string) => {
		try {
			const res = await fetch("/api/history", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ expr, result }),
			});
			const data = await res.json();
			setHistory((prev) => [data, ...prev.slice(0, 99)]);
		} catch {}
	};

	const handleDeleteHistory = async (id: string) => {
		try {
			await fetch("/api/history", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			setHistory((prev) => prev.filter((h) => h.id !== id));
		} catch {}
	};

	const compute = useCallback(async (expression: string) => {
		if (!expression.trim()) {
			setError("Expression is empty.");
			setResult("");
			return;
		}
		try {
			const sanitized = expression
				.replace(/×/g, "*")
				.replace(/÷/g, "/")
				.replace(/%/g, "/100");
			const r = evaluate(sanitized);
			const formatted = formatResult(r);
			setResult(formatted);
			setError(null);
			await saveHistory(expression, formatted);
			return formatted;
		} catch {
			setResult("");
			setError("Calculation error — check the expression.");
			return null;
		}
	}, []);

	const handleButton = (val: string) => {
		const ops = ["+", "-", "*", "/", "^", "%"];
		if (result && ops.includes(val) && !exprRef.current) {
			setExpr(result + val);
			setResult("");
			return;
		}
		setExpr((prev) => prev + val);
	};

	const handleClear = () => {
		setExpr("");
		setResult("");
		setError(null);
	};

	const handleAllClear = useCallback(() => {
		handleClear();
		setHistory([]);
	}, []);

	const handleBackspace = useCallback(() => {
		if (result) setResult("");
		else setExpr((prev) => prev.slice(0, -1));
	}, [result]);

	const handleEvaluate = useCallback(() => {
		compute(expr);
	}, [expr, compute]);

	const handleUseHistory = (item: HistoryItem) => {
		setExpr(item.result);
		setResult("");
		setError(null);
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const key = e.key;
			if (/^[0-9+\-*/().%^]$/.test(key)) {
				e.preventDefault();
				setExpr((prev) => prev + key);
			} else if (key === "Enter") {
				e.preventDefault();
				handleEvaluate();
			} else if (key === "Backspace") {
				e.preventDefault();
				handleBackspace();
			} else if (key.toLowerCase() === "c") {
				if (e.shiftKey) handleAllClear();
				else handleClear();
			} else if (key === "q") {
				handleAllClear();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [handleAllClear, handleBackspace, handleEvaluate]);

	const lastHistory = useMemo(() => history.slice(0, 20), [history]);

	return (
		<>
			<Header />
			<div className="min-h-screen pt-16 bg-gray-100 dark:bg-gray-900">
				<div className="container px-4 py-12 mx-auto">
					<div className="mb-12 text-center">
						<h1 className="mb-6 text-4xl font-extrabold text-gray-800 dark:text-gray-100 md:text-5xl">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
								Professional Calculator
							</span>
						</h1>
						<p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
							Complex mathematical calculations with advanced scientific
							features ✨
						</p>
					</div>
					<div className="grid max-w-6xl gap-8 mx-auto lg:grid-cols-3">
						<div className="lg:col-span-2">
							<div className="p-8 bg-white border-2 border-gray-200 rounded-3xl dark:bg-gray-800 dark:border-gray-700">
								<div className="p-6 text-white bg-gray-800 rounded-2xl dark:bg-gray-900">
									<div className="space-y-4">
										<div className="min-h-[2rem] text-right font-mono text-lg break-words">
											{expr || " "}
										</div>
										<div className="min-h-[3rem] text-3xl font-bold text-right md:text-4xl">
											{result || "—"}
										</div>
									</div>
								</div>
								<div className="p-6 border-b border-gray-200 dark:border-gray-700">
									<div className="flex flex-wrap justify-between gap-3">
										<div className="flex gap-3">
											<button
												onClick={() => setScientific((s) => !s)}
												className={`px-4 py-2 font-semibold transition-all rounded-xl ${
													scientific
														? "bg-purple-500 text-white"
														: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
												}`}
											>
												{scientific ? "Scientific 🔬" : "Scientific"}
											</button>
											<button
												onClick={handleEvaluate}
												className="px-4 py-2 font-bold text-white bg-green-500 rounded-xl hover:bg-green-600"
											>
												Calculate
											</button>
										</div>
										<div className="flex gap-2">
											<button
												onClick={handleBackspace}
												className="px-3 py-2 text-white bg-amber-500 rounded-xl hover:bg-amber-600"
											>
												⌫
											</button>
											<button
												onClick={handleClear}
												className="px-3 py-2 text-white bg-red-500 rounded-xl hover:bg-red-600"
											>
												C
											</button>
											<button
												onClick={handleAllClear}
												className="px-3 py-2 text-white bg-gray-500 rounded-xl hover:bg-gray-600"
											>
												AC
											</button>
										</div>
									</div>
								</div>
								<div className="p-6">
									{scientific && (
										<div className="grid grid-cols-4 gap-3 mb-4">
											{SCI_BUTTONS.map((s) => (
												<button
													key={s}
													onClick={() => handleButton(s === "√(" ? "sqrt(" : s)}
													className="py-3 font-semibold text-white bg-purple-500 rounded-2xl hover:bg-purple-600"
												>
													{s}
												</button>
											))}
										</div>
									)}
									<div className="grid grid-cols-4 gap-3">
										{BASIC_BUTTONS.map((b) => (
											<button
												key={b}
												onClick={() => handleButton(b)}
												className={`py-4 text-lg font-bold transition-all rounded-2xl ${
													["/", "*", "-", "+"].includes(b)
														? "bg-blue-500 text-white hover:bg-blue-600"
														: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
												}`}
											>
												{b}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
						<div className="lg:col-span-1">
							<div className="h-full bg-white border-2 border-gray-200 rounded-3xl dark:bg-gray-800 dark:border-gray-700">
								<div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-blue-500/10">
												<History
													className="text-blue-600 dark:text-blue-400"
													size={20}
												/>
											</div>
											<div>
												<h2 className="text-xl font-bold text-gray-800 dark:text-white">
													History
												</h2>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													Recent calculations
												</p>
											</div>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => {
													if (history.length) {
														setExpr(history[0].result);
														setResult("");
													}
												}}
												className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-100 dark:hover:bg-green-500/10"
												title="Use last result"
											>
												<RotateCcw size={18} />
											</button>
											<button
												onClick={() => setHistory([])}
												className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10"
												title="Clear history"
											>
												<Trash2 size={18} />
											</button>
										</div>
									</div>
								</div>
								<div className="p-4 h-[600px] overflow-y-auto">
									{lastHistory.length === 0 ? (
										<div className="py-16 text-center text-gray-500 dark:text-gray-400">
											<History size={48} className="mx-auto mb-4 opacity-50" />
											<p>No history yet</p>
										</div>
									) : (
										<div className="space-y-3">
											{lastHistory.map((h, index) => (
												<div
													key={h.id}
													className="p-4 transition-all bg-gray-100 border-2 border-gray-200 rounded-2xl group hover:shadow-lg dark:bg-gray-700 dark:border-gray-600"
												>
													<div className="mb-2 text-right">
														<div className="text-sm text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200">
															{h.expr}
														</div>
														<div className="text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
															= {h.result}
														</div>
													</div>
													<div className="flex items-center justify-between">
														<small className="text-xs text-gray-400">
															{new Date(h.createdAt).toLocaleString("en-US")}
														</small>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteHistory(h.id);
															}}
															className="px-2 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600"
														>
															Delete
														</button>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
