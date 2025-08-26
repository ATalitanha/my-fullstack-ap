import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
