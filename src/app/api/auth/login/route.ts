import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decryptText, encryptEmail } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

/**
 * API برای لاگین کاربر
 * متد: POST
 * ورودی: { email: string, password: string }
 * خروجی: { accessToken: string } و کوکی refreshToken
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و پسورد الزامی هستند" },
        { status: 400 }
      );
    }

    // رمزنگاری ایمیل برای جستجو در دیتابیس
    const encryptedEmail = encryptEmail(email);

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: encryptedEmail },
    });

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

    // رمزگشایی نام کاربری برای توکن
    const decryptedUsername = decryptText(user.username);

    // تولید access token کوتاه‌مدت
    const accessToken = jwt.sign(
      { id: user.id, username: decryptedUsername },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // تولید refresh token بلندمدت
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // آماده‌سازی پاسخ
    const response = NextResponse.json({ accessToken }, { status: 200 });

    // ذخیره refresh token در کوکی HttpOnly
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60, // 7 روز
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;

  } catch (error) {
    console.error("خطا در POST /auth/login:", error);
    return NextResponse.json(
      { error: "خطای سرور یا پایگاه داده" },
      { status: 500 }
    );
  }
}
