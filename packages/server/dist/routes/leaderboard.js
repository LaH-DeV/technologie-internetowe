import { leaderboardQuerySchema } from "@typeburn/shared";
export function leaderboardRoutes(repo) {
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
//# sourceMappingURL=leaderboard.js.map