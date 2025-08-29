import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API برای گرفتن تاریخچه‌ی محاسبات
 * متد: GET
 */
export async function GET() {
  try {
    // دریافت همه محاسبات از دیتابیس مرتب شده بر اساس تاریخ ایجاد (جدیدترین اول)
    const history = await prisma.calculation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history, { status: 200 });

  } catch (error) {
    console.error("خطا در دریافت تاریخچه محاسبات:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
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
    const body = await req.json();
    const { expression, result } = body;

    // اعتبارسنجی ورودی‌ها
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

    return NextResponse.json({ success: true, data: created });

  } catch (error) {
    console.error("خطا در ایجاد محاسبه:", error);
    return NextResponse.json(
      { success: false, error: "عدم توانایی در ایجاد محاسبه" },
      { status: 500 }
    );
  }
}

/**
 * API برای حذف تمام تاریخچه محاسبات
 * متد: DELETE
 */
export async function DELETE(req: NextRequest) {
  try {
    await prisma.calculation.deleteMany();

    return NextResponse.json({
      success: true,
      message: "تمام محاسبات حذف شدند",
    });

  } catch (error) {
    console.error("خطا در حذف محاسبات:", error);
    return NextResponse.json(
      { success: false, error: "عدم توانایی در حذف محاسبات" },
      { status: 500 }
    );
  }
}
