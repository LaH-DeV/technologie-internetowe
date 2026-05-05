# TypeBurn — Project Overview

## Pitch

TypeBurn is a real-time speed typing test that measures how fast and accurately you type. Pick a duration, choose a difficulty, start typing — and see your WPM update live. Results are submitted to an anonymous leaderboard with server-side anti-cheat validation. No account needed, no tracking, just typing.

## Why this architecture?

The app is a **monorepo with three packages** — shared, server, and client — connected through npm workspaces. This structure enforces a clean separation of concerns while allowing type-safe code sharing between frontend and backend.

### Shared package (`packages/shared`)

Types, validation schemas, and scoring logic live here. Zod schemas serve double duty: they define TypeScript types at compile time _and_ validate data at runtime. This means the server and client always agree on what a valid session submission looks like — a single schema change propagates everywhere.

### Server (`packages/server`)

A Fastify 5 API server with PostgreSQL via Drizzle ORM. Key design decisions:

- **Anti-cheat validation** — Every submitted session is analyzed for bot-like behavior: suspiciously fast or uniform keystroke intervals, WPM above human thresholds, and elapsed time cross-validation against keystroke timestamps. This prevents trivial cheating via automated input.
- **In-memory fallback** — If PostgreSQL is unavailable, the server gracefully falls back to in-memory storage. This makes local development friction-free and the app resilient.
- **Transactions** — Session + keystroke inserts happen atomically. No orphaned data.
- **Security** — Rate limiting (global + per-endpoint), Helmet security headers, IP hashing (SHA-256, never stored raw), Zod validation on all inputs, clean error responses that don't leak internals.

### Client (`packages/client`)

A React 19 SPA built with Vite and Tailwind CSS v4. Key patterns:

- **Focused container** — Keyboard input is captured on a focused `<div>` with `onKeyDown`, not via `document.addEventListener`. This scopes input handling properly and avoids conflicts with other UI elements.
- **Ref-based hot path** — The typing engine uses `useRef` for keystroke recording and timing to avoid re-renders on every keypress. State updates are batched and deferred to `requestAnimationFrame` for the timer.
- **Accessibility** — `aria-live` regions announce stat changes to screen readers, `role` attributes mark interactive regions, focus is managed across route transitions.
- **Code splitting** — Secondary routes (leaderboard, nickname) are lazy-loaded to keep the initial bundle small.

## Tech choices and rationale

| Choice                       | Why                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| **TypeScript strict mode**   | Catches bugs at compile time; shared types prevent client/server drift                                 |
| **Zod**                      | Single source of truth for validation + types; works on both sides                                     |
| **Fastify**                  | Faster than Express, built-in schema validation, first-class TypeScript                                |
| **Drizzle ORM**              | Type-safe SQL with minimal abstraction; clean migration story                                          |
| **React Query**              | Handles caching, deduplication, retry, and loading states — less code than manual `useEffect` fetching |
| **Tailwind CSS v4**          | Utility-first, no CSS-in-JS runtime cost, consistent design tokens via CSS custom properties           |
| **Docker multi-stage build** | Small production image; single container serves both API and SPA                                       |

## What I'd add with more time

- End-to-end tests with Playwright
- WebSocket-based multiplayer mode
- User accounts with OAuth
- Typing analytics (heatmaps, per-finger speed)
- CI/CD pipeline with GitHub Actions
