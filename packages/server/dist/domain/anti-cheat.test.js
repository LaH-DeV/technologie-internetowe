import { describe, it, expect } from "vitest";
import { validateSession } from "./anti-cheat.js";
function makeKeystrokes(count, intervalMs, opts = {}) {
    const { jitter = 10, correctRatio = 1 } = opts;
    const keystrokes = [];
    for (let i = 0; i < count; i++) {
        const offset = i > 0 ? (Math.random() - 0.5) * jitter : 0;
        const correct = Math.random() < correctRatio;
        keystrokes.push({
            charExpected: "a",
            charTyped: correct ? "a" : "x",
            timestampMs: Math.round(i * intervalMs + offset),
            correct,
        });
    }
    return keystrokes;
}
describe("validateSession", () => {
    it("accepts a valid session with normal typing", () => {
        // ~50ms intervals = ~240 chars/min = ~48 WPM (reasonable)
        const ks = makeKeystrokes(100, 50, { jitter: 20 });
        const result = validateSession(ks, 30);
        expect(result.isValid).toBe(true);
    });
    it("rejects too few keystrokes", () => {
        const ks = makeKeystrokes(1, 100);
        const result = validateSession(ks, 30);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe("Too few keystrokes");
    });
    it("rejects non-monotonic timestamps", () => {
        const ks = [
            { charExpected: "a", charTyped: "a", timestampMs: 100, correct: true },
            { charExpected: "b", charTyped: "b", timestampMs: 50, correct: true },
            { charExpected: "c", charTyped: "c", timestampMs: 200, correct: true },
        ];
        const result = validateSession(ks, 30);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe("Non-monotonic timestamps");
    });
    it("rejects suspiciously fast keystroke intervals (bot-like)", () => {
        // 5ms intervals = way too fast for a human
        const ks = makeKeystrokes(50, 5, { jitter: 2 });
        const result = validateSession(ks, 30);
        expect(result.isValid).toBe(false);
        expect(result.reason).toContain("fast");
    });
    it("rejects suspiciously consistent timing (bot-like)", () => {
        // Exactly 50ms intervals with zero jitter
        const ks = [];
        for (let i = 0; i < 50; i++) {
            ks.push({
                charExpected: "a",
                charTyped: "a",
                timestampMs: i * 50,
                correct: true,
            });
        }
        const result = validateSession(ks, 30);
        expect(result.isValid).toBe(false);
        expect(result.reason).toContain("consistent");
    });
    it("rejects when keystroke span exceeds claimed duration", () => {
        // 200 keystrokes at 200ms = 40s span, but claim 15s duration
        const ks = makeKeystrokes(200, 200, { jitter: 20 });
        const result = validateSession(ks, 15);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe("Duration mismatch");
    });
    it("accepts session within tolerance of claimed duration", () => {
        // 100 keystrokes at 50ms = 5s span, claim 30s = well within tolerance
        const ks = makeKeystrokes(100, 50, { jitter: 15 });
        const result = validateSession(ks, 30);
        expect(result.isValid).toBe(true);
    });
    it("rejects WPM above threshold", () => {
        // 500 correct chars in 30s = 100 words / 0.5 min = 200 WPM... let's go higher
        // Need > 300 WPM = > 150 words/min at 30s = > 75 words = > 375 chars
        // With 30s duration: 750 correct chars / 5 / 0.5 = 300 WPM, try more
        const count = 800;
        const interval = 30_000 / count; // ~37.5ms per keystroke
        const ks = makeKeystrokes(count, interval, {
            jitter: 15,
            correctRatio: 1,
        });
        const result = validateSession(ks, 30);
        // 800 / 5 / 0.5 = 320 WPM > 300 threshold
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe("WPM exceeds human threshold");
    });
    describe("elapsed time validation", () => {
        it("rejects when elapsedMs is shorter than keystroke span", () => {
            // 50 keystrokes at 100ms = 5s span, but claim only 1s elapsed
            const ks = makeKeystrokes(50, 100, { jitter: 15 });
            const result = validateSession(ks, 30, 1000);
            expect(result.isValid).toBe(false);
            expect(result.reason).toContain("Elapsed time shorter");
        });
        it("rejects when elapsedMs exceeds claimed duration", () => {
            const ks = makeKeystrokes(50, 50, { jitter: 15 });
            // Claim 30s duration but 35s elapsed (well beyond tolerance)
            const result = validateSession(ks, 30, 35_000);
            expect(result.isValid).toBe(false);
            expect(result.reason).toContain("exceeds claimed duration");
        });
        it("accepts valid elapsedMs", () => {
            const ks = makeKeystrokes(100, 50, { jitter: 15 });
            // 100 * 50ms ≈ 5s span, claim 6s elapsed in a 30s test
            const result = validateSession(ks, 30, 6000);
            expect(result.isValid).toBe(true);
        });
        it("skips elapsed time check when not provided", () => {
            const ks = makeKeystrokes(100, 50, { jitter: 15 });
            const result = validateSession(ks, 30);
            expect(result.isValid).toBe(true);
        });
    });
});
//# sourceMappingURL=anti-cheat.test.js.map