import type { FastifyPluginAsync } from "fastify";
import { leaderboardQuerySchema } from "@typeburn/shared";
import type { Repository } from "../db/repository.js";

export function leaderboardRoutes(repo: Repository): FastifyPluginAsync {
  return async (fastify) => {
    fastify.get("/api/leaderboard", async (request) => {
      const query = leaderboardQuerySchema.parse(request.query);

      const rows = await repo.getLeaderboard({
        duration: query.duration,
        language: query.language,
        limit: query.limit,
        offset: query.offset,
      });

      return rows.map((row, i) => ({
        position: query.offset + i + 1,
        id: row.id,
        nickname: row.nickname,
        wpm: row.wpm,
        accuracy: row.accuracy,
        durationSec: row.durationSec,
        language: row.language,
        createdAt: row.createdAt,
      }));
    });
  };
}
