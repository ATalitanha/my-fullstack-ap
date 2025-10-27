import { renderHook, waitFor } from "@testing-library/react";
import { useClientOnly } from "../useClientOnly";

describe("useClientOnly", () => {
	it("should return false on initial render and true after mount", async () => {
		const { result } = renderHook(() => useClientOnly());

		// Initially, the hook should return false, as it's the server-side render
		expect(result.current).toBe(false);

		// After the component mounts (client-side), useEffect should run and set the state to true
		await waitFor(() => {
			expect(result.current).toBe(true);
		});
	});
});
