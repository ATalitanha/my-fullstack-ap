import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * تابع کمکی برای استخراج userId از JWT
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
 * API برای ویرایش یک نوت مشخص
 * متد: PUT
 * ورودی: { title: string, content: string }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "فیلدهای title و content الزامی هستند" },
        { status: 400 }
      );
    }

    // بروزرسانی نوت فقط برای کاربر مالک
    const updated = await prisma.note.updateMany({
      where: { id, userId },
      data: { title: encryptText(title), content: encryptText(content) },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "نوت یافت نشد" }, { status: 404 });
    }

    // دریافت نوت پس از بروزرسانی
    const note = await prisma.note.findUnique({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    if (!note) {
      return NextResponse.json({ error: "نوت یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      note: {
        ...note,
        title: decryptText(note.title),
        content: decryptText(note.content),
      },
    }, { status: 200 });

  } catch (error) {
    console.error("خطا در PUT /note/[id]:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

/**
 * API برای حذف یک نوت مشخص
 * متد: DELETE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const deleted = await prisma.note.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "نوت یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("خطا در DELETE /note/[id]:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
