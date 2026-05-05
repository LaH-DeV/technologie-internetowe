import { describe, it, expect } from "vitest";
import { sessionSubmissionSchema, leaderboardQuerySchema, textQuerySchema, NICKNAME_REGEX, } from "./validation.js";
describe("NICKNAME_REGEX", () => {
    it("allows alphanumeric, hyphens, underscores", () => {
        expect(NICKNAME_REGEX.test("player_1")).toBe(true);
        expect(NICKNAME_REGEX.test("cool-name")).toBe(true);
        expect(NICKNAME_REGEX.test("ABC123")).toBe(true);
    });
    it("rejects spaces and special chars", () => {
        expect(NICKNAME_REGEX.test("has space")).toBe(false);
        expect(NICKNAME_REGEX.test("no@symbol")).toBe(false);
        expect(NICKNAME_REGEX.test("")).toBe(false);
    });
});
describe("sessionSubmissionSchema", () => {
    const validSubmission = {
        textId: 1,
        durationSec: 30,
        elapsedMs: 15000,
        keystrokes: [
            {
                charExpected: "a",
                charTyped: "a",
                timestampMs: 100,
                correct: true,
            },
        ],
        nickname: "player1",
    };
    it("accepts a valid submission", () => {
        const result = sessionSubmissionSchema.safeParse(validSubmission);
        expect(result.success).toBe(true);
    });
    it("rejects invalid duration values", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            durationSec: 45,
        });
        expect(result.success).toBe(false);
    });
    it("accepts all valid durations: 15, 30, 60", () => {
        for (const d of [15, 30, 60]) {
            const result = sessionSubmissionSchema.safeParse({
                ...validSubmission,
                durationSec: d,
            });
            expect(result.success).toBe(true);
        }
    });
    it("rejects empty nickname", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            nickname: "",
        });
        expect(result.success).toBe(false);
    });
    it("rejects nickname > 20 chars", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            nickname: "a".repeat(21),
        });
        expect(result.success).toBe(false);
    });
    it("rejects nickname with special characters", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            nickname: "player@1",
        });
        expect(result.success).toBe(false);
    });
    it("rejects empty keystrokes array", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            keystrokes: [],
        });
        expect(result.success).toBe(false);
    });
    it("rejects negative elapsedMs", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            elapsedMs: -1,
        });
        expect(result.success).toBe(false);
    });
    it("rejects zero elapsedMs", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            elapsedMs: 0,
        });
        expect(result.success).toBe(false);
    });
    it("rejects non-integer textId", () => {
        const result = sessionSubmissionSchema.safeParse({
            ...validSubmission,
            textId: 1.5,
        });
        expect(result.success).toBe(false);
    });
});
describe("leaderboardQuerySchema", () => {
    it("accepts empty query (all defaults)", () => {
        const result = leaderboardQuerySchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.limit).toBe(50);
            expect(result.data.offset).toBe(0);
        }
    });
    it("accepts valid duration filter", () => {
        const result = leaderboardQuerySchema.safeParse({ duration: "30" });
        expect(result.success).toBe(true);
    });
    it("rejects invalid duration", () => {
        const result = leaderboardQuerySchema.safeParse({ duration: "45" });
        expect(result.success).toBe(false);
    });
    it("clamps limit to max 100", () => {
        const result = leaderboardQuerySchema.safeParse({ limit: "200" });
        expect(result.success).toBe(false);
    });
    it("accepts language filter", () => {
        const result = leaderboardQuerySchema.safeParse({ language: "en" });
        expect(result.success).toBe(true);
    });
});
describe("textQuerySchema", () => {
    it("accepts empty query", () => {
        const result = textQuerySchema.safeParse({});
        expect(result.success).toBe(true);
    });
    it("accepts valid difficulty", () => {
        for (const d of ["easy", "medium", "hard"]) {
            const result = textQuerySchema.safeParse({ difficulty: d });
            expect(result.success).toBe(true);
        }
    });
    it("rejects invalid difficulty", () => {
        const result = textQuerySchema.safeParse({ difficulty: "extreme" });
        expect(result.success).toBe(false);
    });
});
//# sourceMappingURL=validation.test.js.map