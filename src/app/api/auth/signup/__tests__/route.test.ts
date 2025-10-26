/** @vitest-environment node */
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { AuthService } from '@/features/auth/server/auth.service';
import { signupSchema } from '@/features/auth/auth.schema';

vi.mock('@/features/auth/server/auth.service');
vi.mock('@/features/auth/auth.schema');

describe('Signup API', () => {
  it('should sign up a new user', async () => {
    const mockUser = { id: '1' };
    (signupSchema.safeParse as vi.Mock).mockReturnValue({ success: true, data: { username: 'test', email: 'test@example.com', password: 'password' } });
    (AuthService.prototype.signup as vi.Mock).mockResolvedValue(mockUser);

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ username: 'test', email: 'test@example.com', password: 'password' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user).toEqual(mockUser);
  });

  it('should handle invalid input', async () => {
    (signupSchema.safeParse as vi.Mock).mockReturnValue({ success: false, error: { format: () => 'Invalid input' } });

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ username: 'test' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('should handle existing user error', async () => {
    (signupSchema.safeParse as vi.Mock).mockReturnValue({ success: true, data: { username: 'test', email: 'test@example.com', password: 'password' } });
    (AuthService.prototype.signup as vi.Mock).mockRejectedValue(new Error('User with this email already exists'));

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ username: 'test', email: 'test@example.com', password: 'password' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('User with this email already exists');
  });

  it('should handle other errors', async () => {
    (signupSchema.safeParse as vi.Mock).mockReturnValue({ success: true, data: { username: 'test', email: 'test@example.com', password: 'password' } });
    (AuthService.prototype.signup as vi.Mock).mockRejectedValue(new Error('Test error'));

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ username: 'test', email: 'test@example.com', password: 'password' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
