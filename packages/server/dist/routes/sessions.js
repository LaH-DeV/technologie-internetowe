import { sessionSubmissionSchema, calculateWpm, calculateRawWpm, calculateAccuracy, } from "@typeburn/shared";
import { validateSession } from "../domain/anti-cheat.js";
import crypto from "node:crypto";
import { env } from "../config/env.js";
export function sessionsRoutes(repo) {
    return async (fastify) => {
        fastify.post("/api/sessions", {
            config: {
                rateLimit: {
                    max: 10,
                    timeWindow: "1 minute",
                },
            },
        }, async (request, reply) => {
            const body = sessionSubmissionSchema.parse(request.body);
            const text = await repo.getTextById(body.textId);
            if (!text) {
                return reply.status(400).send({ error: "Invalid text ID" });
            }
            const ip = request.ip;
            const ipHash = crypto
                .createHash("sha256")
                .update(env.IP_HASH_SALT + ip)
                .digest("hex");
            const validation = validateSession(body.keystrokes, body.durationSec, body.elapsedMs);
            const correctChars = body.keystrokes.filter((k) => k.correct).length;
            // Use actual elapsed time (capped at claimed duration) for accurate WPM
            const totalDurationMs = Math.min(body.elapsedMs, body.durationSec * 1000);
            const wpm = calculateWpm(correctChars, totalDurationMs);
            const rawWpm = calculateRawWpm(body.keystrokes.length, totalDurationMs);
            const accuracy = calculateAccuracy(body.keystrokes);
            const session = await repo.createSessionWithKeystrokes({
                textId: body.textId,
                nickname: body.nickname,
                durationSec: body.durationSec,
                wpm,
                rawWpm,
                accuracy,
                language: text.language,
                ipHash,
                isValid: validation.isValid,
            }, body.keystrokes.map((k) => ({
                sessionId: 0, // placeholder — overridden inside the transaction
                charExpected: k.charExpected,
                charTyped: k.charTyped,
                timestampMs: k.timestampMs,
                correct: k.correct,
            })));
            return {
                id: session.id,
                wpm,
                rawWpm,
                accuracy,
                isValid: validation.isValid,
                createdAt: session.createdAt,
            };
        });
    };
}
//# sourceMappingURL=sessions.js.map