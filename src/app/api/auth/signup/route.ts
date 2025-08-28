import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { encryptText, encryptEmail } from "@/utils/crypto";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();
  if (!username || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const encryptedUsername = encryptText(username); // IV تصادفی
    const encryptedEmail = encryptEmail(email);       // IV ثابت، deterministic

    const user = await prisma.user.create({
      data: {
        username: encryptedUsername,
        email: encryptedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ user: { id: user.id } });
  } catch {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
