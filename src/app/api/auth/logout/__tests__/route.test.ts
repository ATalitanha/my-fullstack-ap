/** @vitest-environment node */
import { describe, it, expect } from "vitest";
import { POST } from "../route";

describe("Logout API", () => {
	it("should clear the refreshToken cookie", async () => {
		const response = await POST();
		const cookie = response.cookies.get("refreshToken");

		expect(response.status).toBe(200);
		expect(cookie?.value).toBe("");
		expect(cookie?.maxAge).toBe(0);
	});
});
