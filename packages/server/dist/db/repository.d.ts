import type { Difficulty } from "@typeburn/shared";
export interface TextRow {
    id: number;
    content: string;
    difficulty: Difficulty;
    wordCount: number;
    language: string;
    createdAt: Date;
}
export interface SessionRow {
    id: number;
    textId: number;
    nickname: string;
    durationSec: number;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    language: string;
    ipHash: string | null;
    isValid: boolean;
    createdAt: Date;
}
export interface KeystrokeRow {
    sessionId: number;
    charExpected: string;
    charTyped: string;
    timestampMs: number;
    correct: boolean;
}
export interface LeaderboardRow {
    id: number;
    nickname: string;
    wpm: number;
    accuracy: number;
    durationSec: number;
    language: string;
    createdAt: Date;
}
export interface Repository {
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
    createKeystrokes(keystrokes: KeystrokeRow[]): Promise<void>;
    createSessionWithKeystrokes(sessionData: {
        textId: number;
        nickname: string;
        durationSec: number;
        wpm: number;
        rawWpm: number;
        accuracy: number;
        language: string;
        ipHash: string;
        isValid: boolean;
    }, keystrokeRows: KeystrokeRow[]): Promise<SessionRow>;
    getLeaderboard(opts: {
        duration?: number;
        language?: string;
        limit: number;
        offset: number;
    }): Promise<LeaderboardRow[]>;
}
//# sourceMappingURL=repository.d.ts.map