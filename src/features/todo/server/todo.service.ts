/**
 * Reason: Encapsulates business logic for the todo feature.
 * This service layer uses the TodoRepository to perform CRUD operations,
 * ensuring a clean separation of concerns between business logic and data access.
 */
import { TodoRepository } from './todo.repository';
import { ICreateTodo, IUpdateTodo } from '../todo.types';

export class TodoService {
  private todoRepository = new TodoRepository();

  async getTodos(userId: string) {
    return this.todoRepository.findTodosByUserId(userId);
  }

  async createTodo(userId: string, data: ICreateTodo) {
    return this.todoRepository.createTodo(userId, data);
  }

  async updateTodo(id: string, userId: string, data: IUpdateTodo) {
    return this.todoRepository.updateTodo(id, userId, data);
  }

  async deleteTodo(id: string, userId: string) {
    return this.todoRepository.deleteTodo(id, userId);
  }
}
