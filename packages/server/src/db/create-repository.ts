import pg from "pg";
import { env } from "../config/env.js";
import type { Repository } from "./repository.js";
import { DrizzleRepository } from "./drizzle-repository.js";
import { InMemoryRepository } from "./in-memory-repository.js";

export async function createRepository(): Promise<{
  repo: Repository;
  mode: "postgres" | "in-memory";
}> {
  if (!env.DATABASE_URL) {
    console.warn(
      "[db] No DATABASE_URL configured — using in-memory repository. Data is ephemeral and memory will grow unbounded.",
    );
    return { repo: new InMemoryRepository(), mode: "in-memory" };
  }

  try {
    const pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
      connectionTimeoutMillis: 3000,
    });
    // Attempt one query to verify the connection is live
    await pool.query("SELECT 1");
    await pool.end();
    return { repo: new DrizzleRepository(), mode: "postgres" };
  } catch (err) {
    console.warn(
      "[db] Failed to connect to PostgreSQL, falling back to in-memory repository:",
      err,
    );
    return { repo: new InMemoryRepository(), mode: "in-memory" };
  }
}
