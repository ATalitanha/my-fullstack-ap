import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodo } from '../useTodo';
import { useAuth } from '@/features/auth/hooks/useAuth';

vi.mock('@/features/auth/hooks/useAuth');

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTodos = [
  { id: '1', title: 'Test todo 1', completed: false },
  { id: '2', title: 'Test todo 2', completed: true },
];

describe('useTodo', () => {
  beforeEach(() => {
    (useAuth as vi.Mock).mockReturnValue({ token: 'test-token' });
    vi.clearAllMocks();
  });

  it('should fetch todos on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todos: mockTodos }),
    });

    let result;
    await act(async () => {
      result = renderHook(() => useTodo()).result;
    });

    expect(result.current.todos).toEqual(mockTodos);
  });

  it('should create a new todo', async () => {
    const newTodo = { id: '3', title: 'New todo', completed: false };
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ todos: [] }),
      }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todo: newTodo }),
    });

    let result;
    await act(async () => {
      result = renderHook(() => useTodo()).result;
    });

    await act(async () => {
      await result.current.createTodo({ title: 'New todo' });
    });

    expect(result.current.todos).toEqual([newTodo]);
  });

  it('should update a todo', async () => {
    const updatedTodo = { id: '1', title: 'Updated todo', completed: true };
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ todos: mockTodos }),
      }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todo: updatedTodo }),
    });

    let result;
    await act(async () => {
      result = renderHook(() => useTodo()).result;
    });

    await act(async () => {
      await result.current.updateTodo('1', { title: 'Updated todo', completed: true });
    });

    expect(result.current.todos).toEqual([updatedTodo, mockTodos[1]]);
  });

  it('should delete a todo', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ todos: mockTodos }),
      }).mockResolvedValueOnce({
      ok: true,
    });

    let result;
    await act(async () => {
      result = renderHook(() => useTodo()).result;
    });

    await act(async () => {
      await result.current.deleteTodo('1');
    });

    expect(result.current.todos).toEqual([mockTodos[1]]);
  });

  it('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Test error' }),
    });

    let result;
    await act(async () => {
      result = renderHook(() => useTodo()).result;
    });

    expect(result.current.error).toBe('Test error');
  });
});
