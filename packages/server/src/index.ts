import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { textsRoutes } from "./routes/texts.js";
import { sessionsRoutes } from "./routes/sessions.js";
import { leaderboardRoutes } from "./routes/leaderboard.js";
import { languagesRoutes } from "./routes/languages.js";
import { createRepository } from "./db/create-repository.js";
import { closeDb } from "./db/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const fastify = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
    },
    trustProxy: true,
  });

  const { repo, mode } = await createRepository();
  fastify.log.info(
    `Storage: ${mode}${mode === "in-memory" ? " (DB unavailable - data will not persist)" : ""}`,
  );

  await fastify.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
  });
  await fastify.register(cors, { origin: env.CORS_ORIGIN });
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Return clean 400 for validation errors instead of leaking Zod internals
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation failed",
        issues: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }
    // Default Fastify error handling
    reply.send(error);
  });

  fastify.get("/api/health", async () => ({
    status: "ok",
    storage: mode,
    timestamp: new Date().toISOString(),
  }));

  await fastify.register(textsRoutes(repo));
  await fastify.register(sessionsRoutes(repo));
  await fastify.register(leaderboardRoutes(repo));
  await fastify.register(languagesRoutes);

  // In production, serve the built client SPA
  if (env.NODE_ENV === "production") {
    const clientDist = path.resolve(__dirname, "../../client/dist");
    await fastify.register(fastifyStatic, {
      root: clientDist,
      wildcard: false,
    });
    fastify.setNotFoundHandler((_request, reply) => {
      if (_request.url.startsWith("/api/")) {
        return reply.status(404).send({ error: "Not found" });
      }
      return reply.sendFile("index.html");
    });
  }

  await fastify.listen({ port: env.PORT, host: env.HOST });

  const shutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`);
    await fastify.close();
    await closeDb();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
