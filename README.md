# 🔥 TypeBurn

A speed typing test with real-time WPM tracking, difficulty levels, multi-language support, and an anonymous leaderboard — built with React, Fastify, and PostgreSQL.

## Features

- **Solo typing test** with 15s / 30s / 60s durations
- **Three difficulty levels**: easy, medium, hard
- **Multi-language** text support
- **Real-time stats**: WPM, raw WPM, accuracy, countdown timer
- **Anonymous leaderboard** with duration and language filters
- **Anti-cheat** validation (keystroke intervals, timing deviation, WPM ceiling)
- **Dark fire-themed UI** with JetBrains Mono font
- **Accessible**: keyboard-navigable, `aria-live` regions, focus management
- **Graceful fallback**: works with in-memory storage when PostgreSQL is unavailable

## Tech Stack

| Layer  | Tech                                                       |
| ------ | ---------------------------------------------------------- |
| Client | React 19, Vite 6, Tailwind CSS v4, TanStack React Query v5 |
| Server | Fastify 5, Drizzle ORM, PostgreSQL 16                      |
| Shared | TypeScript, Zod schemas                                    |
| Infra  | Docker, npm workspaces                                     |

## Quick Start

### Prerequisites

- Node.js 22+
- Docker (optional, for PostgreSQL)

### Development

```bash
# Clone and install
git clone <repo-url> && cd typeburn
npm install

# Start PostgreSQL (optional — app falls back to in-memory)
docker compose up db -d

# Copy env and push schema
cp .env.example .env
cp packages/server/.env.example packages/server/.env
npm run db:push
npm run db:seed

> If you are not using Docker, make sure the PostgreSQL database `typeburn` exists before running `npm run db:push`.

# Start dev servers (client + API)
npm run dev
```

Client runs at `http://localhost:5173`, API at `http://localhost:3001`.

### Docker (full stack)

```bash
docker compose up --build
```

App available at `http://localhost:3001`.

## Project Structure

```
packages/
  shared/     # Types, Zod schemas, scoring functions
  server/     # Fastify API, Drizzle ORM, anti-cheat
  client/     # React SPA, Tailwind, components
```

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start client + server in dev mode |
| `npm run build`   | Build all packages                |
| `npm test`        | Run all tests                     |
| `npm run db:push` | Push Drizzle schema to DB         |
| `npm run db:seed` | Seed sample texts                 |

## API

| Method | Route                                                 | Description           |
| ------ | ----------------------------------------------------- | --------------------- |
| GET    | `/api/health`                                         | Health check          |
| GET    | `/api/texts?difficulty=&language=`                    | Get random text       |
| GET    | `/api/languages`                                      | Available languages   |
| POST   | `/api/sessions`                                       | Submit typing session |
| GET    | `/api/leaderboard?duration=&language=&limit=&offset=` | Leaderboard           |

## Environment Variables

See [.env.example](.env.example) for all options:

| Variable       | Default                 | Description                  |
| -------------- | ----------------------- | ---------------------------- |
| `DATABASE_URL` | _(empty = in-memory)_   | PostgreSQL connection string |
| `PORT`         | `3001`                  | Server port                  |
| `HOST`         | `0.0.0.0`               | Server host                  |
| `NODE_ENV`     | `development`           | Environment                  |
| `CORS_ORIGIN`  | `http://localhost:5173` | Allowed CORS origin          |

## License

MIT
