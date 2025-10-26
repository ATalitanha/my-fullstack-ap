import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LoginPage from "../page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

vi.mock("lucide-react", () => ({
	Sparkles: () => <div data-testid="sparkles-icon" />,
	LogIn: () => <div data-testid="login-icon" />,
	Mail: () => <div data-testid="mail-icon" />,
	Lock: () => <div data-testid="lock-icon" />,
	AlertCircle: () => <div data-testid="alert-icon" />,
	Eye: () => <div data-testid="eye-icon" />,
	EyeOff: () => <div data-testid="eye-off-icon" />,
	ArrowLeft: () => <div data-testid="arrow-left-icon" />,
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

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("LoginPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render the component", () => {
		render(<LoginPage />);
		expect(screen.getByText("Login to your account")).toBeInTheDocument();
	});

	it("should submit the form and redirect on successful login", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ token: "test-token" }),
		});

		render(<LoginPage />);

		await act(async () => {
			fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
				target: { value: "test@example.com" },
			});
			fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
				target: { value: "password" },
			});
			fireEvent.submit(screen.getByRole("button", { name: /Login/i }));
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ email: "test@example.com", password: "password" }),
			headers: { "Content-Type": "application/json" },
		});
		expect(mockPush).toHaveBeenCalledWith("/dashboard");
	});

	it("should display an error message on failed login", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({ error: "Invalid credentials" }),
		});

		render(<LoginPage />);

		await act(async () => {
			fireEvent.submit(screen.getByRole("button", { name: /Login/i }));
		});

		expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
	});
});
