/**
 * Reason: Refactored to use the TodoService for update and delete operations.
 * This keeps the API controller clean and consistent with the main todo route,
 * delegating all business logic to the service layer.
 */
import { NextRequest, NextResponse } from "next/server";
import { TodoService } from "@/features/todo/server/todo.service";
import { updateTodoSchema } from "@/features/todo/todo.schema";
import { getUserIdFromToken } from "@/shared/lib/auth";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const userId = getUserIdFromToken(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validation = updateTodoSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.format() },
				{ status: 400 },
			);
		}

		const todoService = new TodoService();
		const todo = await todoService.updateTodo(id, userId, validation.data);

		if (!todo) {
			return NextResponse.json({ error: "Todo not found" }, { status: 404 });
		}

		return NextResponse.json({ todo });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const userId = getUserIdFromToken(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const todoService = new TodoService();
		const success = await todoService.deleteTodo(id, userId);

		if (!success) {
			return NextResponse.json({ error: "Todo not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
