import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import HomePage from "../page";

vi.mock("next/link", () => ({
	default: ({ children, href }) => <a href={href}>{children}</a>,
}));

vi.mock("lucide-react", () => ({
	Search: () => <div data-testid="search-icon" />,
	Sparkles: () => <div data-testid="sparkles-icon" />,
	Zap: () => <div data-testid="zap-icon" />,
	TrendingUp: () => <div data-testid="trending-up-icon" />,
	Sun: () => <div data-testid="sun-icon" />,
	Moon: () => <div data-testid="moon-icon" />,
}));

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

vi.mock("@/components/change-log", () => ({
	ChangeLog: ({ isOpen, onClose }) =>
		isOpen ? (
			<div data-testid="changelog-modal">
				<button onClick={onClose}>Close</button>
			</div>
		) : null,
}));

describe("HomePage", () => {
	it("should render the component", () => {
		render(<HomePage />);
		const headingElement = screen.getByRole("heading", {
			level: 1,
			name: /welcome to TanhaApp/i,
		});
		expect(headingElement).toBeInTheDocument();
		expect(headingElement.textContent).toContain("Welcome to TanhaApp");
	});

	it("should filter links by search term", async () => {
		render(<HomePage />);
		const searchInput = screen.getByPlaceholderText("Search for tools...");
		await act(async () => {
			fireEvent.change(searchInput, { target: { value: "Calculator" } });
		});
		expect(screen.getByText("Calculator")).toBeInTheDocument();
		await vi.waitFor(() => {
			expect(screen.queryByText("Text Transfer")).not.toBeInTheDocument();
		});
	});

	it("should filter links by category", async () => {
		render(<HomePage />);
		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "Communication" }));
		});
		expect(screen.getByText("Text Transfer")).toBeInTheDocument();
		await vi.waitFor(() => {
			expect(screen.queryByText("Calculator")).not.toBeInTheDocument();
		});
	});

	it("should open and close the changelog modal", async () => {
		render(<HomePage />);
		fireEvent.click(screen.getByText("Changelog"));

		const modal = await screen.findByTestId("changelog-modal");
		expect(modal).toBeInTheDocument();

		fireEvent.click(screen.getByText("Close"));
		await vi.waitFor(() => {
			expect(screen.queryByTestId("changelog-modal")).not.toBeInTheDocument();
		});
	});
});
