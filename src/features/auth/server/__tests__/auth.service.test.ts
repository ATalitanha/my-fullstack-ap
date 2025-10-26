/** @vitest-environment node */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decryptText } from '@/shared/lib/crypto';

vi.mock('../auth.repository');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('@/shared/lib/crypto');

describe('AuthService', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.NOTE_ENC_KEY = 'a'.repeat(43) + '=';
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      (AuthRepository.prototype.findUserByEmail as vi.Mock).mockResolvedValue(null);
      (AuthRepository.prototype.createUser as vi.Mock).mockResolvedValue({ id: '1' });

      const service = new AuthService();
      const user = await service.signup({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });

      expect(user).toEqual({ id: '1' });
    });

    it('should throw an error if the user already exists', async () => {
      (AuthRepository.prototype.findUserByEmail as vi.Mock).mockResolvedValue({ id: '1' });

      const service = new AuthService();

      await expect(
        service.signup({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should log in a user and return tokens', async () => {
      const mockUser = {
        id: '1',
        username: 'encrypted-username',
        password: 'hashed-password',
      };
      (AuthRepository.prototype.findUserByEmail as vi.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);
      (decryptText as vi.Mock).mockReturnValue('testuser');
      (jwt.sign as vi.Mock).mockReturnValue('test-token');

      const service = new AuthService();
      const tokens = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(tokens).toEqual({
        accessToken: 'test-token',
        refreshToken: 'test-token',
      });
    });

    it('should throw an error for invalid credentials', async () => {
      (AuthRepository.prototype.findUserByEmail as vi.Mock).mockResolvedValue(null);

      const service = new AuthService();

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
