import { NextResponse } from "next/server";

/**
 * API برای خروج کاربر
 * متد: POST
 * عملکرد: پاک کردن کوکی refreshToken
 */
export async function POST() {
  try {
    // ایجاد پاسخ موفق
    const response = NextResponse.json(
      { message: "خروج موفقیت‌آمیز بود" },
      { status: 200 }
    );

    // حذف کوکی refreshToken با maxAge = 0
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      path: "/api/auth/refresh",
      maxAge: 0,          // باعث حذف کوکی می‌شود
      sameSite: "strict", // امنیت کوکی
      secure: process.env.NODE_ENV === "production",
    });

    return response;

  } catch (error) {
    console.error("خطا در POST /auth/logout:", error);
    return NextResponse.json(
      { error: "خطای سرور هنگام خروج" },
      { status: 500 }
    );
  }
}
