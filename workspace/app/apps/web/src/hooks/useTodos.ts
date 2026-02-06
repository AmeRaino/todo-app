import { useCallback, useState } from "react";
import type { Todo } from "~/types/todo";

export interface UseTodosResult {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  isAdding: boolean;
}

export interface ConvexTodoApi {
  useQuery: <T>(query: unknown) => T | undefined;
  useMutation: (mutation: unknown) => (args: Record<string, unknown>) => Promise<unknown>;
  api: {
    todos: {
      getTodos: unknown;
      createTodo: unknown;
      toggleTodo: unknown;
      deleteTodo: unknown;
    };
  };
}

export function createUseTodos(convexApi?: ConvexTodoApi) {
  return function useTodos(): UseTodosResult {
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use Convex hooks if available
    const todosQuery = convexApi?.useQuery<Todo[]>(convexApi.api.todos.getTodos);
    const createMutation = convexApi?.useMutation(convexApi.api.todos.createTodo);
    const toggleMutation = convexApi?.useMutation(convexApi.api.todos.toggleTodo);
    const deleteMutation = convexApi?.useMutation(convexApi.api.todos.deleteTodo);

    const isLoading = convexApi ? todosQuery === undefined : false;
    const todos = todosQuery ?? [];

    const addTodo = useCallback(async (text: string) => {
      if (!createMutation) return;
      setIsAdding(true);
      setError(null);
      try {
        await createMutation({ text });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add todo");
      } finally {
        setIsAdding(false);
      }
    }, [createMutation]);

    const toggleTodo = useCallback(async (id: string) => {
      if (!toggleMutation) return;
      setError(null);
      try {
        await toggleMutation({ id });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to toggle todo");
      }
    }, [toggleMutation]);

    const deleteTodo = useCallback(async (id: string) => {
      if (!deleteMutation) return;
      setError(null);
      try {
        await deleteMutation({ id });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete todo");
      }
    }, [deleteMutation]);

    return {
      todos,
      isLoading,
      error,
      addTodo,
      toggleTodo,
      deleteTodo,
      isAdding,
    };
  };
}

// Default export for direct usage (will need Convex provider in production)
export const useTodos = createUseTodos();
