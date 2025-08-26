import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("refreshToken", "", { httpOnly: true, path: "/api/auth/refresh", maxAge: 0 });
  return response;
}
