import { getSupportedLanguages } from "../domain/word-lists.js";
export const languagesRoutes = async (fastify) => {
    fastify.get("/api/languages", async () => {
        return getSupportedLanguages();
    });
};
//# sourceMappingURL=languages.js.map