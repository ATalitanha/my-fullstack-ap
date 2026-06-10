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

const createEntrySchema = z.object({
	title: z.string().min(1).max(200),
	content: z.string().min(1),
	description: z.string().optional(),
	latexContent: z.string().optional(),
	type: EntryTypeEnum.default("TEXT"),
	tags: z.array(z.string()).default([]),
	isFavorite: z.boolean().default(false),
	categoryId: z.string(),
	subCategoryId: z.string().optional(),
});

// تابع کمکی برای فیلتر کردن داده‌های رمزگشایی شده
function filterDecryptedEntries(entries: any[], search: string) {
	if (!search) return entries;

	const searchLower = search.toLowerCase();

	return entries.filter((entry) => {
		// جستجو در title
		if (entry.title?.toLowerCase().includes(searchLower)) return true;
		// جستجو در content
		if (entry.content?.toLowerCase().includes(searchLower)) return true;
		// جستجو در description
		if (entry.description?.toLowerCase().includes(searchLower)) return true;
		// جستجو در tags
		if (
			entry.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
		)
			return true;

		return false;
	});
}

// GET /api/data-repo/entries
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId");
		const subCategoryId = searchParams.get("subCategoryId");
		const type = searchParams.get("type") as z.infer<typeof EntryTypeEnum>;
		const search = searchParams.get("search");
		const isFavorite = searchParams.get("isFavorite");
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = (searchParams.get("sortOrder") || "desc") as
			| "asc"
			| "desc";

		const where: any = {};

		if (categoryId) where.categoryId = categoryId;
		if (subCategoryId) where.subCategoryId = subCategoryId;
		if (type) where.type = type;
		if (isFavorite === "true") where.isFavorite = true;

		// اگر جستجو وجود دارد، همه رکوردهای منطبق با فیلترهای اصلی را می‌گیریم
		// و سپس در حافظه جستجو می‌کنیم
		const shouldFetchAll = !!search;

		const queryOptions: any = {
			where,
			orderBy: { [sortBy]: sortOrder },
			include: {
				category: {
					select: { id: true, name: true, color: true, icon: true },
				},
				subCategory: {
					select: { id: true, name: true, color: true, icon: true },
				},
			},
		};

		if (!shouldFetchAll) {
			queryOptions.skip = (page - 1) * limit;
			queryOptions.take = limit;
		}

		const [fetchedEntries, totalCount] = await Promise.all([
			prisma.dailyEntry.findMany(queryOptions),
			prisma.dailyEntry.count({ where }),
		]);

		// رمزگشایی همه entries
		const decryptedEntries = fetchedEntries.map((entry: any) => ({
			...entry,
			title: decryptText(entry.title),
			content: decryptText(entry.content),
			category: entry.category
				? {
						...entry.category,
						name: decryptText(entry.category.name),
					}
				: null,
			subCategory: entry.subCategory
				? {
						...entry.subCategory,
						name: decryptText(entry.subCategory.name),
					}
				: null,
		}));

		// اعمال جستجو در حافظه (اگر search وجود دارد)
		let filteredEntries = decryptedEntries;
		let total = totalCount;

		if (search) {
			filteredEntries = filterDecryptedEntries(decryptedEntries, search);
			total = filteredEntries.length;

			// اعمال pagination روی داده‌های فیلتر شده
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			filteredEntries = filteredEntries.slice(startIndex, endIndex);
		}

		return NextResponse.json({
			data: filteredEntries,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("GET /api/data-repo/entries error:", error);
		return NextResponse.json(
			{ error: "خطا در دریافت داده‌ها" },
			{ status: 500 },
		);
	}
}

// POST /api/data-repo/entries
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validated = createEntrySchema.parse(body);

		// رمزنگاری title و content قبل از ذخیره
		const encryptedData = {
			...validated,
			title: encryptText(validated.title),
			content: encryptText(validated.content),
		};

		const entry = await prisma.dailyEntry.create({
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
					}
				: null,
			subCategory: entry.subCategory
				? {
						...entry.subCategory,
						name: decryptText(entry.subCategory.name),
					}
				: null,
		};

		return NextResponse.json(decryptedEntry, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "داده‌های ورودی نامعتبر", details: error },
				{ status: 400 },
			);
		}
		return NextResponse.json({ error: "خطا در ایجاد داده" }, { status: 500 });
	}
}
