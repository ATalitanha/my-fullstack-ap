/** @vitest-environment node */
import { describe, it, expect, vi } from "vitest";
import { GET, POST, DELETE } from "../route";
import { NextRequest } from "next/server";

const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockDeleteMany = vi.fn();

vi.mock("@/shared/lib/prisma", () => ({
	default: {
		historyItem: {
			findMany: (...args: any[]) => mockFindMany(...args),
			create: (...args: any[]) => mockCreate(...args),
			deleteMany: (...args: any[]) => mockDeleteMany(...args),
		},
	},
}));

describe("History API", () => {
	describe("GET", () => {
		it("should return the history", async () => {
			const mockHistory = [{ id: "1", expression: "2+2", result: "4" }];
			mockFindMany.mockResolvedValueOnce(mockHistory);

			const req = new NextRequest("http://localhost", {
				headers: {},
			});

			const response = await GET(req);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockHistory);
		});

		it("should handle errors", async () => {
			mockFindMany.mockRejectedValueOnce(new Error("Test error"));
			const req = new NextRequest("http://localhost", {
				headers: {},
			});

			const response = await GET(req);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe("An error occurred while fetching history.");
		});
	});

	describe("POST", () => {
		it("should create a new history item", async () => {
			const mockItem = { expression: "2+2", result: "4" };
			mockCreate.mockResolvedValueOnce(mockItem);

			const req = new NextRequest("http://localhost", {
				method: "POST",
				body: JSON.stringify(mockItem),
				headers: {},
			});

			const response = await POST(req);
			const data = await response.json();

			expect(response.status).toBe(201);
			expect(data).toEqual(mockItem);
		});
	});

	describe("DELETE", () => {
		it("should delete all history items", async () => {
			mockDeleteMany.mockResolvedValueOnce({});

			const req = new NextRequest("http://localhost", {
				method: "DELETE",
				headers: {},
			});

			const response = await DELETE(req);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.success).toBe(true);
		});
	});
});
