/**
 * Reason: Refactored to be a thin controller that uses the AuthService.
 * This approach separates the API layer from business logic, improving testability
 * and maintainability. It now validates input with Zod and delegates to the service.
 */
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/features/auth/server/auth.service';
import { loginSchema } from '@/features/auth/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const authService = new AuthService();
    const { accessToken, refreshToken } = await authService.login(validation.data);

    const response = NextResponse.json({ accessToken });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
