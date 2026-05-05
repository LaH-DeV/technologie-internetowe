import type { Difficulty } from "@typeburn/shared";
import type { Repository, TextRow, SessionRow, LeaderboardRow, KeystrokeRow } from "./repository.js";
export declare class DrizzleRepository implements Repository {
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
    createSessionWithKeystrokes(sessionData: Parameters<Repository["createSession"]>[0], keystrokeRows: KeystrokeRow[]): Promise<SessionRow>;
    getLeaderboard(opts: {
        duration?: number;
        language?: string;
        limit: number;
        offset: number;
    }): Promise<LeaderboardRow[]>;
}
//# sourceMappingURL=drizzle-repository.d.ts.map