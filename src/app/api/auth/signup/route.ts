/**
 * Reason: Refactored to use the AuthService for user creation.
 * This keeps the controller lean and focused on handling HTTP requests and responses,
 * while the service layer manages the business logic of user registration.
 */
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/features/auth/server/auth.service";
import { signupSchema } from "@/features/auth/auth.schema";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validation = signupSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.format() },
				{ status: 400 },
			);
		}

		const authService = new AuthService();
		const user = await authService.signup(validation.data);

		return NextResponse.json({ user: { id: user.id } }, { status: 201 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		if (message.includes("already exists")) {
			return NextResponse.json({ error: message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
