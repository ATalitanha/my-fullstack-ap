import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

/**
 * API برای دریافت تاریخچه‌ی محاسبات
 * متد: GET
 */
export async function GET() {
  try {
    // دریافت همه محاسبات از دیتابیس مرتب‌شده بر اساس تاریخ ایجاد (جدیدترین اول)
    const history = await prisma.calculation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    // ثبت لاگ خطا در سرور
    console.error("خطا در دریافت تاریخچه محاسبات:", error);

    return NextResponse.json(
      { error: "خطای داخلی سرور در دریافت تاریخچه محاسبات" },
      { status: 500 }
    );
  }
}

/**
 * API برای ثبت یک محاسبه جدید
 * متد: POST
 * ورودی: { expression: string, result: number }
 */
export async function POST(req: NextRequest) {
  try {
    // دریافت داده‌ها از درخواست
    const body = await req.json();
    const { expression, result } = body;

    // بررسی صحت ورودی‌ها
    if (!expression || result === undefined) {
      return NextResponse.json(
        { success: false, error: "فیلدهای expression و result الزامی هستند" },
        { status: 400 }
      );
    }

    // ذخیره محاسبه جدید در دیتابیس
    const created = await prisma.calculation.create({
      data: { expression, result },
    });

    return NextResponse.json(
      { success: true, data: created },
      { status: 201 }
    );
  } catch (error) {
    // ثبت لاگ خطا در سرور
    console.error("خطا در ایجاد محاسبه:", error);

    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور در ایجاد محاسبه" },
      { status: 500 }
    );
  }
}

/**
 * API برای حذف تمام تاریخچه محاسبات
 * متد: DELETE
 */
export async function DELETE() {
  try {
    // حذف همه رکوردهای محاسبات
    await prisma.calculation.deleteMany();

    return NextResponse.json(
      { success: true, message: "تمام محاسبات حذف شدند" },
      { status: 200 }
    );
  } catch (error) {
    // ثبت لاگ خطا در سرور
    console.error("خطا در حذف محاسبات:", error);

    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور در حذف محاسبات" },
      { status: 500 }
    );
  }
}
