import "dotenv/config";
import { z } from "zod";
const envSchema = z.object({
    PORT: z.coerce.number().default(3001),
    HOST: z.string().default("0.0.0.0"),
    DATABASE_URL: z.string().optional().default(""),
    IP_HASH_SALT: process.env.NODE_ENV === "production"
        ? z
            .string()
            .min(16, "IP_HASH_SALT must be at least 16 chars in production")
        : z.string().default("typeburn-dev-salt"),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    CORS_ORIGIN: z
        .string()
        .default(process.env.NODE_ENV === "production" ? "" : "http://localhost:5173"),
});
export const env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map