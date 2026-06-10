/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptText, encryptText } from "@/shared/lib/crypto";
import prisma from "@/shared/lib/prisma";

const updateSubCategorySchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.optional(),
	icon: z.string().optional(),
	sortOrder: z.number().int().optional(),
	categoryId: z.string().optional(),
});

// GET /api/data-repo/subcategories/[id]
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const subCategory = await prisma.subCategory.findUnique({
			where: { id },
			include: {
				category: true,
				_count: {
					select: { entries: true },
				},
			},
		});

		if (!subCategory) {
			return NextResponse.json({ error: "زیردسته یافت نشد" }, { status: 404 });
		}

		// رمزگشایی subCategory و category والد
		const decryptedSubCategory = {
			...subCategory,
			name: decryptText(subCategory.name),
			description: subCategory.description
				? decryptText(subCategory.description)
				: null,
			category: {
				...subCategory.category,
				name: decryptText(subCategory.category.name),
				description: subCategory.category.description
					? decryptText(subCategory.category.description)
					: null,
			},
		};

		return NextResponse.json(decryptedSubCategory);
	} catch (error) {
		console.error("GET /api/data-repo/subcategories/[id] error:", error);
		return NextResponse.json(
			{ error: "خطا در دریافت زیردسته" },
			{ status: 500 },
		);
	}
}

// PUT /api/data-repo/subcategories/[id]
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const validated = updateSubCategorySchema.parse(body);

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

		const subCategory = await prisma.subCategory.update({
			where: { id },
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

		return NextResponse.json(decryptedSubCategory);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "داده‌های ورودی نامعتبر", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "خطا در بروزرسانی زیردسته" },
			{ status: 500 },
		);
	}
}

// PATCH /api/data-repo/subcategories/[id]
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const validated = updateSubCategorySchema.parse(body);

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

		const subCategory = await prisma.subCategory.update({
			where: { id },
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

		return NextResponse.json(decryptedSubCategory);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "داده‌های ورودی نامعتبر", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "خطا در بروزرسانی زیردسته" },
			{ status: 500 },
		);
	}
}

// DELETE /api/data-repo/subcategories/[id]
export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		await prisma.subCategory.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: "زیردسته با موفقیت حذف شد" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("DELETE /api/data-repo/subcategories/[id] error:", error);
		return NextResponse.json({ error: "خطا در حذف زیردسته" }, { status: 500 });
	}
}
