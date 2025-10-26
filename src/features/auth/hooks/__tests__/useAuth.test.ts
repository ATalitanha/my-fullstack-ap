import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock atob
global.atob = (str: string) => Buffer.from(str, "base64").toString("binary");

describe("useAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should be in a loading state initially and then resolve", async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			json: () => Promise.resolve({}),
		});
		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});
		expect(result.current.isLoading).toBe(false);
	});

	it("should fetch the access token on mount", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "test" }))}.`;
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ accessToken }),
		});

		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});

		expect(result.current.token).toBe(accessToken);
		expect(result.current.user).toEqual({ id: "1", username: "test" });
	});

	it("should login and update the state", async () => {
		const accessToken = `.${btoa(JSON.stringify({ id: "1", username: "test" }))}.`;
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ accessToken }),
			});

		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});

		await act(async () => {
			await result.current.login({
				email: "test@example.com",
				password: "password",
			});
		});

		expect(result.current.token).toBe(accessToken);
		expect(mockPush).toHaveBeenCalledWith("/dashboard");
	});

	it("should handle a failed login", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			})
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({ error: "Invalid credentials" }),
			});

		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});

		await act(async () => {
			await result.current.login({
				email: "test@example.com",
				password: "password",
			});
		});

		expect(result.current.error).toBe("Invalid credentials");
	});

	it("should signup and redirect", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({}),
			});

		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});

		await act(async () => {
			await result.current.signup({
				username: "test",
				email: "test@example.com",
				password: "password",
			});
		});

		expect(mockPush).toHaveBeenCalledWith("/login");
	});

	it("should handle a failed signup", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			})
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({ error: "User already exists" }),
			});

		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});

		await act(async () => {
			await result.current.signup({
				username: "test",
				email: "test@example.com",
				password: "password",
			});
		});

		expect(result.current.error).toBe("User already exists");
	});

	it("should logout and clear the state", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({}),
			});

		let result;
		await act(async () => {
			result = renderHook(() => useAuth()).result;
		});

		await act(async () => {
			await result.current.logout();
		});

		expect(result.current.token).toBe(null);
		expect(result.current.user).toBe(null);
		expect(mockPush).toHaveBeenCalledWith("/login");
	});
});
