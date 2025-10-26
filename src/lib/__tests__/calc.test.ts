import { describe, it, expect } from "vitest";
import { calcResult } from "../calc";

describe("calcResult", () => {
	it("should calculate simple expressions", () => {
		expect(calcResult("2+2")).toBe("4");
		expect(calcResult("5-3")).toBe("2");
		expect(calcResult("2*3")).toBe("6");
		expect(calcResult("10/2")).toBe("5");
	});

	it("should handle parentheses", () => {
		expect(calcResult("(2+2)*3")).toBe("12");
	});

	it("should handle square roots", () => {
		expect(calcResult("√9")).toBe("3");
		expect(calcResult("2*√16")).toBe("8");
	});

	it("should handle powers", () => {
		expect(calcResult("2^3")).toBe("8");
		expect(calcResult("3^2+1")).toBe("10");
	});

	it("should handle complex expressions", () => {
		expect(calcResult("(2+√9)^2")).toBe("25");
	});

	it("should sanitize the input and prevent invalid characters", () => {
		expect(calcResult('2+2; alert("hello")')).toBe("4");
	});

	it('should return "خطا" (Error) for invalid calculations like division by zero', () => {
		expect(calcResult("1/0")).toBe("خطا");
	});

	it('should return "خطا در محاسبه" (Error in calculation) for syntax errors', () => {
		expect(calcResult("2+")).toBe("خطا در محاسبه");
	});
});
