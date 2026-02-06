import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoItem } from "./TodoItem";
import type { Todo } from "~/types/todo";

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: "test-id-1",
  text: "Test todo item",
  completed: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

describe("TodoItem", () => {
  it("renders todo text correctly", () => {
    const todo = createMockTodo({ text: "Buy groceries" });
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("renders unchecked checkbox when todo is not completed", () => {
    const todo = createMockTodo({ completed: false });
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checked checkbox when todo is completed", () => {
    const todo = createMockTodo({ completed: true });
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("applies strikethrough style to completed todo text", () => {
    const todo = createMockTodo({ completed: true, text: "Done task" });
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const textElement = screen.getByText("Done task");
    expect(textElement).toHaveStyle({ textDecoration: "line-through" });
  });

  it("calls onToggle with todo id when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const todo = createMockTodo();

    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith(todo._id);
  });

  it("renders a delete button", () => {
    const todo = createMockTodo();
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls onDelete with todo id when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const todo = createMockTodo();

    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(todo._id);
  });

  it("has accessible labels for checkbox and delete button", () => {
    const todo = createMockTodo({ text: "Accessible todo" });
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAccessibleName(/accessible todo/i);
  });
});
