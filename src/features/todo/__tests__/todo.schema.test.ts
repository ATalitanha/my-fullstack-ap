/** @vitest-environment node */
import { describe, it, expect } from "vitest";
import { createTodoSchema, updateTodoSchema } from "../todo.schema";

describe("Todo Schemas", () => {
	describe("createTodoSchema", () => {
		it("should validate a correct todo object", () => {
			const result = createTodoSchema.safeParse({
				title: "Test todo",
			});
			expect(result.success).toBe(true);
		});

		it("should invalidate an empty title", () => {
			const result = createTodoSchema.safeParse({
				title: "",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateTodoSchema", () => {
		it("should validate a correct update object", () => {
			const result = updateTodoSchema.safeParse({
				title: "Test todo",
				completed: true,
			});
			expect(result.success).toBe(true);
		});

		it("should allow partial updates", () => {
			const result = updateTodoSchema.safeParse({
				title: "Test todo",
			});
			expect(result.success).toBe(true);

			const result2 = updateTodoSchema.safeParse({
				completed: true,
			});
			expect(result2.success).toBe(true);
		});
	});
});
