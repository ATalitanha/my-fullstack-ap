import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptText, encryptText } from "@/shared/lib/crypto";
import prisma from "@/shared/lib/prisma";

const createSubCategorySchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.optional(),
	icon: z.string().optional(),
	sortOrder: z.number().int().default(0),
	categoryId: z.string(),
});

// GET /api/data-repo/subcategories
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId");

		const subCategories = await prisma.subCategory.findMany({
			where: categoryId ? { categoryId } : undefined,
			orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
			include: {
				category: {
					select: { id: true, name: true, color: true },
				},
				_count: {
					select: { entries: true },
				},
			},
		});

		// رمزگشایی subCategories و category مرتبط
		const decryptedSubCategories = subCategories.map((sub) => ({
			...sub,
			name: decryptText(sub.name),
			description: sub.description ? decryptText(sub.description) : null,
			category: {
				...sub.category,
				name: decryptText(sub.category.name),
			},
		}));

		return NextResponse.json(decryptedSubCategories);
	} catch (error) {
		console.error("GET /api/data-repo/subcategories error:", error);
		return NextResponse.json(
			{ error: "خطا در دریافت زیردسته‌ها" },
			{ status: 500 },
		);
	}
}

// POST /api/data-repo/subcategories
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validated = createSubCategorySchema.parse(body);

		// رمزنگاری name و description قبل از ذخیره
		const encryptedData = {
			...validated,
			name: encryptText(validated.name),
			description: validated.description
				? encryptText(validated.description)
				: null,
		};

		const subCategory = await prisma.subCategory.create({
			data: encryptedData,
		});

		// رمزگشایی برای پاسخ
		const decryptedSubCategory = {
			...subCategory,
			name: decryptText(subCategory.name),
			description: subCategory.description
				? decryptText(subCategory.description)
				: null,
		};

		return NextResponse.json(decryptedSubCategory, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "داده‌های ورودی نامعتبر", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "خطا در ایجاد زیردسته" },
			{ status: 500 },
		);
	}
}
