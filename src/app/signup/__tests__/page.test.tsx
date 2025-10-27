import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SignupPage from "../page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

vi.mock("lucide-react", () => ({
	Sparkles: () => <div data-testid="sparkles-icon" />,
	UserPlus: () => <div data-testid="user-plus-icon" />,
	Mail: () => <div data-testid="mail-icon" />,
	Lock: () => <div data-testid="lock-icon" />,
	User: () => <div data-testid="user-icon" />,
	AlertCircle: () => <div data-testid="alert-icon" />,
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
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("SignupPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render the component", () => {
		render(<SignupPage />);
		expect(screen.getByText("ایجاد حساب کاربری جدید")).toBeInTheDocument();
	});

	it("should submit the form and redirect on successful signup", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		});

		render(<SignupPage />);

		await act(async () => {
			fireEvent.change(
				screen.getByPlaceholderText("نام کاربری خود را وارد کنید"),
				{
					target: { value: "testuser" },
				},
			);
			fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
				target: { value: "test@example.com" },
			});
			fireEvent.change(
				screen.getByPlaceholderText("یک رمز عبور قوی انتخاب کنید"),
				{
					target: { value: "password" },
				},
			);
			fireEvent.submit(screen.getByRole("button", { name: /ایجاد حساب/i }));
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", {
			method: "POST",
			body: JSON.stringify({
				username: "testuser",
				email: "test@example.com",
				password: "password",
			}),
			headers: { "Content-Type": "application/json" },
		});
		expect(mockPush).toHaveBeenCalledWith("/login");
	});

	it("should display an error message on failed signup", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({ message: "User already exists" }),
		});

		render(<SignupPage />);

		await act(async () => {
			fireEvent.submit(screen.getByRole("button", { name: /ایجاد حساب/i }));
		});

		expect(screen.getByText("User already exists")).toBeInTheDocument();
	});
});
