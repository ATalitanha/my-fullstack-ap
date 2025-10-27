/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../route";
import { NextRequest } from "next/server";
import { verifyJwt } from "@/shared/lib/jwt";

const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockDeleteMany = vi.fn();

vi.mock("@/shared/lib/prisma", () => ({
	default: {
		calculation: {
			findMany: (...args: any[]) => mockFindMany(...args),
			create: (...args: any[]) => mockCreate(...args),
			deleteMany: (...args: any[]) => mockDeleteMany(...args),
		},
	},
}));

vi.mock("@/shared/lib/jwt");

const mockUser = { id: "test-user-id" };
const mockToken = "mock-token";

describe("History API", () => {
	beforeEach(() => {
		(verifyJwt as vi.Mock).mockReturnValue(mockUser);
	});

	describe("GET", () => {
		it("should return the history", async () => {
			const mockHistory = [{ id: "1", expression: "2+2", result: "4" }];
			mockFindMany.mockResolvedValueOnce(mockHistory);

			const req = new NextRequest("http://localhost", {
				headers: { Authorization: `Bearer ${mockToken}` },
			});
			const response = await GET(req);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockHistory);
		});

		it("should handle errors", async () => {
			mockFindMany.mockRejectedValueOnce(new Error("Test error"));

			const req = new NextRequest("http://localhost", {
				headers: { Authorization: `Bearer ${mockToken}` },
			});
			const response = await GET(req);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe("خطای داخلی سرور در دریافت تاریخچه محاسبات");
		});
	});

	describe("POST", () => {
		it("should create a new history item", async () => {
			const mockItem = { expression: "2+2", result: "4" };
			mockCreate.mockResolvedValueOnce(mockItem);

			const req = new NextRequest("http://localhost", {
				method: "POST",
				body: JSON.stringify(mockItem),
				headers: { Authorization: `Bearer ${mockToken}` },
			});

			const response = await POST(req);
			const data = await response.json();

			expect(response.status).toBe(201);
			expect(data.data).toEqual(mockItem);
		});

		it("should handle invalid input", async () => {
			const req = new NextRequest("http://localhost", {
				method: "POST",
				body: JSON.stringify({ expression: "2+2" }),
				headers: { Authorization: `Bearer ${mockToken}` },
			});

			const response = await POST(req);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error).toBe("فیلدهای expression و result الزامی هستند");
		});

		it("should handle errors", async () => {
			mockCreate.mockRejectedValueOnce(new Error("Test error"));

			const req = new NextRequest("http://localhost", {
				method: "POST",
				body: JSON.stringify({ expression: "2+2", result: "4" }),
				headers: { Authorization: `Bearer ${mockToken}` },
			});

			const response = await POST(req);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe("خطای داخلی سرور در ایجاد محاسبه");
		});
	});

	describe("DELETE", () => {
		it("should delete all history items", async () => {
			mockDeleteMany.mockResolvedValueOnce({});

			const req = new NextRequest("http://localhost", {
				headers: { Authorization: `Bearer ${mockToken}` },
			});

			const response = await DELETE(req);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.message).toBe("تمام محاسبات حذف شدند");
		});

		it("should handle errors", async () => {
			mockDeleteMany.mockRejectedValueOnce(new Error("Test error"));

			const req = new NextRequest("http://localhost", {
				headers: { Authorization: `Bearer ${mockToken}` },
			});
			const response = await DELETE(req);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe("خطای داخلی سرور در حذف محاسبات");
		});
	});
});
