import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "../TodoList";
import { useTodo } from "../../hooks/useTodo";

vi.mock("../../hooks/useTodo");

const mockUpdateTodo = vi.fn();
const mockDeleteTodo = vi.fn();

const mockTodos = [
	{ id: "1", title: "Test todo 1", completed: false },
	{ id: "2", title: "Test todo 2", completed: true },
];

describe("TodoList", () => {
	it("should render the loading state", () => {
		(useTodo as vi.Mock).mockReturnValue({
			todos: [],
			isLoading: true,
			error: null,
			updateTodo: mockUpdateTodo,
			deleteTodo: mockDeleteTodo,
		});
		render(<TodoList />);
		expect(screen.getByText("در حال بارگذاری...")).toBeInTheDocument();
	});

	it("should render the error state", () => {
		(useTodo as vi.Mock).mockReturnValue({
			todos: [],
			isLoading: false,
			error: "Test error",
			updateTodo: mockUpdateTodo,
			deleteTodo: mockDeleteTodo,
		});
		render(<TodoList />);
		expect(screen.getByText("Test error")).toBeInTheDocument();
	});

	it("should render the list of todos", () => {
		(useTodo as vi.Mock).mockReturnValue({
			todos: mockTodos,
			isLoading: false,
			error: null,
			updateTodo: mockUpdateTodo,
			deleteTodo: mockDeleteTodo,
		});
		render(<TodoList />);
		expect(screen.getByText("Test todo 1")).toBeInTheDocument();
		expect(screen.getByText("Test todo 2")).toBeInTheDocument();
	});

	it("should call updateTodo when a todo is clicked", () => {
		(useTodo as vi.Mock).mockReturnValue({
			todos: mockTodos,
			isLoading: false,
			error: null,
			updateTodo: mockUpdateTodo,
			deleteTodo: mockDeleteTodo,
		});
		render(<TodoList />);
		fireEvent.click(screen.getByText("Test todo 1"));
		expect(mockUpdateTodo).toHaveBeenCalledWith("1", { completed: true });
	});

	it("should call deleteTodo when the delete button is clicked", () => {
		(useTodo as vi.Mock).mockReturnValue({
			todos: mockTodos,
			isLoading: false,
			error: null,
			updateTodo: mockUpdateTodo,
			deleteTodo: mockDeleteTodo,
		});
		render(<TodoList />);
		fireEvent.click(screen.getAllByText("حذف")[0]);
		expect(mockDeleteTodo).toHaveBeenCalledWith("1");
	});
});
