import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decryptText, encryptEmail } from "@/utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const encryptedEmail = encryptEmail(email); // deterministic encryption

  const user = await prisma.user.findUnique({ where: { email: encryptedEmail } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const decryptedUsername = decryptText(user.username);

  const accessToken = jwt.sign(
    { id: user.id, username: decryptedUsername },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  const response = NextResponse.json({ accessToken });
  response.cookies.set("refreshToken", refreshToken, { httpOnly: true, path: "/api/auth/refresh", maxAge: 7*24*60*60 });

  return response;
}
