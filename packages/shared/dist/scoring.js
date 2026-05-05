export function calculateWpm(correctChars, durationMs) {
    if (durationMs <= 0)
        return 0;
    const minutes = durationMs / 60_000;
    const words = correctChars / 5;
    return Math.round(words / minutes);
}
export function calculateRawWpm(totalChars, durationMs) {
    if (durationMs <= 0)
        return 0;
    const minutes = durationMs / 60_000;
    const words = totalChars / 5;
    return Math.round(words / minutes);
}
export function calculateAccuracy(keystrokes) {
    if (keystrokes.length === 0)
        return 0;
    const correct = keystrokes.filter((k) => k.correct).length;
    return Math.round((correct / keystrokes.length) * 10_000) / 100;
}
//# sourceMappingURL=scoring.js.map