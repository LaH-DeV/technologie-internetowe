const MIN_AVG_INTERVAL_MS = 15;
const MAX_WPM_THRESHOLD = 250;
const MIN_STD_DEV = 3;
const DURATION_TOLERANCE_MS = 2000;
export function validateSession(keystrokes, claimedDurationSec, claimedElapsedMs) {
    if (keystrokes.length < 2) {
        return { isValid: false, reason: "Too few keystrokes" };
    }
    // Monotonic timestamps
    for (let i = 1; i < keystrokes.length; i++) {
        if (keystrokes[i].timestampMs < keystrokes[i - 1].timestampMs) {
            return { isValid: false, reason: "Non-monotonic timestamps" };
        }
    }
    // Inter-keystroke intervals
    const intervals = [];
    for (let i = 1; i < keystrokes.length; i++) {
        intervals.push(keystrokes[i].timestampMs - keystrokes[i - 1].timestampMs);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avgInterval < MIN_AVG_INTERVAL_MS) {
        return {
            isValid: false,
            reason: "Suspiciously fast keystroke intervals",
        };
    }
    // Standard deviation — bots have unnaturally consistent timing
    const variance = intervals.reduce((sum, i) => sum + (i - avgInterval) ** 2, 0) /
        intervals.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev < MIN_STD_DEV && keystrokes.length > 20) {
        return {
            isValid: false,
            reason: "Suspiciously consistent keystroke timing",
        };
    }
    // Duration sanity check — keystroke span should not exceed claimed duration
    // (it can be shorter since the timer may expire after the last keystroke)
    const keystrokeSpanMs = keystrokes[keystrokes.length - 1].timestampMs - keystrokes[0].timestampMs;
    const claimedMs = claimedDurationSec * 1000;
    if (keystrokeSpanMs > claimedMs + DURATION_TOLERANCE_MS) {
        return { isValid: false, reason: "Duration mismatch" };
    }
    // Elapsed time sanity — claimed elapsedMs must be at least as long as
    // the keystroke span (client can't finish faster than its own keystrokes)
    if (claimedElapsedMs !== undefined) {
        if (claimedElapsedMs < keystrokeSpanMs - DURATION_TOLERANCE_MS) {
            return {
                isValid: false,
                reason: "Elapsed time shorter than keystroke span",
            };
        }
        if (claimedElapsedMs > claimedMs + DURATION_TOLERANCE_MS) {
            return {
                isValid: false,
                reason: "Elapsed time exceeds claimed duration",
            };
        }
    }
    // WPM ceiling — use actual keystroke span for accurate check
    const correctChars = keystrokes.filter((k) => k.correct).length;
    const words = correctChars / 5;
    const spanMinutes = keystrokeSpanMs / 60_000;
    const wpm = spanMinutes > 0 ? words / spanMinutes : 0;
    if (wpm > MAX_WPM_THRESHOLD) {
        return { isValid: false, reason: "WPM exceeds human threshold" };
    }
    return { isValid: true };
}
//# sourceMappingURL=anti-cheat.js.map