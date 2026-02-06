import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoList } from "./TodoList";
import type { Todo } from "~/types/todo";

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: `test-id-${Math.random()}`,
  text: "Test todo item",
  completed: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

describe("TodoList", () => {
  it("renders an empty state when there are no todos", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/no todos/i)).toBeInTheDocument();
  });

  it("renders a list of todos", () => {
    const todos = [
      createMockTodo({ _id: "1", text: "First todo" }),
      createMockTodo({ _id: "2", text: "Second todo" }),
      createMockTodo({ _id: "3", text: "Third todo" }),
    ];

    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.getByText("Second todo")).toBeInTheDocument();
    expect(screen.getByText("Third todo")).toBeInTheDocument();
  });

  it("renders todos with correct completion state", () => {
    const todos = [
      createMockTodo({ _id: "1", text: "Completed task", completed: true }),
      createMockTodo({ _id: "2", text: "Incomplete task", completed: false }),
    ];

    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("calls onToggle with correct id when a todo is toggled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const todos = [createMockTodo({ _id: "toggle-test-id", text: "Toggle me" })];

    render(<TodoList todos={todos} onToggle={onToggle} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("toggle-test-id");
  });

  it("calls onDelete with correct id when a todo is deleted", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const todos = [createMockTodo({ _id: "delete-test-id", text: "Delete me" })];

    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("delete-test-id");
  });

  it("renders todos in the order provided", () => {
    const todos = [
      createMockTodo({ _id: "1", text: "First" }),
      createMockTodo({ _id: "2", text: "Second" }),
      createMockTodo({ _id: "3", text: "Third" }),
    ];

    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("First");
    expect(items[1]).toHaveTextContent("Second");
    expect(items[2]).toHaveTextContent("Third");
  });

  it("renders as an unordered list for accessibility", () => {
    const todos = [createMockTodo({ _id: "1", text: "Test" })];

    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(
      <TodoList
        todos={[]}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state when error is provided", () => {
    render(
      <TodoList
        todos={[]}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        error="Failed to load todos"
      />
    );

    expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
  });
});
