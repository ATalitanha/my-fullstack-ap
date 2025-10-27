"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { evaluate } from "mathjs";
import Header from "@/components/ui/header";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function CalculatorPage() {
	const [expression, setExpression] = useState("");
	const expressionRef = useRef(expression);
	const [result, setResult] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);
	const [parenError, setParenError] = useState(false);
	const [evalError, setEvalError] = useState<string | null>(null);

	const { history, loading, setHistory, saveHistory, deleteServerHistory } =
		useCalculatorHistory(result);

	useEffect(() => {
		expressionRef.current = expression;
	}, [expression]);

	const resetCalc = useCallback(() => {
		setExpression("");
		expressionRef.current = "";
		setResult("");
		setParenError(false);
		setEvalError(null);
	}, []);

	const handleInput = useCallback(
		(value: string) => {
			if (parenError) setParenError(false);
			if (evalError) setEvalError(null);

			if (result && !OPERATIONS.includes(value as Operation)) {
				resetCalc();
				setExpression(value);
				return;
			}

			if (value === ".") {
				const lastNumberMatch = expressionRef.current.match(/(\d+\.?\d*)$/);
				if (lastNumberMatch && lastNumberMatch[0].includes(".")) return;
			}

			if (value === "(") {
				const lastChar = expressionRef.current.slice(-1);
				if (
					expressionRef.current === "" ||
					OPERATIONS.includes(lastChar as Operation) ||
					lastChar === "("
				) {
					setExpression((prev) => prev + "(");
				} else if (/\d/.test(lastChar)) {
					setExpression((prev) => prev + "*" + "(");
				}
				return;
			}

			if (value === ")") {
				const openParens = (expressionRef.current.match(/\(/g) || []).length;
				const closeParens = (expressionRef.current.match(/\)/g) || []).length;
				const lastChar = expressionRef.current.slice(-1);

				if (
					openParens > closeParens &&
					(/\d/.test(lastChar) || lastChar === ")")
				) {
					setExpression((prev) => prev + ")");
				}
				return;
			}

			if (expressionRef.current.length >= 15) return;
			setExpression((prev) => prev + value);
		},
		[parenError, evalError, result, resetCalc],
	);

	const handleOperation = useCallback(
		(op: string) => {
			if (parenError) setParenError(false);
			if (evalError) setEvalError(null);

			if (!expressionRef.current && !result) return;

			if (result) {
				setExpression(result + op);
				expressionRef.current = result + op;
				setResult("");
				return;
			}

			const lastChar = expressionRef.current.slice(-1);

			if (OPERATIONS.includes(lastChar as Operation)) {
				setExpression((prev) => prev.slice(0, -1) + op);
				expressionRef.current = expressionRef.current.slice(0, -1) + op;
				return;
			}

			setExpression((prev) => prev + op);
			expressionRef.current = expressionRef.current + op;
		},
		[parenError, evalError, result],
	);

	const calcResult = useCallback(() => {
		if (expressionRef.current.trim() === "") {
			setEvalError("خطا در محاسبه");
			setParenError(false);
			return;
		}

		const openParensCount = (expressionRef.current.match(/\(/g) || []).length;
		const closeParensCount = (expressionRef.current.match(/\)/g) || []).length;

		if (openParensCount !== closeParensCount) {
			setParenError(true);
			setEvalError(null);
			return;
		}

		setParenError(false);

		try {
			const r = evaluate(expressionRef.current);
			if (r === undefined || Number.isNaN(r)) throw new Error();

			if (/^\s*-?\d+(\.\d+)?\s*$/.test(expressionRef.current)) {
				setEvalError("عبارت وارد شده کامل نیست.");
				return;
			}

			const finalResult = r.toString();
			setResult(finalResult);
			saveHistory(expressionRef.current, finalResult);
			setEvalError(null);
		} catch {
			setEvalError("عبارت وارد شده کامل نیست.");
		}
	}, [saveHistory]);

	const handleBtnClick = useCallback(
		(text: OperatorBtn) => {
			if (text === "CA") resetCalc();
			else if (text === "C" || text === "DEL") {
				if (result) return;
				setExpression((prev) => {
					const newExpr = prev.slice(0, -1);
					expressionRef.current = newExpr;
					return newExpr;
				});
			} else if (text === "+/-") {
				const match = expressionRef.current.match(/(-?\d+\.?\d*)$/);
				if (match) {
					const number = match[0];
					const inverted = number.startsWith("-")
						? number.slice(1)
						: "-" + number;
					setExpression((prev) => {
						const newExpr =
							prev.slice(0, prev.length - number.length) + inverted;
						expressionRef.current = newExpr;
						return newExpr;
					});
				}
			} else if (text === "=") calcResult();
			else if (text === "(" || text === ")") handleInput(text);
			else if (OPERATIONS.includes(text as Operation)) handleOperation(text);
			else handleInput(text);
		},
		[calcResult, handleInput, handleOperation, resetCalc, result],
	);

	const handleClearHistory = useCallback(() => {
		setHistory([]);
		deleteServerHistory();
	}, [setHistory, deleteServerHistory]);

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto max-w-2xl">
					<div className="text-center mb-8">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">ماشین حساب</h1>
						<p className="text-gray-600 dark:text-gray-400 text-lg">
							محاسبات سریع و دقیق با قابلیت ذخیره تاریخچه ✨
						</p>
					</div>

					<div className="text-center mb-2 min-h-[2rem]">
						{(parenError || evalError) && (
							<div className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
								<AlertTriangle className="text-red-500" size={20} />
								<span className="text-red-700 dark:text-red-300 font-semibold">
									{parenError ? "عبارت وارد شده کامل نیست." : evalError}
								</span>
							</div>
						)}
					</div>

					<div className="grid grid-cols-4 grid-rows-6 gap-3 p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-lg">
						<CalculatorDisplay
							first={expression}
							op={""}
							second={""}
							result={result}
						/>
						{BUTTONS.map((text) => (
							<button
								key={text}
								onClick={() => handleBtnClick(text)}
								className={`p-4 rounded-2xl font-bold text-lg transition-colors ${
									text === "="
										? "bg-success text-white"
										: OPERATIONS.includes(text as Operation)
											? "bg-primary text-white"
											: ["CA", "C", "DEL"].includes(text)
												? "bg-danger text-white"
												: "bg-gray-200 dark:bg-gray-700"
								}`}
							>
								{text}
							</button>
						))}
					</div>

					<div className="p-6 mt-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg">
						<HistoryList
							history={history}
							loading={loading}
							onClear={() => setShowConfirm(true)}
						/>
					</div>
				</div>
			</main>

			{showConfirm && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
						<div className="text-center mb-6">
							<div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-3">
								<Trash2 className="text-danger" size={24} />
							</div>
							<h3 className="text-lg font-bold mb-2">پاک کردن تاریخچه</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								آیا مطمئن هستید که می‌خواهید تمام تاریخچه محاسبات پاک شود؟
							</p>
						</div>
						<div className="flex justify-center gap-3">
							<button onClick={() => setShowConfirm(false)} className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 font-semibold flex-1">
								لغو
							</button>
							<button onClick={() => { handleClearHistory(); setShowConfirm(false); }} className="px-6 py-2 rounded-xl bg-danger text-white font-semibold flex-1">
								پاک کردن
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
