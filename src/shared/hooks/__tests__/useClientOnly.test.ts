import { renderHook } from "@testing-library/react";
import { useClientOnly } from "../useClientOnly";

describe("useClientOnly", () => {
	it("should return true on the client", () => {
		const { result } = renderHook(() => useClientOnly());
		expect(result.current).toBe(true);
	});
});
