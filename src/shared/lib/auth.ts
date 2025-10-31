/**
 * Reason: Centralizes token verification logic.
 * This utility function can be reused across all API routes that require
 * authentication, ensuring a single source of truth for token validation.
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: string;
}

/**
 * Verifies a JWT and returns the user ID if the token is valid.
 * @param {string} token - The JWT to verify.
 * @returns {string | null} The user ID, or null if the token is invalid.
 */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload.id;
  } catch {
    return null;
  }
}
