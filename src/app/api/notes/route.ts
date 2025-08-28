// src/app/api/note/route.ts
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
    const notes = await prisma.note.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    const decrypted = notes.map(n => ({
      ...n,
      title: decryptText(n.title),
      content: decryptText(n.content),
    }));

    return NextResponse.json({ notes: decrypted });
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const { title, content } = await req.json();

    if (!title || !content)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const note = await prisma.note.create({
      data: {
        userId: payload.id,
        title: encryptText(title),
        content: encryptText(content),
      },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    // برای پاسخ UX، دیکریپت برمی‌گردونیم
    return NextResponse.json({
      note: {
        ...note,
        title: decryptText(note.title),
        content: decryptText(note.content),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
