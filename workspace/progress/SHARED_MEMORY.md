# Shared Memory - Todo App Project

> This file accumulates knowledge across all agent sessions. Read at start, append learnings at end.

## Project Overview

Building a Todo app with:
- TanStack Start (frontend)
- Convex (backend)
- pnpm + Turborepo monorepo
- TDD approach

## Tech Stack & Tools

- **Package Manager**: pnpm
- **Monorepo**: Turborepo
- **Frontend**: TanStack Start
- **Backend**: Convex
- **Single command**: `pnpm dev` starts all dev servers

## Skills to Use for Steering & Audit

When making decisions or reviewing code, consult these skills:

- **Frontend Design**: Use for UI component decisions, layout, styling
- **Vercel React Best Practices**: Use for React patterns, performance, SSR
- **Convex Best Practices**: Use for data modeling, queries, mutations, real-time

## Architecture Decisions

### Convex Schema (task-002)
- Schema defined in `packages/convex/convex/schema.ts`
- Using Convex's built-in `_id` (auto-generated) and `_creationTime` fields
- Custom `createdAt` and `updatedAt` timestamps for explicit control
- All Convex functions in `packages/convex/convex/todos.ts`

## Key Interfaces

### Todo Schema
```typescript
// packages/convex/convex/schema.ts
{
  todos: defineTable({
    text: v.string(),         // Required: the todo text
    completed: v.boolean(),   // Default: false
    createdAt: v.number(),    // Timestamp when created
    updatedAt: v.number(),    // Timestamp when last updated
  })
}
```

### Convex API
```typescript
// Mutations
api.todos.createTodo({ text: string }) => Id<"todos">
api.todos.updateTodo({ id: Id<"todos">, text?: string, completed?: boolean }) => void
api.todos.deleteTodo({ id: Id<"todos"> }) => void
api.todos.toggleTodo({ id: Id<"todos"> }) => void

// Queries
api.todos.getTodos() => Todo[]  // Ordered by creation time (newest first)
api.todos.getTodoById({ id: Id<"todos"> }) => Todo | null
```

## Learnings & Gotchas

### Convex Testing (task-002)
- Use `convex-test` with Vitest for testing Convex functions
- Tests require `@edge-runtime/vm` package
- Configure `vitest.config.ts` with `environmentMatchGlobs: [["convex/**", "edge-runtime"]]`
- Use `import.meta.glob("./**/*.ts")` to provide modules to `convexTest()`
- The test warnings about "Convex functions should not directly call other Convex functions" are expected and can be ignored in tests

### Convex Generated Files
- Generated files go in `convex/_generated/`
- Files include: `api.js`, `api.d.ts`, `server.js`, `server.d.ts`, `dataModel.js`, `dataModel.d.ts`
- For local testing without a deployed backend, stub files can be created manually

### React Component Testing (task-005)
- Use `@testing-library/react` with Vitest and jsdom
- Setup file: `src/test/setup.ts` imports `@testing-library/jest-dom/vitest`
- Configure `vitest.config.ts` with `environment: "jsdom"` and `setupFiles`
- Use dependency injection for hooks to make components testable (e.g., `useTodosHook` prop)
- Use `within()` from testing-library when multiple elements match a query
- When testing buttons by name, use exact regex like `/^active$/i` to avoid matching aria-labels

## Completed Work

### task-002-convex-setup ✅
- Created monorepo structure with pnpm workspace and Turborepo
- Initialized Convex package at `packages/convex/`
- Created todo schema with all required fields
- Implemented all CRUD mutations: createTodo, updateTodo, deleteTodo, toggleTodo
- Implemented all queries: getTodos, getTodoById
- Written comprehensive tests (17 tests, all passing)

### task-005-todo-ui ✅
- Built all UI components for the Todo app in `workspace/app/apps/web/`
- Components: TodoItem, TodoList, TodoInput, TodoFilter, TodoApp
- 49 tests passing for all components
- Features implemented:
  - Add new todo (Enter key or button)
  - Toggle todo completion (checkbox)
  - Delete todo (delete button)
  - Filter by all/active/completed
  - Loading states
  - Error states
  - Keyboard accessibility

## UI Component Reference (task-005)

### Components Location
All components in `workspace/app/apps/web/src/components/`

### TodoItem
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

### TodoList
```typescript
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  error?: string;
}
```

### TodoInput
```typescript
interface TodoInputProps {
  onAdd: (text: string) => void;
  isSubmitting?: boolean;
}
```

### TodoFilter
```typescript
type FilterValue = "all" | "active" | "completed";
interface TodoFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  activeCount?: number;
  completedCount?: number;
}
```

### TodoApp (main component)
```typescript
interface TodoAppProps {
  useTodosHook: () => UseTodosResult;
}
```

### useTodos Hook
```typescript
interface UseTodosResult {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  isAdding: boolean;
}
```

## Current Blockers

None
