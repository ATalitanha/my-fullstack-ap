import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CalculatorDisplay from "../CalculatorDisplay";

describe("CalculatorDisplay", () => {
	it("should render the initial display", () => {
		render(<CalculatorDisplay first="" op="" second="" result="" />);
		const display = screen.getByTitle("=");
		expect(display).toBeInTheDocument();
	});

	it("should render the first number", () => {
		render(<CalculatorDisplay first="123" op="" second="" result="" />);
		expect(screen.getByText("123")).toBeInTheDocument();
	});

	it("should render the first number and operator", () => {
		render(<CalculatorDisplay first="123" op="+" second="" result="" />);
		expect(screen.getByText("123")).toBeInTheDocument();
		expect(screen.getByText("+")).toBeInTheDocument();
	});

	it("should render the full expression", () => {
		render(<CalculatorDisplay first="123" op="+" second="456" result="" />);
		expect(screen.getByText("123")).toBeInTheDocument();
		expect(screen.getByText("+")).toBeInTheDocument();
		expect(screen.getByText("456")).toBeInTheDocument();
	});

	it("should render the square root expression", () => {
		render(<CalculatorDisplay first="9" op="√" second="" result="" />);
		expect(screen.getByText("9")).toBeInTheDocument();
		expect(screen.getByText("√")).toBeInTheDocument();
		expect(screen.queryByText(" ")).not.toBeInTheDocument();
	});

	it("should render the result", () => {
		render(<CalculatorDisplay first="123" op="+" second="456" result="579" />);
		expect(screen.getByText("= 579")).toBeInTheDocument();
	});
});
