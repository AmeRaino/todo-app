import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoApp } from "./TodoApp";
import type { Todo } from "~/types/todo";
import type { UseTodosResult } from "~/hooks/useTodos";

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: `test-id-${Math.random()}`,
  text: "Test todo item",
  completed: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

const createMockUseTodos = (overrides: Partial<UseTodosResult> = {}): UseTodosResult => ({
  todos: [],
  isLoading: false,
  error: null,
  addTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
  isAdding: false,
  ...overrides,
});

describe("TodoApp", () => {
  it("renders the app title", () => {
    render(<TodoApp useTodosHook={() => createMockUseTodos()} />);

    expect(screen.getByRole("heading", { name: /todos/i })).toBeInTheDocument();
  });

  it("renders the input field for adding todos", () => {
    render(<TodoApp useTodosHook={() => createMockUseTodos()} />);

    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
  });

  it("renders todos from the hook", () => {
    const todos = [
      createMockTodo({ _id: "1", text: "First todo" }),
      createMockTodo({ _id: "2", text: "Second todo" }),
    ];

    render(<TodoApp useTodosHook={() => createMockUseTodos({ todos })} />);

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.getByText("Second todo")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<TodoApp useTodosHook={() => createMockUseTodos({ isLoading: true })} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state when error is present", () => {
    render(
      <TodoApp
        useTodosHook={() => createMockUseTodos({ error: "Failed to load todos" })}
      />
    );

    expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
  });

  it("calls addTodo when form is submitted", async () => {
    const user = userEvent.setup();
    const addTodo = vi.fn();

    render(<TodoApp useTodosHook={() => createMockUseTodos({ addTodo })} />);

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), "New todo");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(addTodo).toHaveBeenCalledWith("New todo");
  });

  it("calls toggleTodo when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const toggleTodo = vi.fn();
    const todos = [createMockTodo({ _id: "toggle-id", text: "Toggle me" })];

    render(
      <TodoApp useTodosHook={() => createMockUseTodos({ todos, toggleTodo })} />
    );

    await user.click(screen.getByRole("checkbox"));
    expect(toggleTodo).toHaveBeenCalledWith("toggle-id");
  });

  it("calls deleteTodo when delete button is clicked", async () => {
    const user = userEvent.setup();
    const deleteTodo = vi.fn();
    const todos = [createMockTodo({ _id: "delete-id", text: "Delete me" })];

    render(
      <TodoApp useTodosHook={() => createMockUseTodos({ todos, deleteTodo })} />
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(deleteTodo).toHaveBeenCalledWith("delete-id");
  });

  it("shows empty state when there are no todos", () => {
    render(<TodoApp useTodosHook={() => createMockUseTodos({ todos: [] })} />);

    expect(screen.getByText(/no todos/i)).toBeInTheDocument();
  });

  it("disables input when isAdding is true", () => {
    render(<TodoApp useTodosHook={() => createMockUseTodos({ isAdding: true })} />);

    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeDisabled();
  });

  it("filters todos when filter is changed", async () => {
    const user = userEvent.setup();
    const todos = [
      createMockTodo({ _id: "1", text: "First task", completed: false }),
      createMockTodo({ _id: "2", text: "Second task", completed: true }),
    ];

    render(<TodoApp useTodosHook={() => createMockUseTodos({ todos })} />);

    // Both todos visible initially
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();

    // Get the filter group
    const filterGroup = screen.getByRole("group", { name: /filter todos/i });

    // Click "Active" filter - use within to scope to filter group
    const { getByRole: getByRoleInGroup } = within(filterGroup);
    await user.click(getByRoleInGroup("button", { name: /^active$/i }));
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.queryByText("Second task")).not.toBeInTheDocument();

    // Click "Completed" filter
    await user.click(getByRoleInGroup("button", { name: /^completed$/i }));
    expect(screen.queryByText("First task")).not.toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();

    // Click "All" filter
    await user.click(getByRoleInGroup("button", { name: /^all$/i }));
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
  });
});
