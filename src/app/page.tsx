
"use client";

import { useEffect, useState, useCallback } from "react";
import CalculatorDisplay from "@/components/CalculatorDisplay";
import HistoryList from "@/components/HistoryList"
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { BUTTONS, OPERATIONS, Operation, OperatorBtn } from "@/constants";

export default function Calculator() {
  const [firstOperand, setFirstOperand] = useState("");
  const [secondOperand, setSecondOperand] = useState("");
  const [operation, setOperation] = useState<Operation | "">("");
  const [result, setResult] = useState("");

  const {
    history,
    loading,
    setHistory,
    saveHistory,
    deleteServerHistory,
  } = useCalculatorHistory(result);

  const resetCalc = () => {
    setFirstOperand("");
    setSecondOperand("");
    setOperation("");
    setResult("");
  };

  const handleInput = (value: string) => {
    if (OPERATIONS.includes(value as Operation)) return;

    if (!operation && firstOperand.length < 8 && (value !== "." || !firstOperand.includes("."))) {
      setFirstOperand(prev => prev + value);
    } else if (!result && secondOperand.length < 8 && (value !== "." || !secondOperand.includes("."))) {
      setSecondOperand(prev => prev + value);
    }
  };

  const handleOperation = (op: string) => {
    if (!firstOperand) return;

    if (op === "√") {
      setOperation("√");
      setSecondOperand("0");
    } else if (OPERATIONS.includes(op as Operation)) {
      setOperation(op as Operation);
    }
  };

  const handleBtnClick = (text: OperatorBtn) => {
    if (text === "CA") resetCalc();
    else if (text === "C") {
      if (result) return;
      if (secondOperand) setSecondOperand("");
      else setFirstOperand("");
    }
    else if (text === "DEL") {
      if (result) return;
      if (secondOperand) setSecondOperand(prev => prev.slice(0, -1));
      else if (operation) setOperation("");
      else if (firstOperand) setFirstOperand(prev => prev.slice(0, -1));
    }
    else if (text === "+/-") {
      if (result) return;
      if (secondOperand) setSecondOperand(`${parseFloat(secondOperand) * -1}`);
      else if (firstOperand) setFirstOperand(`${parseFloat(firstOperand) * -1}`);
    }
    else if (text === "=") calcResult();
    else if (OPERATIONS.includes(text as Operation)) handleOperation(text as Operation);
    else handleInput(text);
  };

  const calcResult = () => {
    try {
      const a = parseFloat(firstOperand);
      const b = parseFloat(secondOperand);
      let r: number | undefined;

      switch (operation) {
        case "+": r = a + b; break;
        case "-": r = a - b; break;
        case "*": r = a * b; break;
        case "/": r = b !== 0 ? a / b : NaN; break;
        case "^": r = Math.pow(a, b); break;
        case "√": r = a >= 0 ? Math.sqrt(a) : NaN; break;
      }

      const expression = `${firstOperand} ${operation} ${operation === "√" ? "" : secondOperand}`;
      const finalResult = (r !== undefined && !Number.isNaN(r)) ? `=${r}` : "=Error";

      setResult(finalResult);

      if (!Number.isNaN(r) && operation) saveHistory(expression, finalResult);
    } catch {
      setResult("=Error");
    }
  };

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    deleteServerHistory();
  }, [setHistory, deleteServerHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (/^[0-9.]$/.test(key)) handleInput(key);
      else if (OPERATIONS.includes(key as Operation)) handleOperation(key);
      else if (key === "Enter") calcResult();
      else if (key === "Backspace") handleBtnClick("DEL");
      else if (key.toLowerCase() === "c") handleBtnClick("C");
      else if (key.toLowerCase() === "q") handleBtnClick("CA");
      else if (key.toLowerCase() === "p") handleClearHistory();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClearHistory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 grid-rows-6 gap-1">
        <CalculatorDisplay first={firstOperand} op={operation} second={secondOperand} result={result} />

        {BUTTONS.map(text => (
          <button
            key={text}
            onClick={() => handleBtnClick(text)}
            className={`p-4 border rounded-md ${text === "=" ? "text-green-500" : ""}`}
          >
            {text}
          </button>
        ))}
      </div>

      <HistoryList history={history} loading={loading} onClear={handleClearHistory} />
    </div>
  );
}
