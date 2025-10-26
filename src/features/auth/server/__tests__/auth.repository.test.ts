/** @vitest-environment node */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();

vi.mock('@/shared/lib/prisma', () => ({
  default: {
    user: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
      create: (...args: any[]) => mockCreate(...args),
    },
  },
}));

vi.mock('bcrypt');

describe('AuthRepository', () => {
  let AuthRepository;
  let encryptEmail;
  let encryptText;

  beforeAll(async () => {
    process.env.NOTE_ENC_KEY = 'a'.repeat(43) + '='; // 32 bytes in base64
    process.env.EMAIL_ENC_KEY = 'a'.repeat(43) + '=';

    vi.doMock('@/shared/lib/crypto', () => ({
      encryptEmail: vi.fn(),
      encryptText: vi.fn(),
    }));

    const crypto = await import('@/shared/lib/crypto');
    encryptEmail = crypto.encryptEmail;
    encryptText = crypto.encryptText;

    AuthRepository = (await import('../auth.repository')).AuthRepository;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find a user by email', async () => {
    (encryptEmail as vi.Mock).mockReturnValue('encrypted-email');
    mockFindUnique.mockResolvedValue({ email: 'encrypted-email' });

    const repository = new AuthRepository();
    const user = await repository.findUserByEmail('test@example.com');

    expect(encryptEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'encrypted-email' },
    });
    expect(user).toEqual({ email: 'encrypted-email' });
  });

  it('should create a user', async () => {
    (bcrypt.hash as vi.Mock).mockResolvedValue('hashed-password');
    (encryptText as vi.Mock).mockReturnValue('encrypted-username');
    (encryptEmail as vi.Mock).mockReturnValue('encrypted-email');
    mockCreate.mockResolvedValue({
      username: 'encrypted-username',
      email: 'encrypted-email',
      password: 'hashed-password',
    });

    const repository = new AuthRepository();
    const user = await repository.createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(encryptText).toHaveBeenCalledWith('testuser');
    expect(encryptEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        username: 'encrypted-username',
        email: 'encrypted-email',
        password: 'hashed-password',
      },
    });
    expect(user).toEqual({
      username: 'encrypted-username',
      email: 'encrypted-email',
      password: 'hashed-password',
    });
  });
});
