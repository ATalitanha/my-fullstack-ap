/**
 * Reason: Provides a custom hook for managing todo state and API interactions.
 * This hook encapsulates the logic for fetching, creating, updating, and deleting
 * todos, simplifying the UI components and centralizing state management.
 */
import { useState, useEffect, useCallback } from 'react';
import { ITodo, ICreateTodo, IUpdateTodo } from '../todo.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useTodo() {
  const { token } = useAuth();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTodos(data.todos);
      } else {
        setError(data.error || 'Failed to fetch todos');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (todoData: ICreateTodo) => {
    if (!token) return;
    try {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });
      const data = await res.json();
      if (res.ok) {
        setTodos((prev) => [data.todo, ...prev]);
      } else {
        setError(data.error || 'Failed to create todo');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  const updateTodo = async (id: string, todoData: IUpdateTodo) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });
      const data = await res.json();
      if (res.ok) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? data.todo : t))
        );
      } else {
        setError(data.error || 'Failed to update todo');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  const deleteTodo = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete todo');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  return { todos, isLoading, error, fetchTodos, createTodo, updateTodo, deleteTodo };
}
