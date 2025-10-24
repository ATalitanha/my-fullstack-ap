import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/shared/lib/prisma";
import { decryptText } from "@/shared/lib/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

interface JwtPayload {
  id: string;
  username: string;
}

export const dynamic = 'force-dynamic'

/**
 * @description API to reissue Access Token
 * @method GET
 * @input refreshToken from HttpOnly cookie
 */
export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Verify and decode refresh token
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;

    // Find user in the database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Decrypt username for the new token
    const decryptedUsername = decryptText(user.username);

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user.id, username: decryptedUsername },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /auth/refresh:", error);
    return NextResponse.json(
      { error: "Invalid refresh token or server error" },
      { status: 401 }
    );
  }
}
