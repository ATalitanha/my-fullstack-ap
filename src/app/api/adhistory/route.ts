import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { verifyJwt } from "@/shared/lib/jwt";

export async function GET(req: NextRequest) {
	const user = verifyJwt(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const history = await prisma.historyItem.findMany({
		orderBy: { createdAt: "desc" },
		take: 100,
	});
	return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
	const user = verifyJwt(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { expr, result } = await req.json();
	const newItem = await prisma.historyItem.create({
		data: { expr, result },
	});
	return NextResponse.json(newItem);
}

export async function DELETE(req: NextRequest) {
	const user = verifyJwt(req);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await req.json();
	await prisma.historyItem.delete({ where: { id } });
	return NextResponse.json({ success: true });
}
