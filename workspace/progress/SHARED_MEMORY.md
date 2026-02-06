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

## Completed Work

### task-002-convex-setup ✅
- Created monorepo structure with pnpm workspace and Turborepo
- Initialized Convex package at `packages/convex/`
- Created todo schema with all required fields
- Implemented all CRUD mutations: createTodo, updateTodo, deleteTodo, toggleTodo
- Implemented all queries: getTodos, getTodoById
- Written comprehensive tests (17 tests, all passing)

## Current Blockers

None
