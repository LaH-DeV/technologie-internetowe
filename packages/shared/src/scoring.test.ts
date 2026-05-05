import { describe, it, expect } from "vitest";
import { calculateWpm, calculateRawWpm, calculateAccuracy } from "./scoring.js";
import type { Keystroke } from "./types.js";

describe("calculateWpm", () => {
  it("returns 0 when durationMs is 0", () => {
    expect(calculateWpm(25, 0)).toBe(0);
  });

  it("returns 0 when durationMs is negative", () => {
    expect(calculateWpm(25, -1000)).toBe(0);
  });

  it("calculates WPM correctly for 1 minute", () => {
    // 250 correct chars / 5 = 50 words, in 60s = 50 WPM
    expect(calculateWpm(250, 60_000)).toBe(50);
  });

  it("calculates WPM correctly for 30 seconds", () => {
    // 125 correct chars / 5 = 25 words, in 30s = 50 WPM
    expect(calculateWpm(125, 30_000)).toBe(50);
  });

  it("calculates WPM correctly for 15 seconds", () => {
    // 50 correct chars / 5 = 10 words, in 15s = 40 WPM
    expect(calculateWpm(50, 15_000)).toBe(40);
  });

  it("returns 0 when no correct chars", () => {
    expect(calculateWpm(0, 60_000)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    // 123 / 5 = 24.6 words in 60s = 24.6 WPM → rounds to 25
    expect(calculateWpm(123, 60_000)).toBe(25);
  });
});

describe("calculateRawWpm", () => {
  it("returns 0 when durationMs is 0", () => {
    expect(calculateRawWpm(100, 0)).toBe(0);
  });

  it("counts all characters regardless of correctness", () => {
    // 300 total chars / 5 = 60 words in 60s = 60 WPM
    expect(calculateRawWpm(300, 60_000)).toBe(60);
  });
});

describe("calculateAccuracy", () => {
  it("returns 0 for empty keystrokes", () => {
    expect(calculateAccuracy([])).toBe(0);
  });

  it("returns 100 for all correct keystrokes", () => {
    const keystrokes: Keystroke[] = [
      { charExpected: "a", charTyped: "a", timestampMs: 100, correct: true },
      { charExpected: "b", charTyped: "b", timestampMs: 200, correct: true },
    ];
    expect(calculateAccuracy(keystrokes)).toBe(100);
  });

  it("returns 0 for all incorrect keystrokes", () => {
    const keystrokes: Keystroke[] = [
      { charExpected: "a", charTyped: "x", timestampMs: 100, correct: false },
      { charExpected: "b", charTyped: "y", timestampMs: 200, correct: false },
    ];
    expect(calculateAccuracy(keystrokes)).toBe(0);
  });

  it("calculates percentage with 2 decimal places", () => {
    const keystrokes: Keystroke[] = [
      { charExpected: "a", charTyped: "a", timestampMs: 100, correct: true },
      { charExpected: "b", charTyped: "b", timestampMs: 200, correct: true },
      { charExpected: "c", charTyped: "x", timestampMs: 300, correct: false },
    ];
    // 2/3 = 66.67%
    expect(calculateAccuracy(keystrokes)).toBe(66.67);
  });

  it("handles single keystroke", () => {
    const keystrokes: Keystroke[] = [
      { charExpected: "a", charTyped: "a", timestampMs: 100, correct: true },
    ];
    expect(calculateAccuracy(keystrokes)).toBe(100);
  });
});
