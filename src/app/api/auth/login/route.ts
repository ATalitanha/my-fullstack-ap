import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decryptText, encryptEmail } from "@/shared/lib/crypto";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export async function POST(req: NextRequest) {
  try {
    // بررسی متغیرهای محیطی
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      console.error("Missing JWT environment variables");
      return NextResponse.json(
        { error: "تنظیمات سرور ناقص است" },
        { status: 500 }
      );
    }

    // بررسی درخواست
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "فرمت درخواست نامعتبر است" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و پسورد الزامی هستند" },
        { status: 400 }
      );
    }

    // رمزنگاری ایمیل با بررسی خطا
    let encryptedEmail;
    try {
      encryptedEmail = encryptEmail(email);
      if (!encryptedEmail) {
        throw new Error("Failed to encrypt email");
      }
    } catch (encryptError) {
      console.error("Email encryption error:", encryptError);
      return NextResponse.json(
        { error: "خطا در پردازش ایمیل" },
        { status: 500 }
      );
    }

    // پیدا کردن کاربر
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: encryptedEmail },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "خطای پایگاه داده" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "اطلاعات ورود نادرست است" },
        { status: 401 }
      );
    }

    // بررسی صحت پسورد
    let isValid;
    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("Bcrypt error:", bcryptError);
      return NextResponse.json(
        { error: "خطا در بررسی رمز عبور" },
        { status: 500 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "اطلاعات ورود نادرست است" },
        { status: 401 }
      );
    }

    // رمزگشایی نام کاربری
    let decryptedUsername;
    try {
      decryptedUsername = decryptText(user.username);
      if (!decryptedUsername) {
        throw new Error("Failed to decrypt username");
      }
    } catch (decryptError) {
      console.error("Username decryption error:", decryptError);
      return NextResponse.json(
        { error: "خطا در پردازش اطلاعات کاربر" },
        { status: 500 }
      );
    }

    // تولید توکن‌ها
    try {
      const accessToken = jwt.sign(
        { id: user.id, username: decryptedUsername },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );

      const response = NextResponse.json(
        { 
          accessToken,
          user: {
            id: user.id,
            username: decryptedUsername,
            email: email // ایمیل اصلی
          }
        }, 
        { status: 200 }
      );

      response.cookies.set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60, // 7 روز
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return response;

    } catch (jwtError) {
      console.error("JWT error:", jwtError);
      return NextResponse.json(
        { error: "خطا در تولید توکن" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("خطای ناشناخته در POST /auth/login:", error);
    
    // لاگ کردن جزئیات بیشتر برای دیباگ
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}