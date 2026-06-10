/**
 * Reason: Defines Zod schemas for validating todo-related API inputs.
 * This ensures type safety and prevents invalid data from being processed
 * by the application's business logic.
 */
import { z } from "zod";

export const createTodoSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
});

export const updateTodoSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }).optional(),
	completed: z.boolean().optional(),
});
