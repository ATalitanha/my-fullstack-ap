import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/error";
import prisma from "@/shared/lib/prisma";

/**
 * 📌 API: دریافت تمام پیام‌ها
 * متد: GET
 * خروجی: لیست تمام پیام‌ها
 */
export async function GET() {
  try {
    const messages = await prisma.message.findMany();
    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    // در صورت خطا، پاسخ استاندارد با وضعیت 500 برگردانده می‌شود
    return errorResponse(err, "خطا در دریافت پیام‌ها");
  }
}

/**
 * 📌 API: ثبت پیام جدید
 * متد: POST
 * ورودی: بدنه‌ی درخواست به صورت JSON
 * خروجی: پیام ذخیره‌شده همراه با متن موفقیت
 */
export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const data = JSON.parse(bodyText);

    const createdMessage = await prisma.message.create({ data });

    return NextResponse.json(
      { message: "پیام ثبت شد", data: createdMessage },
      { status: 201 },
    );
  } catch (err) {
    // در صورت خطا، پاسخ استاندارد با وضعیت 500 برگردانده می‌شود
    return errorResponse(err, "خطا در ذخیره پیام");
  }
}

/**
 * 📌 API: حذف پیام‌ها
 * متد: DELETE
 * ورودی: JSON شامل یکی از موارد زیر:
 *   - { deleteAll: true } → حذف همه پیام‌ها
 *   - { id: number } → حذف پیام مشخص‌شده با id
 * خروجی: پیام موفقیت یا خطای مناسب
 */
export async function DELETE(req: Request) {
  try {
    const bodyText = await req.text();
    const data = JSON.parse(bodyText);

    if (data.deleteAll === true) {
      // ✅ حذف همه پیام‌ها
      await prisma.message.deleteMany();
    } else if (data.id) {
      // ✅ حذف پیام مشخص‌شده
      await prisma.message.delete({
        where: { id: data.id },
      });
    } else {
      // ❌ اگر پارامتر معتبر ارسال نشده باشد
      return NextResponse.json(
        { message: "پارامتر id یا deleteAll لازم است" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "عملیات حذف موفقیت‌آمیز بود" },
      { status: 201 },
    );
  } catch (err) {
    // در صورت خطا، پاسخ استاندارد با وضعیت 500 برگردانده می‌شود
    return errorResponse(err, "خطا در حذف پیام");
  }
}
