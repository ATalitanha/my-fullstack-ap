import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { decryptText } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

/**
 * API برای صدور مجدد Access Token
 * متد: GET
 * ورودی: refreshToken از کوکی HttpOnly
 */
export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "رفرش توکن موجود نیست" },
        { status: 401 }
      );
    }

    // بررسی و دیکد refresh token
    const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // پیدا کردن کاربر در دیتابیس
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 401 }
      );
    }

    // رمزگشایی نام کاربری برای توکن جدید
    const decryptedUsername = decryptText(user.username);

    // تولید access token جدید
    const newAccessToken = jwt.sign(
      { id: user.id, username: decryptedUsername },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });

  } catch (error) {
    console.error("خطا در GET /auth/refresh:", error);
    return NextResponse.json(
      { error: "رفرش توکن نامعتبر یا خطای سرور" },
      { status: 401 }
    );
  }
}
