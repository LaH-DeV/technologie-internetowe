import type { FastifyPluginAsync } from "fastify";
import { getSupportedLanguages } from "../domain/word-lists.js";

export const languagesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/languages", async () => {
    return getSupportedLanguages();
  });
};
