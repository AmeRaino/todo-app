import { convexTest } from "convex-test";
import { describe, it, expect, beforeEach } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("todos", () => {
  describe("createTodo", () => {
    it("should create a new todo with the given text", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Buy groceries",
      });

      expect(todoId).toBeDefined();

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo).toBeDefined();
      expect(todo?.text).toBe("Buy groceries");
      expect(todo?.completed).toBe(false);
      expect(todo?.createdAt).toBeTypeOf("number");
      expect(todo?.updatedAt).toBeTypeOf("number");
    });

    it("should set completed to false by default", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Test task",
      });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.completed).toBe(false);
    });

    it("should set createdAt and updatedAt timestamps", async () => {
      const t = convexTest(schema, modules);

      const beforeCreate = Date.now();
      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Timestamped task",
      });
      const afterCreate = Date.now();

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.createdAt).toBeGreaterThanOrEqual(beforeCreate);
      expect(todo?.createdAt).toBeLessThanOrEqual(afterCreate);
      expect(todo?.updatedAt).toEqual(todo?.createdAt);
    });
  });

  describe("getTodos", () => {
    it("should return empty array when no todos exist", async () => {
      const t = convexTest(schema, modules);

      const todos = await t.query(api.todos.getTodos);
      expect(todos).toEqual([]);
    });

    it("should return all todos", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(api.todos.createTodo, { text: "First" });
      await t.mutation(api.todos.createTodo, { text: "Second" });
      await t.mutation(api.todos.createTodo, { text: "Third" });

      const todos = await t.query(api.todos.getTodos);
      expect(todos).toHaveLength(3);
    });

    it("should return todos ordered by creation time (newest first)", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(api.todos.createTodo, { text: "First" });
      await t.mutation(api.todos.createTodo, { text: "Second" });
      await t.mutation(api.todos.createTodo, { text: "Third" });

      const todos = await t.query(api.todos.getTodos);
      expect(todos[0].text).toBe("Third");
      expect(todos[1].text).toBe("Second");
      expect(todos[2].text).toBe("First");
    });
  });

  describe("getTodoById", () => {
    it("should return the todo with the given id", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Find me",
      });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo).toBeDefined();
      expect(todo?.text).toBe("Find me");
    });

    it("should return null for non-existent id", async () => {
      const t = convexTest(schema, modules);

      // Create and delete a todo to get a valid but non-existent id format
      const todoId = await t.mutation(api.todos.createTodo, { text: "Temp" });
      await t.mutation(api.todos.deleteTodo, { id: todoId });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo).toBeNull();
    });
  });

  describe("updateTodo", () => {
    it("should update the todo text", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Original",
      });

      await t.mutation(api.todos.updateTodo, {
        id: todoId,
        text: "Updated",
      });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.text).toBe("Updated");
    });

    it("should update the completed status", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Complete me",
      });

      await t.mutation(api.todos.updateTodo, {
        id: todoId,
        completed: true,
      });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.completed).toBe(true);
    });

    it("should update the updatedAt timestamp", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Update timestamp",
      });

      const originalTodo = await t.query(api.todos.getTodoById, { id: todoId });
      const originalUpdatedAt = originalTodo?.updatedAt;

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      await t.mutation(api.todos.updateTodo, {
        id: todoId,
        text: "New text",
      });

      const updatedTodo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(updatedTodo?.updatedAt).toBeGreaterThan(originalUpdatedAt!);
    });

    it("should allow partial updates", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Keep this text",
      });

      await t.mutation(api.todos.updateTodo, {
        id: todoId,
        completed: true,
      });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.text).toBe("Keep this text");
      expect(todo?.completed).toBe(true);
    });
  });

  describe("deleteTodo", () => {
    it("should delete the todo", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Delete me",
      });

      await t.mutation(api.todos.deleteTodo, { id: todoId });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo).toBeNull();
    });

    it("should not affect other todos", async () => {
      const t = convexTest(schema, modules);

      const todoId1 = await t.mutation(api.todos.createTodo, { text: "Keep" });
      const todoId2 = await t.mutation(api.todos.createTodo, { text: "Delete" });

      await t.mutation(api.todos.deleteTodo, { id: todoId2 });

      const todos = await t.query(api.todos.getTodos);
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe("Keep");
    });
  });

  describe("toggleTodo", () => {
    it("should toggle completed from false to true", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Toggle me",
      });

      await t.mutation(api.todos.toggleTodo, { id: todoId });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.completed).toBe(true);
    });

    it("should toggle completed from true to false", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Toggle me",
      });

      await t.mutation(api.todos.toggleTodo, { id: todoId });
      await t.mutation(api.todos.toggleTodo, { id: todoId });

      const todo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(todo?.completed).toBe(false);
    });

    it("should update the updatedAt timestamp", async () => {
      const t = convexTest(schema, modules);

      const todoId = await t.mutation(api.todos.createTodo, {
        text: "Toggle timestamp",
      });

      const originalTodo = await t.query(api.todos.getTodoById, { id: todoId });
      const originalUpdatedAt = originalTodo?.updatedAt;

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      await t.mutation(api.todos.toggleTodo, { id: todoId });

      const toggledTodo = await t.query(api.todos.getTodoById, { id: todoId });
      expect(toggledTodo?.updatedAt).toBeGreaterThan(originalUpdatedAt!);
    });
  });
});
