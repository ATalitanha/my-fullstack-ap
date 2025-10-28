import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

export async function GET() {
	try {
		const history = await prisma.historyItem.findMany({
			orderBy: { createdAt: "desc" },
			take: 100,
		});
		return NextResponse.json(history);
	} catch (error) {
		return NextResponse.json(
			{ error: "An error occurred while fetching history." },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { expr, result } = await req.json();
		const newItem = await prisma.historyItem.create({
			data: { expr, result },
		});
		return NextResponse.json(newItem, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "An error occurred while creating the history item." },
			{ status: 500 },
		);
	}
}

export async function DELETE() {
	try {
		await prisma.historyItem.deleteMany({});
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "An error occurred while deleting the history." },
			{ status: 500 },
		);
	}
}
