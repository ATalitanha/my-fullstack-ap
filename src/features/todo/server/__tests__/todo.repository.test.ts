/** @vitest-environment node */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { TodoRepository } from '../todo.repository';

const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockUpdateMany = vi.fn();
const mockDeleteMany = vi.fn();
const mockFindUnique = vi.fn();

vi.mock('@/shared/lib/prisma', () => ({
  default: {
    todo: {
      findMany: (...args: any[]) => mockFindMany(...args),
      create: (...args: any[]) => mockCreate(...args),
      updateMany: (...args: any[]) => mockUpdateMany(...args),
      deleteMany: (...args: any[]) => mockDeleteMany(...args),
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
  },
}));

describe('TodoRepository', () => {
  let encryptText: vi.Mock;
  let decryptText: vi.Mock;
  let TodoRepository: any;

  beforeAll(async () => {
    process.env.NOTE_ENC_KEY = 'a'.repeat(43) + '=';

    vi.doMock('@/shared/lib/crypto', () => ({
      encryptText: vi.fn(),
      decryptText: vi.fn(),
    }));

    const crypto = await import('@/shared/lib/crypto');
    encryptText = crypto.encryptText;
    decryptText = crypto.decryptText;

    TodoRepository = (await import('../todo.repository')).TodoRepository;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find todos by user id', async () => {
    const encryptedTitle = 'iv.ct.tag';
    mockFindMany.mockResolvedValue([{ title: encryptedTitle }]);
    (decryptText as vi.Mock).mockReturnValue('decrypted-title');

    const repository = new TodoRepository();
    const todos = await repository.findTodosByUserId('1');

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: '1' },
      orderBy: { createdAt: 'desc' },
    });
    expect(decryptText).toHaveBeenCalledWith(encryptedTitle);
    expect(todos[0].title).toBe('decrypted-title');
  });

  it('should create a todo', async () => {
    const encryptedTitle = 'iv.ct.tag';
    (encryptText as vi.Mock).mockReturnValue(encryptedTitle);
    mockCreate.mockResolvedValue({ title: encryptedTitle });
    (decryptText as vi.Mock).mockReturnValue('decrypted-title');

    const repository = new TodoRepository();
    const todo = await repository.createTodo('1', { title: 'Test todo' });

    expect(encryptText).toHaveBeenCalledWith('Test todo');
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: '1',
        title: encryptedTitle,
      },
    });
    expect(todo.title).toBe('decrypted-title');
  });

  it('should update a todo', async () => {
    const encryptedTitle = 'iv.ct.tag';
    (encryptText as vi.Mock).mockReturnValue(encryptedTitle);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    mockFindUnique.mockResolvedValue({ title: encryptedTitle });
    (decryptText as vi.Mock).mockReturnValue('decrypted-title');

    const repository = new TodoRepository();
    const todo = await repository.updateTodo('1', '1', { title: 'Updated todo' });

    expect(encryptText).toHaveBeenCalledWith('Updated todo');
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: '1', userId: '1' },
      data: {
        title: encryptedTitle,
      },
    });
    expect(todo.title).toBe('decrypted-title');
  });

  it('should delete a todo', async () => {
    mockDeleteMany.mockResolvedValue({ count: 1 });

    const repository = new TodoRepository();
    const result = await repository.deleteTodo('1', '1');

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { id: '1', userId: '1' },
    });
    expect(result).toBe(true);
  });
});
