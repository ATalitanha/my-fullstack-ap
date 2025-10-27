"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/ui/header";
import { evaluate } from "mathjs";
import { History, Trash2, RotateCcw } from "lucide-react";

type HistoryItem = {
	id: string;
	expr: string;
	result: string;
	createdAt: string;
};

const SCI_BUTTONS = [
	"(", ")", "√(", "^", "!", "sin(", "cos(", "tan(", "asin(", "acos(", "atan(", "ln(", "log(", "abs(", "exp(",
];

const BASIC_BUTTONS = [
	"7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+",
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
	const [result, setResult] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [scientific, setScientific] = useState<boolean>(false);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await fetch("/api/adhistory");
				const data = await res.json();
				setHistory(data);
			} catch {}
		};
		fetchHistory();
	}, []);

	const saveHistory = async (expr: string, result: string) => {
		try {
			const res = await fetch("/api/adhistory", {
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
			await fetch("/api/adhistory", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			setHistory((prev) => prev.filter((h) => h.id !== id));
		} catch {}
	};

	const compute = useCallback(async (expression: string) => {
		if (!expression.trim()) {
			setError("عبارت خالی است.");
			setResult("");
			return;
		}
		try {
			const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
			const r = evaluate(sanitized);
			const formatted = formatResult(r);
			setResult(formatted);
			setError(null);
			await saveHistory(expression, formatted);
		} catch {
			setResult("");
			setError("خطا در محاسبه - عبارت را بررسی کنید.");
		}
	}, []);

	const handleButton = (val: string) => {
		if (result && ["+", "-", "*", "/", "^", "%"].includes(val)) {
			setExpr(result + val);
			setResult("");
		} else {
			setExpr((prev) => prev + val);
		}
	};

	const handleClear = () => {
		setExpr("");
		setResult("");
		setError(null);
	};

	const handleBackspace = () => {
		if (result) setResult("");
		else setExpr((prev) => prev.slice(0, -1));
	};

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">ماشین حساب پیشرفته</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl">
							محاسبات پیچیده ریاضی با امکانات علمی ✨
						</p>
					</div>
					<div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						<div className="lg:col-span-2">
							{error && <div className="text-center mb-4 p-3 bg-danger/10 text-danger rounded-xl">{error}</div>}
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
								<div className="p-6 bg-gray-800 text-white text-right">
									<div className="font-mono text-lg min-h-[2rem] break-words">{expr || " "}</div>
									<div className="font-bold text-4xl min-h-[3rem]">{result || "—"}</div>
								</div>
								<div className="p-6 border-b border-gray-200 dark:border-gray-700">
									<div className="flex justify-between items-center gap-2">
										<button onClick={() => setScientific(s => !s)} className={`px-4 py-2 rounded-xl font-semibold ${scientific ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
											{scientific ? "علمی 🔬" : "ساده"}
										</button>
										<div className="flex gap-2">
											<button onClick={handleBackspace} className="px-4 py-2 rounded-xl bg-warning text-white font-bold">⌫</button>
											<button onClick={handleClear} className="px-4 py-2 rounded-xl bg-danger text-white font-bold">C</button>
											<button onClick={() => compute(expr)} className="px-4 py-2 rounded-xl bg-success text-white font-bold">=</button>
										</div>
									</div>
								</div>
								<div className="p-6">
									{scientific && (
										<div className="grid grid-cols-5 gap-3 mb-4">
											{SCI_BUTTONS.map(s => (
												<button key={s} onClick={() => handleButton(s === "√(" ? "sqrt(" : s)} className="py-3 rounded-2xl bg-primary/80 text-white font-semibold">
													{s}
												</button>
											))}
										</div>
									)}
									<div className="grid grid-cols-4 gap-3">
										{BASIC_BUTTONS.map(b => (
											<button key={b} onClick={() => handleButton(b)} className={`py-4 rounded-2xl font-bold text-lg ${["/", "*", "-", "+"].includes(b) ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
												{b}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
						<div className="lg:col-span-1">
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full">
								<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
									<div className="flex items-center gap-3">
										<History className="text-primary" />
										<h2 className="text-xl font-bold">تاریخچه</h2>
									</div>
									<button onClick={() => setHistory([])} className="p-2 text-danger"><Trash2 size={18} /></button>
								</div>
								<div className="p-4 h-[600px] overflow-y-auto">
									{history.length === 0 ? (
										<div className="text-center py-16 text-gray-500">
											<History size={48} className="mx-auto mb-4 opacity-50" />
											<p>تاریخچه‌ای وجود ندارد</p>
										</div>
									) : (
										<div className="space-y-3">
											{history.map(h => (
												<div key={h.id} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
													<div className="text-right">
														<div className="text-sm text-gray-600 dark:text-gray-400">{h.expr}</div>
														<div className="font-bold text-lg">= {h.result}</div>
													</div>
													<div className="flex justify-between items-center mt-2">
														<small className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString("fa-IR")}</small>
														<button onClick={() => handleDeleteHistory(h.id)} className="px-2 py-1 text-xs bg-danger text-white rounded-lg">حذف</button>
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
			</main>
		</>
	);
}
