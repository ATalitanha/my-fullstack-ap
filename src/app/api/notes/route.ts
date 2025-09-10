import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * گرفتن userId از توکن JWT
 * @param req - درخواست HTTP
 * @returns userId یا null اگر توکن نامعتبر باشد
 */
function getUserIdFromToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    return payload.id;
  } catch (error) {
    console.error("توکن نامعتبر:", error);
    return null;
  }
}

/**
 * API برای دریافت نوت‌های کاربر
 * متد: GET
 * هدر: Authorization: Bearer <token>
 */
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    // دریافت نوت‌ها به ترتیب جدیدترین
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    // دیکریپت عنوان و محتوا
    const decrypted = notes.map(n => ({
      ...n,
      title: decryptText(n.title),
      content: decryptText(n.content),
    }));

    return NextResponse.json({ notes: decrypted }, { status: 200 });

  } catch (error) {
    console.error("خطا در GET /note:", error);
    return NextResponse.json({ error: "توکن نامعتبر یا خطای سرور" }, { status: 401 });
  }
}

/**
 * API برای ایجاد نوت جدید
 * متد: POST
 * هدر: Authorization: Bearer <token>
 * ورودی: { title: string, content: string }
 */
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const { title, content } = await req.json();

    // اعتبارسنجی ورودی‌ها
    if (!title || !content) {
      return NextResponse.json(
        { error: "فیلدهای title و content الزامی هستند" },
        { status: 400 }
      );
    }

    // ایجاد نوت جدید
    const note = await prisma.note.create({
      data: {
        userId,
        title: encryptText(title),
        content: encryptText(content),
      },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({
      note: {
        ...note,
        title: decryptText(note.title),
        content: decryptText(note.content),
      },
    }, { status: 201 });

  } catch (error) {
    console.error("خطا در POST /note:", error);
    return NextResponse.json({ error: "توکن نامعتبر یا خطای سرور" }, { status: 401 });
  }
}
