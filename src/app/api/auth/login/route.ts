import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decryptText, encryptEmail } from "@/utils/crypto";

// متغیرهای مربوط به JWT از محیط (env)
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m"; // مدت اعتبار توکن دسترسی
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d"; // مدت اعتبار توکن رفرش

/**
 * API برای لاگین کاربر
 * متد: POST
 */
export async function POST(req: NextRequest) {
  // گرفتن ایمیل و پسورد از بدنه درخواست
  const { email, password } = await req.json();

  // رمزنگاری ایمیل (deterministic) برای مقایسه با دیتابیس
  const encryptedEmail = encryptEmail(email);

  // جستجوی کاربر با ایمیل رمزنگاری‌شده
  const user = await prisma.user.findUnique({
    where: { email: encryptedEmail },
  });

  // اگر کاربری پیدا نشد → خطای اعتبارسنجی
  if (!user) {
    return NextResponse.json(
      { error: "اطلاعات ورود نادرست است" },
      { status: 401 }
    );
  }

  // بررسی صحت پسورد
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "اطلاعات ورود نادرست است" },
      { status: 401 }
    );
  }

  // رمزگشایی نام کاربری برای قراردادن در توکن
  const decryptedUsername = decryptText(user.username);

  // تولید access token (کوتاه‌مدت)
  const accessToken = jwt.sign(
    { id: user.id, username: decryptedUsername },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  // تولید refresh token (بلندمدت)
  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // ایجاد پاسخ همراه با accessToken
  const response = NextResponse.json({ accessToken });

  // ذخیره refreshToken در کوکی HttpOnly (غیرقابل دسترسی از جاوااسکریپت)
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refresh", // مسیر معتبرسازی/تمدید توکن
    maxAge: 7 * 24 * 60 * 60,  // معادل 7 روز
  });

  return response;
}
