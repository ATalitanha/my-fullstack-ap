/** @vitest-environment node */
import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "../auth.schema";

describe("Auth Schemas", () => {
	describe("loginSchema", () => {
		it("should validate a correct login object", () => {
			const result = loginSchema.safeParse({
				email: "test@example.com",
				password: "password",
			});
			expect(result.success).toBe(true);
		});

		it("should invalidate an incorrect email", () => {
			const result = loginSchema.safeParse({
				email: "test",
				password: "password",
			});
			expect(result.success).toBe(false);
		});

		it("should invalidate a short password", () => {
			const result = loginSchema.safeParse({
				email: "test@example.com",
				password: "pass",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("signupSchema", () => {
		it("should validate a correct signup object", () => {
			const result = signupSchema.safeParse({
				username: "testuser",
				email: "test@example.com",
				password: "password",
			});
			expect(result.success).toBe(true);
		});

		it("should invalidate a short username", () => {
			const result = signupSchema.safeParse({
				username: "te",
				email: "test@example.com",
				password: "password",
			});
			expect(result.success).toBe(false);
		});
	});
});
