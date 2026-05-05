import { z } from "zod";
export declare const keystrokeSchema: z.ZodObject<{
    charExpected: z.ZodString;
    charTyped: z.ZodString;
    timestampMs: z.ZodNumber;
    correct: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    charExpected: string;
    charTyped: string;
    timestampMs: number;
    correct: boolean;
}, {
    charExpected: string;
    charTyped: string;
    timestampMs: number;
    correct: boolean;
}>;
export declare const NICKNAME_REGEX: RegExp;
export declare const NICKNAME_INVALID_CHARS: RegExp;
export declare const sessionSubmissionSchema: z.ZodObject<{
    textId: z.ZodNumber;
    durationSec: z.ZodEffects<z.ZodNumber, number, number>;
    elapsedMs: z.ZodNumber;
    keystrokes: z.ZodArray<z.ZodObject<{
        charExpected: z.ZodString;
        charTyped: z.ZodString;
        timestampMs: z.ZodNumber;
        correct: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        charExpected: string;
        charTyped: string;
        timestampMs: number;
        correct: boolean;
    }, {
        charExpected: string;
        charTyped: string;
        timestampMs: number;
        correct: boolean;
    }>, "many">;
    nickname: z.ZodString;
}, "strip", z.ZodTypeAny, {
    textId: number;
    durationSec: number;
    elapsedMs: number;
    keystrokes: {
        charExpected: string;
        charTyped: string;
        timestampMs: number;
        correct: boolean;
    }[];
    nickname: string;
}, {
    textId: number;
    durationSec: number;
    elapsedMs: number;
    keystrokes: {
        charExpected: string;
        charTyped: string;
        timestampMs: number;
        correct: boolean;
    }[];
    nickname: string;
}>;
export declare const leaderboardQuerySchema: z.ZodObject<{
    duration: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, number>>;
    language: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    duration?: number | undefined;
    language?: string | undefined;
}, {
    duration?: number | undefined;
    language?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export declare const textQuerySchema: z.ZodObject<{
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    language: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    language?: string | undefined;
    difficulty?: "easy" | "medium" | "hard" | undefined;
}, {
    language?: string | undefined;
    difficulty?: "easy" | "medium" | "hard" | undefined;
}>;
//# sourceMappingURL=validation.d.ts.map