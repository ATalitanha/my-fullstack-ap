import { renderHook } from "@testing-library/react";
import { useClientOnly } from "../useClientOnly";
import { act } from "react";

describe("useClientOnly", () => {
	it("should return false on initial render and true after mount", async () => {
		const { result } = renderHook(() => useClientOnly());

		// Initially, the hook should return false
		expect(result.current).toBe(false);

		// After the component mounts, useEffect should run and set the state to true
		act(() => {
			// Wait for the next tick of the event loop
		});

		expect(result.current).toBe(true);
	});
});
