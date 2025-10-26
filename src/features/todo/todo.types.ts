/**
 * Reason: Defines TypeScript types for the todo feature.
 * By deriving types from Zod schemas, we ensure that the frontend and backend
 * types are always in sync, reducing the risk of runtime errors.
 */
import { z } from "zod";
import { createTodoSchema, updateTodoSchema } from "./todo.schema";

export type ICreateTodo = z.infer<typeof createTodoSchema>;
export type IUpdateTodo = z.infer<typeof updateTodoSchema>;

export interface ITodo {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}
