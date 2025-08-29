// src/app/api/note/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

// کلید JWT از محیط
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * تابع کمکی برای استخراج userId از JWT
 */
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

/**
 * API برای ویرایش نوت مشخص
 * متد: PUT
 * ورودی: { title: string, content: string }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { title, content } = await req.json();

  // اعتبارسنجی ورودی‌ها
  if (!title || !content) {
    return NextResponse.json({ error: "فیلدهای title و content الزامی هستند" }, { status: 400 });
  }

  // به‌روزرسانی نوت فقط برای کاربری که مالک است
  const updated = await prisma.note.updateMany({
    where: { id, userId },
    data: { title: encryptText(title), content: encryptText(content) },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  // دریافت نوت پس از به‌روزرسانی
  const note = await prisma.note.findUnique({
    where: { id },
    select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
  });

  if (!note) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  // بازگرداندن نوت دیکریپت شده برای UX بهتر
  return NextResponse.json({
    note: {
      ...note,
      title: decryptText(note.title),
      content: decryptText(note.content),
    },
  });
}

/**
 * API برای حذف نوت مشخص
 * متد: DELETE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  // حذف نوت فقط اگر مالک کاربر باشد
  const deleted = await prisma.note.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
