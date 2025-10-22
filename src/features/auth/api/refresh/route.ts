import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/shared/lib/prisma";
import { decryptText } from "@/shared/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

interface RefreshTokenPayload extends JwtPayload {
  id: string;
}

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "رفرش توکن موجود نیست" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as RefreshTokenPayload;

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

    const decryptedUsername = decryptText(user.username);

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
