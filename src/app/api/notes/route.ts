// src/app/api/note/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

// کلید JWT از محیط
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * API برای دریافت نوت‌های کاربر
 * متد: GET
 * نیازمند Access Token در هدر Authorization
 */
export async function GET(req: NextRequest) {
  // گرفتن توکن از هدر Authorization
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز" },
      { status: 401 }
    );
  }

  try {
    // اعتبارسنجی و دیکد JWT
    const payload: any = jwt.verify(token, JWT_SECRET);

    // دریافت نوت‌های کاربر از دیتابیس به ترتیب جدیدترین
    const notes = await prisma.note.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    // رمزگشایی عنوان و محتوا برای پاسخ
    const decrypted = notes.map(n => ({
      ...n,
      title: decryptText(n.title),
      content: decryptText(n.content),
    }));

    return NextResponse.json({ notes: decrypted });

  } catch (e) {
    return NextResponse.json(
      { error: "توکن نامعتبر" },
      { status: 401 }
    );
  }
}

/**
 * API برای ایجاد نوت جدید
 * متد: POST
 * نیازمند Access Token در هدر Authorization
 * ورودی: { title: string, content: string }
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "دسترسی غیرمجاز" },
      { status: 401 }
    );
  }

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const { title, content } = await req.json();

    // اعتبارسنجی ورودی‌ها
    if (!title || !content) {
      return NextResponse.json(
        { error: "فیلدهای title و content الزامی هستند" },
        { status: 400 }
      );
    }

    // ایجاد نوت جدید با رمزنگاری عنوان و محتوا
    const note = await prisma.note.create({
      data: {
        userId: payload.id,
        title: encryptText(title),
        content: encryptText(content),
      },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    // برای UX بهتر، پاسخ دیکریپت شده برگردانده می‌شود
    return NextResponse.json({
      note: {
        ...note,
        title: decryptText(note.title),
        content: decryptText(note.content),
      },
    });

  } catch (e) {
    return NextResponse.json(
      { error: "توکن نامعتبر" },
      { status: 401 }
    );
  }
}
