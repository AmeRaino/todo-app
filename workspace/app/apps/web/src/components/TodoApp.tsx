import { useState, useMemo } from "react";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { TodoFilter, type FilterValue } from "./TodoFilter";
import type { UseTodosResult } from "~/hooks/useTodos";

interface TodoAppProps {
  useTodosHook: () => UseTodosResult;
}

export function TodoApp({ useTodosHook }: TodoAppProps) {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    isAdding,
  } = useTodosHook();

  const [filter, setFilter] = useState<FilterValue>("all");

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Todos
      </h1>
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <TodoInput onAdd={addTodo} isSubmitting={isAdding} />
        <TodoFilter
          value={filter}
          onChange={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
        />
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          isLoading={isLoading}
          error={error ?? undefined}
        />
      </div>
    </div>
  );
}
