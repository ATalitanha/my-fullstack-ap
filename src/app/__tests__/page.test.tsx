import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import HomePage from "../page";

vi.mock("next/link", () => ({
	default: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Update the mock to include all icons used in the component
vi.mock("lucide-react", () => ({
	Search: () => <div data-testid="search-icon" />,
	Calculator: () => <div data-testid="calculator-icon" />,
	MessageSquare: () => <div data-testid="message-square-icon" />,
	ListTodo: () => <div data-testid="list-todo-icon" />,
	StickyNote: () => <div data-testid="sticky-note-icon" />,
	User: () => <div data-testid="user-icon" />,
	LogIn: () => <div data-testid="log-in-icon" />,
	BarChart: () => <div data-testid="bar-chart-icon" />,
	Sun: () => <div data-testid="sun-icon" />,
	Moon: () => <div data-testid="moon-icon" />,
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

describe("HomePage", () => {
	it("should render the component with the correct title", () => {
		render(<HomePage />);
		const headingElement = screen.getByRole("heading", {
			level: 1,
			name: /اپلیکیشن تنها/i,
		});
		expect(headingElement).toBeInTheDocument();
		expect(headingElement.textContent).toBe("اپلیکیشن تنها");
	});

	it("should filter links by search term", async () => {
		render(<HomePage />);
		const searchInput = screen.getByPlaceholderText("جستجوی ابزارها...");
		await act(async () => {
			fireEvent.change(searchInput, { target: { value: "ماشین حساب" } });
		});
		expect(screen.getByText("ماشین حساب")).toBeInTheDocument();
		// Ensure the correct character is used for "یادداشت‌ها"
		expect(screen.queryByText("یادداشت‌ها")).not.toBeInTheDocument();
	});
});
