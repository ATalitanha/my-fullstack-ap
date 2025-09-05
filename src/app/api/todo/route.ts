import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encryptText, decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * API برای دریافت لیست تودوهای کاربر
 * متد: GET
 * هدر: Authorization: Bearer <token>
 */
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 });
  }

  try {
    // بررسی صحت توکن JWT
    const payload: any = jwt.verify(token, JWT_SECRET);

    // دریافت تودوهای کاربر از دیتابیس
    const todos = await prisma.todo.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // رمزگشایی عنوان‌ها
    const decrypted = todos.map((t) => ({
      ...t,
      title: decryptText(t.title),
    }));

    return NextResponse.json({ todos: decrypted }, { status: 200 });

  } catch (error) {
    console.error("خطا در GET /todo:", error);
    return NextResponse.json({ error: "توکن نامعتبر یا خطای سرور" }, { status: 401 });
  }
}

/**
 * API برای ایجاد یک تودوی جدید
 * متد: POST
 * ورودی: { title: string }
 * هدر: Authorization: Bearer <token>
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 });
  }

  try {
    // بررسی صحت توکن JWT
    const payload: any = jwt.verify(token, JWT_SECRET);

    // گرفتن داده ورودی
    const { title } = await req.json();

    // اعتبارسنجی ورودی
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "فیلد title الزامی است" },
        { status: 400 }
      );
    }

    // ذخیره تودوی جدید با عنوان رمزگذاری‌شده
    const todo = await prisma.todo.create({
      data: {
        userId: payload.id,
        title: encryptText(title),
      },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // بازگردانی عنوان رمزگشایی‌شده
    return NextResponse.json(
      {
        todo: {
          ...todo,
          title: decryptText(todo.title),
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("خطا در POST /todo:", error);
    return NextResponse.json({ error: "توکن نامعتبر یا خطای سرور" }, { status: 401 });
  }
}
