import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const history = await prisma.historyItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
  const { expr, result } = await req.json();
  const newItem = await prisma.historyItem.create({
    data: { expr, result },
  });
  return NextResponse.json(newItem);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.historyItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
