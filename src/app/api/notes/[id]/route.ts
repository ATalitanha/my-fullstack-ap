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
 * Helper function to extract userId from JWT
 * @param req - The HTTP request
 * @returns The userId or null if the token is invalid
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

const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

/**
 * @description API to edit a specific note
 * @method PUT
 * @input { title: string, content: string }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { title, content } = validation.data;

    // Update the note only for the owner
    const updated = await prisma.note.updateMany({
      where: { id, userId },
      data: { title: encryptText(title), content: encryptText(content) },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Note not found or user not authorized" }, { status: 404 });
    }

    // Retrieve the note after update
    const note = await prisma.note.findUnique({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({
      note: {
        ...note,
        title: decryptText(note.title),
        content: decryptText(note.content),
      },
    }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in PUT /note/[id]:", error);
    return NextResponse.json({ error: "Server error", details: message }, { status: 500 });
  }
}

/**
 * @description API to delete a specific note
 * @method DELETE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const deleted = await prisma.note.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Note not found or user not authorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in DELETE /note/[id]:", error);
    return NextResponse.json({ error: "Server error", details: message }, { status: 500 });
  }
}
