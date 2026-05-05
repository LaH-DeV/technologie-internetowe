import type { Difficulty } from "@typeburn/shared";
import type { Repository, TextRow, SessionRow, KeystrokeRow } from "./repository.js";
export declare class InMemoryRepository implements Repository {
    private texts;
    private sessions;
    private keystrokes;
    private nextSessionId;
    constructor();
    getRandomText(difficulty?: Difficulty, language?: string): Promise<TextRow | undefined>;
    getTextById(id: number): Promise<TextRow | undefined>;
    createSession(data: {
        textId: number;
        nickname: string;
        durationSec: number;
        wpm: number;
        rawWpm: number;
        accuracy: number;
        language: string;
        ipHash: string;
        isValid: boolean;
    }): Promise<SessionRow>;
    createKeystrokes(rows: KeystrokeRow[]): Promise<void>;
    createSessionWithKeystrokes(sessionData: Parameters<import("./repository.js").Repository["createSession"]>[0], keystrokeRows: KeystrokeRow[]): Promise<SessionRow>;
    getLeaderboard(opts: {
        duration?: number;
        language?: string;
        limit: number;
        offset: number;
    }): Promise<import("./repository.js").LeaderboardRow[]>;
}
//# sourceMappingURL=in-memory-repository.d.ts.map