/**
 * Reason: Centralizes token verification logic.
 * This utility function can be reused across all API routes that require
 * authentication, ensuring a single source of truth for token validation.
 */
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: string;
}

export function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload.id;
  } catch {
    return null;
  }
}
