import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSwitcher from "../ThemeToggle";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

describe("ThemeSwitcher", () => {
	beforeEach(() => {
		document.documentElement.classList.remove("dark");
		localStorage.clear();
	});

	it("should render the sun icon by default", () => {
		render(<ThemeSwitcher />);
		expect(screen.getByTitle("تغییر تم")).toBeInTheDocument();
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("should switch to the moon icon when clicked", () => {
		render(<ThemeSwitcher />);
		fireEvent.click(screen.getByTitle("تغییر تم"));
		expect(screen.getByTitle("تغییر تم")).toBeInTheDocument();
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("should toggle the dark class on the html element", () => {
		render(<ThemeSwitcher />);
		expect(document.documentElement.classList.contains("dark")).toBe(false);
		fireEvent.click(screen.getByTitle("تغییر تم"));
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		fireEvent.click(screen.getByTitle("تغییر تم"));
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("should save the theme to local storage", () => {
		render(<ThemeSwitcher />);
		fireEvent.click(screen.getByTitle("تغییر تم"));
		expect(localStorage.getItem("theme")).toBe("dark");
		fireEvent.click(screen.getByTitle("تغییر تم"));
		expect(localStorage.getItem("theme")).toBe("light");
	});
});
