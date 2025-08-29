import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { encryptText, encryptEmail } from "@/utils/crypto";

/**
 * مسیر API برای ثبت‌نام کاربر جدید
 * متد: POST
 */
export async function POST(req: NextRequest) {
  // گرفتن داده‌ها از بادی درخواست
  const { username, email, password } = await req.json();

  // بررسی اینکه همه فیلدها پر شده باشند
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "تمامی فیلدها الزامی هستند" },
      { status: 400 }
    );
  }

  // هش کردن پسورد با bcrypt (سطح امنیتی: 10 salt rounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // رمزنگاری نام کاربری با IV تصادفی
    const encryptedUsername = encryptText(username);

    // رمزنگاری ایمیل با IV ثابت (برای جستجو و تطبیق قابل استفاده است)
    const encryptedEmail = encryptEmail(email);

    // ذخیره کاربر جدید در دیتابیس
    const user = await prisma.user.create({
      data: {
        username: encryptedUsername,
        email: encryptedEmail,
        password: hashedPassword,
      },
    });

    // بازگرداندن پاسخ موفق با id کاربر
    return NextResponse.json({ user: { id: user.id } });

  } catch (error) {
    /**
     * خطا معمولاً در صورتی رخ می‌دهد که:
     * - ایمیل یا نام کاربری تکراری باشد (unique constraint violation)
     * - مشکل ارتباط با دیتابیس
     */
    return NextResponse.json(
      { error: "کاربر از قبل وجود دارد یا خطای پایگاه داده" },
      { status: 400 }
    );
  }
}
