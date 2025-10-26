/**
 * Reason: Refactored to be a thin controller that uses the TodoService.
 * This approach separates the API layer from business logic, improving testability
 * and maintainability. It now validates input with Zod and delegates to the service.
 */
import { NextRequest, NextResponse } from "next/server";
import { TodoService } from "@/features/todo/server/todo.service";
import { createTodoSchema } from "@/features/todo/todo.schema";
import { getUserIdFromToken } from "@/shared/lib/auth";

export async function GET(req: NextRequest) {
	try {
		const userId = getUserIdFromToken(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const todoService = new TodoService();
		const todos = await todoService.getTodos(userId);
		return NextResponse.json({ todos });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const userId = getUserIdFromToken(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validation = createTodoSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.format() },
				{ status: 400 },
			);
		}

		const todoService = new TodoService();
		const todo = await todoService.createTodo(userId, validation.data);

		return NextResponse.json({ todo }, { status: 201 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
