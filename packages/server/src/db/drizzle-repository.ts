import { getDb } from "./index.js";
import { texts, sessions, keystrokes } from "./schema.js";
import { sql, eq, desc, and } from "drizzle-orm";
import type { Difficulty } from "@typeburn/shared";
import type {
  Repository,
  TextRow,
  SessionRow,
  LeaderboardRow,
  KeystrokeRow,
} from "./repository.js";

export class DrizzleRepository implements Repository {
  async getRandomText(
    difficulty?: Difficulty,
    language?: string,
  ): Promise<TextRow | undefined> {
    const conditions = [];
    if (difficulty) conditions.push(eq(texts.difficulty, difficulty));
    if (language) conditions.push(eq(texts.language, language));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [row] = await getDb()
      .select()
      .from(texts)
      .where(where)
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return row as TextRow | undefined;
  }

  async getTextById(id: number): Promise<TextRow | undefined> {
    const [row] = await getDb()
      .select()
      .from(texts)
      .where(eq(texts.id, id))
      .limit(1);

    return row as TextRow | undefined;
  }

  async createSession(data: {
    textId: number;
    nickname: string;
    durationSec: number;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    language: string;
    ipHash: string;
    isValid: boolean;
  }): Promise<SessionRow> {
    const [session] = await getDb().insert(sessions).values(data).returning();
    return session as SessionRow;
  }

  async createKeystrokes(rows: KeystrokeRow[]): Promise<void> {
    if (rows.length === 0) return;
    await getDb().insert(keystrokes).values(rows);
  }

  async createSessionWithKeystrokes(
    sessionData: Parameters<Repository["createSession"]>[0],
    keystrokeRows: KeystrokeRow[],
  ): Promise<SessionRow> {
    return getDb().transaction(async (tx) => {
      const [session] = await tx
        .insert(sessions)
        .values(sessionData)
        .returning();
      if (keystrokeRows.length > 0) {
        await tx.insert(keystrokes).values(
          keystrokeRows.map((k) => ({
            ...k,
            sessionId: (session as SessionRow).id,
          })),
        );
      }
      return session as SessionRow;
    });
  }

  async getLeaderboard(opts: {
    duration?: number;
    language?: string;
    limit: number;
    offset: number;
  }): Promise<LeaderboardRow[]> {
    const conditions = [eq(sessions.isValid, true)];
    if (opts.duration) conditions.push(eq(sessions.durationSec, opts.duration));
    if (opts.language) conditions.push(eq(sessions.language, opts.language));

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
