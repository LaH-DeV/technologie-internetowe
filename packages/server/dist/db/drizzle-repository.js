import { getDb } from "./index.js";
import { texts, sessions, keystrokes } from "./schema.js";
import { sql, eq, desc, and } from "drizzle-orm";
export class DrizzleRepository {
    async getRandomText(difficulty, language) {
        const conditions = [];
        if (difficulty)
            conditions.push(eq(texts.difficulty, difficulty));
        if (language)
            conditions.push(eq(texts.language, language));
        const where = conditions.length > 0 ? and(...conditions) : undefined;
        const [row] = await getDb()
            .select()
            .from(texts)
            .where(where)
            .orderBy(sql `RANDOM()`)
            .limit(1);
        return row;
    }
    async getTextById(id) {
        const [row] = await getDb()
            .select()
            .from(texts)
            .where(eq(texts.id, id))
            .limit(1);
        return row;
    }
    async createSession(data) {
        const [session] = await getDb().insert(sessions).values(data).returning();
        return session;
    }
    async createKeystrokes(rows) {
        if (rows.length === 0)
            return;
        await getDb().insert(keystrokes).values(rows);
    }
    async createSessionWithKeystrokes(sessionData, keystrokeRows) {
        return getDb().transaction(async (tx) => {
            const [session] = await tx
                .insert(sessions)
                .values(sessionData)
                .returning();
            if (keystrokeRows.length > 0) {
                await tx.insert(keystrokes).values(keystrokeRows.map((k) => ({
                    ...k,
                    sessionId: session.id,
                })));
            }
            return session;
        });
    }
    async getLeaderboard(opts) {
        const conditions = [eq(sessions.isValid, true)];
        if (opts.duration)
            conditions.push(eq(sessions.durationSec, opts.duration));
        if (opts.language)
            conditions.push(eq(sessions.language, opts.language));
        return getDb()
            .select({
            id: sessions.id,
            nickname: sessions.nickname,
            wpm: sessions.wpm,
            accuracy: sessions.accuracy,
            durationSec: sessions.durationSec,
            language: sessions.language,
            createdAt: sessions.createdAt,
        })
            .from(sessions)
            .where(and(...conditions))
            .orderBy(desc(sessions.wpm))
            .limit(opts.limit)
            .offset(opts.offset);
    }
}
//# sourceMappingURL=drizzle-repository.js.map