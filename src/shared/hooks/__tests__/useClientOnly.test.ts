import { renderHook, waitFor } from "@testing-library/react";
import { useClientOnly } from "../useClientOnly";

describe("useClientOnly", () => {
	it("should return false on initial render and true after mount", async () => {
		const { result } = renderHook(() => useClientOnly());

		expect(result.current).toBe(false);

		await waitFor(() => {
			expect(result.current).toBe(true);
		});
	});
});
