import type { Difficulty } from "@typeburn/shared";
import type {
  Repository,
  TextRow,
  SessionRow,
  LeaderboardRow,
  KeystrokeRow,
} from "./repository.js";
import { generateSeedTexts } from "../domain/word-lists.js";

// ---------------------------------------------------------------------------

function buildSeedTexts(): TextRow[] {
  return generateSeedTexts(5, 200).map((t, i) => ({
    id: i + 1,
    content: t.content,
    difficulty: t.difficulty,
    wordCount: t.wordCount,
    language: t.language,
    createdAt: new Date(),
  }));
}

// ---------------------------------------------------------------------------

export class InMemoryRepository implements Repository {
  private texts: TextRow[];
  private sessions: SessionRow[] = [];
  private keystrokes: KeystrokeRow[] = [];
  private nextSessionId = 1;

  constructor() {
    this.texts = buildSeedTexts();
  }

  async getRandomText(
    difficulty?: Difficulty,
    language?: string,
  ): Promise<TextRow | undefined> {
    let pool = this.texts;
    if (difficulty) pool = pool.filter((t) => t.difficulty === difficulty);
    if (language) pool = pool.filter((t) => t.language === language);
    if (pool.length === 0) return undefined;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async getTextById(id: number): Promise<TextRow | undefined> {
    return this.texts.find((t) => t.id === id);
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
    const session: SessionRow = {
      id: this.nextSessionId++,
      ...data,
      createdAt: new Date(),
    };
    this.sessions.push(session);
    return session;
  }

  async createKeystrokes(rows: KeystrokeRow[]): Promise<void> {
    this.keystrokes.push(...rows);
  }

  async createSessionWithKeystrokes(
    sessionData: Parameters<
      import("./repository.js").Repository["createSession"]
    >[0],
    keystrokeRows: KeystrokeRow[],
  ): Promise<SessionRow> {
    const session = await this.createSession(sessionData);
    const rowsWithId = keystrokeRows.map((k) => ({
      ...k,
      sessionId: session.id,
    }));
    this.keystrokes.push(...rowsWithId);
    return session;
  }

  async getLeaderboard(opts: {
    duration?: number;
    language?: string;
    limit: number;
    offset: number;
  }): Promise<import("./repository.js").LeaderboardRow[]> {
    const filtered = this.sessions
      .filter((s) => {
        if (!s.isValid) return false;
        if (opts.duration && s.durationSec !== opts.duration) return false;
        if (opts.language && s.language !== opts.language) return false;
        return true;
      })
      .sort((a, b) => b.wpm - a.wpm);

    return filtered.slice(opts.offset, opts.offset + opts.limit).map((s) => ({
      id: s.id,
      nickname: s.nickname,
      wpm: s.wpm,
      accuracy: s.accuracy,
      durationSec: s.durationSec,
      language: s.language,
      createdAt: s.createdAt,
    }));
  }
}
