import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "../page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

vi.mock("lucide-react", () => ({
	Sparkles: () => <div data-testid="sparkles-icon" />,
	User: () => <div data-testid="user-icon" />,
	LogOut: () => <div data-testid="logout-icon" />,
	Settings: () => <div data-testid="settings-icon" />,
	Activity: () => <div data-testid="activity-icon" />,
	ArrowLeft: () => <div data-testid="arrow-left-icon" />,
	Sun: () => <div data-testid="sun-icon" />,
	Moon: () => <div data-testid="moon-icon" />,
}));

vi.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...props }) => <div {...props}>{children}</div>,
		button: ({ children, ...props }) => <button {...props}>{children}</button>,
		a: ({ children, ...props }) => <a {...props}>{children}</a>,
		h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
	},
	AnimatePresence: ({ children }) => <>{children}</>,
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

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.atob = (str: string) => Buffer.from(str, "base64").toString("binary");

describe("DashboardPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render a loading state initially, then the user's data", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "testuser" }))}.`;
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ accessToken }),
		});

		render(<DashboardPage />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();

		const usernameElement = await screen.findByText("testuser");
		expect(usernameElement).toBeInTheDocument();

		expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
	});

	it("should redirect to the login page if not authenticated", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({}),
		});

		render(<DashboardPage />);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/login");
		});
	});

	it("should log the user out and redirect", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "testuser" }))}.`;
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ accessToken }),
		});
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		});

		render(<DashboardPage />);

		await screen.findByText("testuser");

		fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/login");
		});
	});
});
