import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getUserIdFromToken } from "../auth";

const JWT_SECRET = "test-secret";
process.env.JWT_SECRET = JWT_SECRET;

const USER_ID = "test-user-id";

describe("getUserIdFromToken", () => {
	it("should return the user ID when a valid token is provided", () => {
		const token = jwt.sign({ id: USER_ID }, JWT_SECRET);
		const headers = new Headers({ Authorization: `Bearer ${token}` });
		const req = new NextRequest("http://localhost", { headers });

		const userId = getUserIdFromToken(req);
		expect(userId).toBe(USER_ID);
	});

	it("should return null when the authorization header is missing", () => {
		const req = new NextRequest("http://localhost");
		const userId = getUserIdFromToken(req);
		expect(userId).toBeNull();
	});

	it("should return null when the token is missing from the header", () => {
		const headers = new Headers({ Authorization: "Bearer " });
		const req = new NextRequest("http://localhost", { headers });
		const userId = getUserIdFromToken(req);
		expect(userId).toBeNull();
	});

	it("should return null when the token is malformed", () => {
		const headers = new Headers({ Authorization: "Bearer malformed-token" });
		const req = new NextRequest("http://localhost", { headers });
		const userId = getUserIdFromToken(req);
		expect(userId).toBeNull();
	});

	it("should return null when the token is signed with an invalid secret", () => {
		const token = jwt.sign({ id: USER_ID }, "wrong-secret");
		const headers = new Headers({ Authorization: `Bearer ${token}` });
		const req = new NextRequest("http://localhost", { headers });
		const userId = getUserIdFromToken(req);
		expect(userId).toBeNull();
	});

	it("should return null when the token has expired", () => {
		const token = jwt.sign({ id: USER_ID }, JWT_SECRET, { expiresIn: "-1s" });
		const headers = new Headers({ Authorization: `Bearer ${token}` });
		const req = new NextRequest("http://localhost", { headers });

		// Allow a 1-second grace period for the test to run
		setTimeout(() => {
			const userId = getUserIdFromToken(req);
			expect(userId).toBeNull();
		}, 1000);
	});
});
