import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalculatorHistory, HistoryItem } from "../useCalculatorHistory";
import { waitFor } from "@testing-library/react";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useCalculatorHistory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should fetch history and update the state", async () => {
		const mockHistory: HistoryItem[] = [
			{
				id: "1",
				expression: "2+2",
				result: "4",
				createdAt: new Date().toISOString(),
			},
		];
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(mockHistory),
		});

		const { result } = renderHook(() => useCalculatorHistory(0));

		await waitFor(() => {
			expect(result.current.history).toEqual(mockHistory.reverse());
		});

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("should handle fetch errors", async () => {
		mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

		const { result, rerender } = renderHook(
			({ trigger }) => useCalculatorHistory(trigger),
			{
				initialProps: { trigger: 0 },
			},
		);

		await act(async () => {
			rerender({ trigger: 1 });
		});

		expect(result.current.history).toEqual([]);
		expect(result.current.error).toBe("Failed to fetch history");
	});

	it("should save history", async () => {
		mockFetch.mockResolvedValueOnce({ ok: true });

		const { result } = renderHook(() => useCalculatorHistory(0));

		await act(async () => {
			await result.current.saveHistory("3+3", "6");
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/history", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ expression: "3+3", result: "6" }),
		});
	});

	it("should delete history", async () => {
		mockFetch.mockResolvedValueOnce({ ok: true });

		const { result } = renderHook(() => useCalculatorHistory(0));

		await act(async () => {
			await result.current.deleteServerHistory();
		});

		expect(mockFetch).toHaveBeenCalledWith("/api/history", {
			method: "DELETE",
		});
		expect(result.current.history).toEqual([]);
	});
});
