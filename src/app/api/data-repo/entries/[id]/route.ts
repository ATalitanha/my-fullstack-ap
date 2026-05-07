/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptText, encryptText } from "@/shared/lib/crypto";
import prisma from "@/shared/lib/prisma";

const EntryTypeEnum = z.enum([
  "TEXT",
  "MATH",
  "FORMULA",
  "EQUATION",
  "DEFINITION",
  "CODE",
  "QUOTE",
  "OTHER",
]);

const updateEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  description: z.string().optional(),
  latexContent: z.string().optional(),
  type: EntryTypeEnum.optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
});

// GET /api/data-repo/entries/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const entry = await prisma.dailyEntry.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "داده یافت نشد" }, { status: 404 });
    }

    // افزایش viewCount
    await prisma.dailyEntry.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // رمزگشایی entry به همراه category و subCategory
    const decryptedEntry = {
      ...entry,
      title: decryptText(entry.title),
      content: decryptText(entry.content),
      category: entry.category
        ? {
            ...entry.category,
            name: decryptText(entry.category.name),
            description: entry.category.description
              ? decryptText(entry.category.description)
              : null,
          }
        : null,
      subCategory: entry.subCategory
        ? {
            ...entry.subCategory,
            name: decryptText(entry.subCategory.name),
            description: entry.subCategory.description
              ? decryptText(entry.subCategory.description)
              : null,
          }
        : null,
    };

    return NextResponse.json(decryptedEntry);
  } catch (error) {
    console.error("GET /api/data-repo/entries/[id] error:", error);
    return NextResponse.json({ error: "خطا در دریافت داده" }, { status: 500 });
  }
}

// PUT /api/data-repo/entries/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = updateEntrySchema.parse(body);

    // رمزنگاری فیلدهای حساس قبل از آپدیت
    const encryptedData: any = { ...validated };
    if (validated.title) {
      encryptedData.title = encryptText(validated.title);
    }
    if (validated.content) {
      encryptedData.content = encryptText(validated.content);
    }

    const entry = await prisma.dailyEntry.update({
      where: { id },
      data: encryptedData,
      include: {
        category: true,
        subCategory: true,
      },
    });

    // رمزگشایی برای پاسخ
    const decryptedEntry = {
      ...entry,
      title: decryptText(entry.title),
      content: decryptText(entry.content),
      category: entry.category
        ? {
            ...entry.category,
            name: decryptText(entry.category.name),
            description: entry.category.description
              ? decryptText(entry.category.description)
              : null,
          }
        : null,
      subCategory: entry.subCategory
        ? {
            ...entry.subCategory,
            name: decryptText(entry.subCategory.name),
            description: entry.subCategory.description
              ? decryptText(entry.subCategory.description)
              : null,
          }
        : null,
    };

    return NextResponse.json(decryptedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر", details: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "خطا در بروزرسانی داده" },
      { status: 500 },
    );
  }
}

// PATCH /api/data-repo/entries/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = updateEntrySchema.parse(body);

    // رمزنگاری فیلدهای حساس قبل از آپدیت
    const encryptedData: any = { ...validated };
    if (validated.title) {
      encryptedData.title = encryptText(validated.title);
    }
    if (validated.content) {
      encryptedData.content = encryptText(validated.content);
    }

    const entry = await prisma.dailyEntry.update({
      where: { id },
      data: encryptedData,
      include: {
        category: true,
        subCategory: true,
      },
    });

    // رمزگشایی برای پاسخ
    const decryptedEntry = {
      ...entry,
      title: decryptText(entry.title),
      content: decryptText(entry.content),
      category: entry.category
        ? {
            ...entry.category,
            name: decryptText(entry.category.name),
            description: entry.category.description
              ? decryptText(entry.category.description)
              : null,
          }
        : null,
      subCategory: entry.subCategory
        ? {
            ...entry.subCategory,
            name: decryptText(entry.subCategory.name),
            description: entry.subCategory.description
              ? decryptText(entry.subCategory.description)
              : null,
          }
        : null,
    };

    return NextResponse.json(decryptedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر", details: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "خطا در بروزرسانی داده" },
      { status: 500 },
    );
  }
}

// DELETE /api/data-repo/entries/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.dailyEntry.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "داده با موفقیت حذف شد" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/data-repo/entries/[id] error:", error);
    return NextResponse.json({ error: "خطا در حذف داده" }, { status: 500 });
  }
}
