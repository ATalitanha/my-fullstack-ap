import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const todos = await prisma.todo.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, completed: true, createdAt: true, updatedAt: true },
    });

    const decrypted = todos.map(t => ({
      ...t,
      title: decryptText(t.title),
    }));

    return NextResponse.json({ todos: decrypted });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const { title } = await req.json();

    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const todo = await prisma.todo.create({
      data: { userId: payload.id, title: encryptText(title) },
      select: { id: true, title: true, completed: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({
      todo: {
        ...todo,
        title: decryptText(todo.title),
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
