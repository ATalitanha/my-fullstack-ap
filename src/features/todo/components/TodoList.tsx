/**
 * Reason: A reusable UI component for displaying a list of todos.
 * This component uses the useTodo hook to fetch and display todos,
 * and it handles user interactions like completing and deleting todos.
 */
'use client';

import { useTodo } from '../hooks/useTodo';
import Button from '@/shared/ui/Button';

export default function TodoList() {
  const { todos, isLoading, error, updateTodo, deleteTodo } = useTodo();

  if (isLoading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-4 border rounded"
        >
          <span
            className={todo.completed ? 'line-through' : ''}
            onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
          >
            {todo.title}
          </span>
          <Button onClick={() => deleteTodo(todo.id)} >
            حذف
          </Button>
        </li>
      ))}
    </ul>
  );
}
