import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * گرفتن userId از توکن JWT
 * @param req - درخواست HTTP
 * @returns userId یا null اگر توکن معتبر نباشد
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
 * API برای بروزرسانی یک تودو
 * متد: PUT
 * ورودی: { title?: string, completed?: boolean }
 * پارامتر: id (از مسیر)
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

    const { title, completed } = await req.json();

    // بررسی اینکه داده‌ای برای بروزرسانی وجود دارد
    if (title === undefined && completed === undefined) {
      return NextResponse.json(
        { error: "هیچ فیلدی برای بروزرسانی ارسال نشده" },
        { status: 400 }
      );
    }

    // بروزرسانی تودو
    const updated = await prisma.todo.updateMany({
      where: { id, userId },
      data: {
        ...(title && { title: encryptText(title) }),
        ...(completed !== undefined && { completed }),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "تودو یافت نشد" }, { status: 404 });
    }

    // دریافت تودوی بروزرسانی شده
    const todo = await prisma.todo.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!todo) {
      return NextResponse.json({ error: "تودو یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      todo: {
        ...todo,
        title: decryptText(todo.title),
      },
    });
  } catch (error) {
    console.error("خطا در PUT /todo/[id]:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

/**
 * API برای حذف یک تودو
 * متد: DELETE
 * پارامتر: id (از مسیر)
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

    const deleted = await prisma.todo.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "تودو یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("خطا در DELETE /todo/[id]:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
