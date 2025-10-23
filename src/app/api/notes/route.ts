import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "@/shared/lib/prisma";
import { decryptText, encryptText } from "@/shared/lib/crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: string;
}

/**
 * Get userId from JWT token
 * @param req - The HTTP request
 * @returns userId or null if token is invalid
 */
function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload.id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

/**
 * @description API to get user's notes
 * @method GET
 * @header Authorization: Bearer <token>
 */
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Get notes in descending order of creation
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    // Decrypt title and content
    const decrypted = notes.map(n => ({
      ...n,
      title: decryptText(n.title),
      content: decryptText(n.content),
    }));

    return NextResponse.json({ notes: decrypted }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /note:", error);
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

/**
 * @description API to create a new note
 * @method POST
 * @header Authorization: Bearer <token>
 * @input { title: string, content: string }
 */
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { title, content } = validation.data;

    // Create new note
    const note = await prisma.note.create({
      data: {
        userId,
        title: encryptText(title),
        content: encryptText(content),
      },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({
      note: {
        ...note,
        title: decryptText(note.title),
        content: decryptText(note.content),
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /note:", error);
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
