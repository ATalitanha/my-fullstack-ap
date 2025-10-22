"use client";

interface CalculatorDisplayProps {
  first: string;
  op: string;
  second: string;
  result: string;
}

const CalculatorDisplay = ({ first, op, second, result }: CalculatorDisplayProps) => {
  return (
    <div className="col-span-4 text-right bg-gray-800 text-white p-4 rounded-t-2xl">
      <div className="text-2xl">{first} {op} {second}</div>
      <div className="text-4xl font-bold">{result}</div>
    </div>
  );
};

export default CalculatorDisplay;
