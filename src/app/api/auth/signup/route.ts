import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { encryptText, encryptEmail } from "@/utils/crypto";

/**
 * API برای ثبت‌نام کاربر جدید
 * متد: POST
 * ورودی: { username: string, email: string, password: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // بررسی اینکه همه فیلدها پر شده باشند
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "تمامی فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    // هش کردن پسورد با bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // رمزنگاری نام کاربری با IV تصادفی
    const encryptedUsername = encryptText(username);

    // رمزنگاری ایمیل با IV ثابت برای جستجو و تطبیق
    const encryptedEmail = encryptEmail(email);

    // ذخیره کاربر جدید در دیتابیس
    const user = await prisma.user.create({
      data: {
        username: encryptedUsername,
        email: encryptedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { user: { id: user.id } },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("خطا در ثبت‌نام:", error);

    // بررسی خطاهای معمول (مثل تکراری بودن ایمیل)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "ایمیل یا نام کاربری قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "خطای سرور یا پایگاه داده" },
      { status: 500 }
    );
  }
}
