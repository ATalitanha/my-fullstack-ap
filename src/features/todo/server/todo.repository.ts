/**
 * Reason: Centralizes all database operations for the Todo model.
 * This repository handles the logic for creating, updating, deleting, and finding
 * todos, abstracting the Prisma client from the service layer.
 */
import prisma from '@/shared/lib/prisma';
import { ICreateTodo, IUpdateTodo } from '../todo.types';
import { encryptText, decryptText } from '@/shared/lib/crypto';

export class TodoRepository {
  async findTodosByUserId(userId: string) {
    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return todos.map((todo) => ({
      ...todo,
      title: decryptText(todo.title),
    }));
  }

  async createTodo(userId: string, data: ICreateTodo) {
    const todo = await prisma.todo.create({
      data: {
        userId,
        title: encryptText(data.title),
      },
    });
    return { ...todo, title: decryptText(todo.title) };
  }

  async updateTodo(id: string, userId: string, data: IUpdateTodo) {
    const updateData: { title?: string; completed?: boolean } = {};
    if (data.title) {
      updateData.title = encryptText(data.title);
    }
    if (data.completed !== undefined) {
      updateData.completed = data.completed;
    }

    const updated = await prisma.todo.updateMany({
      where: { id, userId },
      data: updateData,
    });

    if (updated.count === 0) {
      return null;
    }

    const todo = await prisma.todo.findUnique({ where: { id } });
    return todo ? { ...todo, title: decryptText(todo.title) } : null;
  }

  async deleteTodo(id: string, userId: string) {
    const deleted = await prisma.todo.deleteMany({
      where: { id, userId },
    });
    return deleted.count > 0;
  }
}
