import type { Keystroke } from "@typeburn/shared";
interface ValidationResult {
    isValid: boolean;
    reason?: string;
}
export declare function validateSession(keystrokes: Keystroke[], claimedDurationSec: number, claimedElapsedMs?: number): ValidationResult;
export {};
//# sourceMappingURL=anti-cheat.d.ts.map