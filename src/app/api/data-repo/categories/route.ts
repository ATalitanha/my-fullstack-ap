import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptText, encryptText } from "@/shared/lib/crypto";
import prisma from "@/shared/lib/prisma";

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

// GET /api/data-repo/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { entries: true, subCategories: true },
        },
      },
    });

    // رمزگشایی name و description قبل از ارسال به کلاینت
    const decryptedCategories = categories.map((category) => ({
      ...category,
      name: decryptText(category.name),
      description: category.description
        ? decryptText(category.description)
        : null,
    }));

    return NextResponse.json(decryptedCategories);
  } catch (error) {
    console.error("GET /api/data-repo/categories error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دسته‌بندی‌ها" },
      { status: 500 },
    );
  }
}

// POST /api/data-repo/categories
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createCategorySchema.parse(body);

    // رمزنگاری name و description قبل از ذخیره در دیتابیس
    const encryptedData = {
      ...validated,
      name: encryptText(validated.name),
      description: validated.description
        ? encryptText(validated.description)
        : null,
    };

    const category = await prisma.category.create({
      data: encryptedData,
    });

    // رمزگشایی برای پاسخ به کلاینت
    const decryptedCategory = {
      ...category,
      name: decryptText(category.name),
      description: category.description
        ? decryptText(category.description)
        : null,
    };

    return NextResponse.json(decryptedCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر", details: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "خطا در ایجاد دسته‌بندی" },
      { status: 500 },
    );
  }
}
