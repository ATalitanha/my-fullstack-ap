/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/notes/route";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/shared/lib/prisma";
import { decryptText, encryptText } from "@/shared/lib/crypto";
import { vi } from "vitest";

vi.mock("@/shared/lib/prisma", () => ({
	default: {
		note: {
			findMany: vi.fn(),
			create: vi.fn(),
		},
	},
}));

vi.mock("@/shared/lib/crypto", () => ({
	encryptText: vi.fn((text) => `encrypted:${text}`),
	decryptText: vi.fn((text) => text.replace("encrypted:", "")),
}));

const JWT_SECRET = "test-secret";
process.env.JWT_SECRET = JWT_SECRET;
const USER_ID = "test-user-id";

function createMockRequest(
	method: "GET" | "POST",
	body?: unknown,
	token?: string | null,
): NextRequest {
	const headers = new Headers();
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	if (body) {
		headers.set("Content-Type", "application/json");
	}

	return new NextRequest(`http://localhost/api/notes`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});
}

describe("Notes API", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	// Tests for GET endpoint
	describe("GET /api/notes", () => {
		it("should return 401 if unauthorized", async () => {
			const req = createMockRequest("GET", null, null);
			const res = await GET(req);
			expect(res.status).toBe(401);
		});

		it("should return notes for an authenticated user", async () => {
			const token = jwt.sign({ id: USER_ID }, JWT_SECRET);
			const mockNotes = [
				{
					id: "1",
					title: "encrypted:Note 1",
					content: "encrypted:Content 1",
					userId: USER_ID,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];
			(prisma.note.findMany as vi.Mock).mockResolvedValue(mockNotes);

			const req = createMockRequest("GET", null, token);
			const res = await GET(req);
			const data = await res.json();

			expect(res.status).toBe(200);
			expect(data.notes[0].title).toBe("Note 1");
			expect(data.notes[0].content).toBe("Content 1");
		});
	});

	// Tests for POST endpoint
	describe("POST /api/notes", () => {
		it("should return 401 if unauthorized", async () => {
			const req = createMockRequest(
				"POST",
				{ title: "New Note", content: "Content" },
				null,
			);
			const res = await POST(req);
			expect(res.status).toBe(401);
		});

		it("should return 400 for invalid input", async () => {
			const token = jwt.sign({ id: USER_ID }, JWT_SECRET);
			const req = createMockRequest("POST", { title: "" }, token);
			const res = await POST(req);
			expect(res.status).toBe(400);
		});

		it("should create and return a new note for an authenticated user", async () => {
			const token = jwt.sign({ id: USER_ID }, JWT_SECRET);
			const noteData = { title: "New Note", content: "New Content" };
			const createdNote = {
				id: "2",
				...noteData,
				title: `encrypted:${noteData.title}`,
				content: `encrypted:${noteData.content}`,
				userId: USER_ID,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			(prisma.note.create as vi.Mock).mockResolvedValue(createdNote);

			const req = createMockRequest("POST", noteData, token);
			const res = await POST(req);
			const data = await res.json();

			expect(res.status).toBe(201);
			expect(data.note.title).toBe(noteData.title);
			expect(data.note.content).toBe(noteData.content);
		});
	});
});
