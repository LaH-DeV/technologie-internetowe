import { textQuerySchema } from "@typeburn/shared";
export function textsRoutes(repo) {
    return async (fastify) => {
        fastify.get("/api/texts", async (request, reply) => {
            const query = textQuerySchema.parse(request.query);
            const text = await repo.getRandomText(query.difficulty, query.language);
            if (!text) {
                return reply
                    .status(400)
                    .send({ error: "No texts found for the given criteria" });
            }
            return text;
        });
    };
}
//# sourceMappingURL=texts.js.map