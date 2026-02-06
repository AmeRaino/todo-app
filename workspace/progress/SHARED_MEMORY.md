# Shared Memory - Todo App Project

> This file accumulates knowledge across all agent sessions. Read at start, append learnings at end.

## Project Overview

Building a Todo app with:
- TanStack Start (frontend)
- Convex (backend)
- pnpm + Turborepo monorepo
- TDD approach

## Tech Stack & Tools

- **Package Manager**: pnpm (v9.15.0+)
- **Monorepo**: Turborepo (v2.3.0+)
- **Frontend**: TanStack Start
- **Backend**: Convex
- **Node Version**: >=20.0.0
- **TypeScript**: v5.7.0+
- **Single command**: `pnpm dev` starts all dev servers

## Skills to Use for Steering & Audit

When making decisions or reviewing code, consult these skills:

- **Frontend Design**: Use for UI component decisions, layout, styling
- **Vercel React Best Practices**: Use for React patterns, performance, SSR
- **Convex Best Practices**: Use for data modeling, queries, mutations, real-time

## Architecture Decisions

### Monorepo Structure (task-001)
- Using pnpm workspaces with `apps/*` and `packages/*` patterns
- Turborepo handles task orchestration (dev, build, test, lint, typecheck)
- ESM-first setup (`"type": "module"` in all package.json files)
- Strict TypeScript configuration at root, extended by workspaces

## Key Interfaces

<!-- Agents: Document shared interfaces/types here -->

## Learnings & Gotchas

### TypeScript Configuration
- Base tsconfig.json uses `moduleResolution: "bundler"` for modern ESM
- `noUncheckedIndexedAccess: true` for safer array/object access
- `verbatimModuleSyntax: true` for explicit type imports

## Completed Work

- [task-001] Monorepo foundation setup with pnpm + Turborepo

## Current Blockers

<!-- Agents: List anything blocking progress -->
