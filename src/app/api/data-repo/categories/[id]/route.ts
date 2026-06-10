/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptText, encryptText } from "@/shared/lib/crypto";
import prisma from "@/shared/lib/prisma";

const updateCategorySchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.optional(),
	icon: z.string().optional(),
	sortOrder: z.number().int().optional(),
});

// GET /api/data-repo/categories/[id]
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				subCategories: {
					orderBy: { sortOrder: "asc" },
				},
				_count: {
					select: { entries: true },
				},
			},
		});

		if (!category) {
			return NextResponse.json({ error: "دسته‌بندی یافت نشد" }, { status: 404 });
		}

		// رمزگشایی category و subCategories قبل از ارسال
		const decryptedCategory = {
			...category,
			name: decryptText(category.name),
			description: category.description
				? decryptText(category.description)
				: null,
			subCategories: category.subCategories.map((sub) => ({
				...sub,
				name: decryptText(sub.name),
				description: sub.description ? decryptText(sub.description) : null,
			})),
		};

		return NextResponse.json(decryptedCategory);
	} catch (error) {
		console.error("GET /api/data-repo/categories/[id] error:", error);
		return NextResponse.json(
			{ error: "خطا در دریافت دسته‌بندی" },
			{ status: 500 },
		);
	}
}

// PUT /api/data-repo/categories/[id]
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const validated = updateCategorySchema.parse(body);

		// رمزنگاری فیلدهای حساس قبل از آپدیت
		const encryptedData: any = { ...validated };
		if (validated.name) {
			encryptedData.name = encryptText(validated.name);
		}
		if (validated.description !== undefined) {
			encryptedData.description = validated.description
				? encryptText(validated.description)
				: null;
		}

		const category = await prisma.category.update({
			where: { id },
			data: encryptedData,
		});

		// رمزگشایی برای پاسخ
		const decryptedCategory = {
			...category,
			name: decryptText(category.name),
			description: category.description
				? decryptText(category.description)
				: null,
		};

		return NextResponse.json(decryptedCategory);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "داده‌های ورودی نامعتبر", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "خطا در بروزرسانی دسته‌بندی" },
			{ status: 500 },
		);
	}
}

// PATCH /api/data-repo/categories/[id]
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const validated = updateCategorySchema.parse(body);

		// رمزنگاری فیلدهای حساس قبل از آپدیت
		const encryptedData: any = { ...validated };
		if (validated.name) {
			encryptedData.name = encryptText(validated.name);
		}
		if (validated.description !== undefined) {
			encryptedData.description = validated.description
				? encryptText(validated.description)
				: null;
		}

		const category = await prisma.category.update({
			where: { id },
			data: encryptedData,
		});

		// رمزگشایی برای پاسخ
		const decryptedCategory = {
			...category,
			name: decryptText(category.name),
			description: category.description
				? decryptText(category.description)
				: null,
		};

		return NextResponse.json(decryptedCategory);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "داده‌های ورودی نامعتبر", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "خطا در بروزرسانی دسته‌بندی" },
			{ status: 500 },
		);
	}
}

// حذف نداریم - DELETE not implemented for categories
