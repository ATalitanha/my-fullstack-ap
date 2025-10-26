/** @vitest-environment node */
import { describe, it, expect, vi } from 'vitest';
import { TodoService } from '../todo.service';
import { TodoRepository } from '../todo.repository';

vi.mock('../todo.repository');

describe('TodoService', () => {
  it('should get todos', async () => {
    (TodoRepository.prototype.findTodosByUserId as vi.Mock).mockResolvedValue([]);
    const service = new TodoService();
    const todos = await service.getTodos('1');
    expect(todos).toEqual([]);
  });

  it('should create a todo', async () => {
    (TodoRepository.prototype.createTodo as vi.Mock).mockResolvedValue({ id: '1' });
    const service = new TodoService();
    const todo = await service.createTodo('1', { title: 'Test todo' });
    expect(todo).toEqual({ id: '1' });
  });

  it('should update a todo', async () => {
    (TodoRepository.prototype.updateTodo as vi.Mock).mockResolvedValue({ id: '1' });
    const service = new TodoService();
    const todo = await service.updateTodo('1', '1', { title: 'Updated todo' });
    expect(todo).toEqual({ id: '1' });
  });

  it('should delete a todo', async () => {
    (TodoRepository.prototype.deleteTodo as vi.Mock).mockResolvedValue(true);
    const service = new TodoService();
    const result = await service.deleteTodo('1', '1');
    expect(result).toBe(true);
  });
});
