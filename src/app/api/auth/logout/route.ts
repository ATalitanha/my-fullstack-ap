import { NextResponse } from "next/server";

/**
 * API برای خروج کاربر (پاک کردن کوکی refreshToken)
 * متد: POST
 */
export async function POST() {
  // ایجاد پاسخ موفق برای خروج
  const response = NextResponse.json({ message: "خروج موفقیت‌آمیز بود" });

  // حذف کوکی refreshToken (با maxAge = 0)
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/api/auth/refresh",
    maxAge: 0, // باعث حذف کوکی می‌شود
  });

  return response;
}
