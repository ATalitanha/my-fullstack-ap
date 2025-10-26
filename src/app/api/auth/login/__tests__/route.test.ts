/** @vitest-environment node */
import { describe, it, expect, vi } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import { AuthService } from "@/features/auth/server/auth.service";
import { loginSchema } from "@/features/auth/auth.schema";

vi.mock("@/features/auth/server/auth.service");
vi.mock("@/features/auth/auth.schema");

describe("Login API", () => {
	it("should log in a user and return an access token", async () => {
		const mockTokens = {
			accessToken: "test-access-token",
			refreshToken: "test-refresh-token",
		};
		(loginSchema.safeParse as vi.Mock).mockReturnValue({
			success: true,
			data: { username: "test", password: "password" },
		});
		(AuthService.prototype.login as vi.Mock).mockResolvedValue(mockTokens);

		const req = new NextRequest("http://localhost", {
			method: "POST",
			body: JSON.stringify({ username: "test", password: "password" }),
		});

		const response = await POST(req);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.accessToken).toBe(mockTokens.accessToken);
		expect(response.cookies.get("refreshToken")?.value).toBe(
			mockTokens.refreshToken,
		);
	});

	it("should handle invalid input", async () => {
		(loginSchema.safeParse as vi.Mock).mockReturnValue({
			success: false,
			error: { format: () => "Invalid input" },
		});

		const req = new NextRequest("http://localhost", {
			method: "POST",
			body: JSON.stringify({ username: "test" }),
		});

		const response = await POST(req);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.error).toBe("Invalid input");
	});

	it("should handle errors during login", async () => {
		(loginSchema.safeParse as vi.Mock).mockReturnValue({
			success: true,
			data: { username: "test", password: "password" },
		});
		(AuthService.prototype.login as vi.Mock).mockRejectedValue(
			new Error("Test error"),
		);

		const req = new NextRequest("http://localhost", {
			method: "POST",
			body: JSON.stringify({ username: "test", password: "password" }),
		});

		const response = await POST(req);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data.error).toBe("Test error");
	});
});
