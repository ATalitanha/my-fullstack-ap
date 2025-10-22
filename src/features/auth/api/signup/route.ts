import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const SignupRequest = z.object({
  username: z.string(),
  password: z.string().min(6),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, email } = SignupRequest.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error in POST /auth/signup:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
