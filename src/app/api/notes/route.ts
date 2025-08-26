import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// گرفتن یادداشت‌های کاربر
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const notes = await prisma.note.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notes });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// ساخت یادداشت جدید
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const { title, content } = await req.json();

    if (!title || !content)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const note = await prisma.note.create({
      data: { title, content, userId: payload.id },
    });

    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
