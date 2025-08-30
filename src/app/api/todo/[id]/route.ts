import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

function getUserIdFromToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    return payload.id;
  } catch {
    return null;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, completed } = await req.json();
  if (title === undefined && completed === undefined)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const updated = await prisma.todo.updateMany({
    where: { id, userId },
    data: {
      ...(title && { title: encryptText(title) }),
      ...(completed !== undefined && { completed }),
    },
  });

  if (updated.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const todo = await prisma.todo.findUnique({
    where: { id },
    select: { id: true, title: true, completed: true, createdAt: true, updatedAt: true },
  });

  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    todo: {
      ...todo,
      title: decryptText(todo.title),
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deleted = await prisma.todo.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
