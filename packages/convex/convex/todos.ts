import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Create a new todo item
 */
export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    return todoId;
  },
});

/**
 * Get all todos, ordered by creation time (newest first)
 */
export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("desc").collect();
    return todos;
  },
});

/**
 * Get a single todo by ID
 */
export const getTodoById = query({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    return todo;
  },
});

/**
 * Update a todo item (partial update supported)
 */
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Todo not found");
    }

    const updateData: { text?: string; completed?: boolean; updatedAt: number } = {
      updatedAt: Date.now(),
    };

    if (updates.text !== undefined) {
      updateData.text = updates.text;
    }
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }

    await ctx.db.patch(id, updateData);
  },
});

/**
 * Delete a todo item
 */
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Toggle the completed status of a todo
 */
export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Todo not found");
    }

    await ctx.db.patch(args.id, {
      completed: !existing.completed,
      updatedAt: Date.now(),
    });
  },
});
