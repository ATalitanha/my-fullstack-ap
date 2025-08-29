import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * API برای گرفتن تمام پیام‌ها
 * متد: GET
 */
export async function GET() {
  try {
    const messages = await prisma.message.findMany();
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("خطا در دریافت پیام‌ها:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}

/**
 * API برای ثبت یک پیام جدید
 * متد: POST
 * ورودی: JSON پیام
 */
export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const data = JSON.parse(bodyText);

    const createdMessage = await prisma.message.create({
      data,
    });

    return NextResponse.json(
      { message: "پیام ثبت شد", data: createdMessage },
      { status: 201 }
    );

  } catch (error) {
    console.error("خطا در ذخیره پیام:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}

/**
 * API برای حذف پیام‌ها
 * متد: DELETE
 * ورودی: JSON شامل id پیام یا deleteAll
 */
export async function DELETE(req: Request) {
  try {
    const bodyText = await req.text();
    const data = JSON.parse(bodyText);

    if (data.deleteAll === true) {
      // حذف همه پیام‌ها
      await prisma.message.deleteMany();
    } else if (data.id) {
      // حذف پیام مشخص شده
      await prisma.message.delete({
        where: { id: data.id },
      });
    } else {
      return NextResponse.json(
        { message: "پارامتر id یا deleteAll لازم است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "عملیات حذف موفقیت‌آمیز بود" },
      { status: 201 }
    );

  } catch (error) {
    console.error("خطا در حذف پیام:", error);
    return NextResponse.json(
      { message: "خطا در حذف پیام" },
      { status: 500 }
    );
  }
}
