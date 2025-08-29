import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { decryptText } from "@/utils/crypto";

// متغیرهای JWT از env
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

/**
 * API برای صدور دوباره Access Token
 * متد: GET
 */
export async function GET(req: NextRequest) {
  // گرفتن refreshToken از کوکی
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // اگر کوکی وجود نداشت → خطای Unauthorized
  if (!refreshToken) {
    return NextResponse.json(
      { error: "رفرش توکن موجود نیست" },
      { status: 401 }
    );
  }

  try {
    // بررسی و دیکد کردن refresh token
    const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // پیدا کردن کاربر بر اساس id ذخیره‌شده در payload
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true },
    });

    // اگر کاربر وجود نداشت → خطای Unauthorized
    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 401 }
      );
    }

    // رمزگشایی نام کاربری برای قرار گرفتن در توکن جدید
    const decryptedUsername = decryptText(user.username);

    // تولید access token جدید
    const newAccessToken = jwt.sign(
      { id: user.id, username: decryptedUsername },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // ارسال access token جدید به کلاینت
    return NextResponse.json({ accessToken: newAccessToken });

  } catch {
    // خطا در صورتی که:
    // - refresh token نامعتبر یا منقضی باشد
    return NextResponse.json(
      { error: "رفرش توکن نامعتبر است" },
      { status: 401 }
    );
  }
}
