export interface Text {
    id: number;
    content: string;
    difficulty: Difficulty;
    wordCount: number;
    language: string;
    createdAt: string;
}
export interface Keystroke {
    charExpected: string;
    charTyped: string;
    timestampMs: number;
    correct: boolean;
}
export interface SessionSubmission {
    textId: number;
    durationSec: Duration;
    elapsedMs: number;
    keystrokes: Keystroke[];
    nickname: string;
}
export interface SessionResult {
    id: number;
    textId: number;
    durationSec: number;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    isValid: boolean;
    createdAt: string;
}
export interface LeaderboardEntry {
    position: number;
    id: number;
    nickname: string;
    wpm: number;
    accuracy: number;
    durationSec: number;
    language: string;
    createdAt: string;
}
export type Difficulty = "easy" | "medium" | "hard";
export type Duration = 15 | 30 | 60;
export interface LanguageInfo {
    code: string;
    name: string;
}
//# sourceMappingURL=types.d.ts.map