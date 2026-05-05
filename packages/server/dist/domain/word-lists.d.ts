import type { Difficulty } from "@typeburn/shared";
export interface LanguageInfo {
    code: string;
    name: string;
}
export interface WordList {
    language: string;
    difficulty: Difficulty;
    words: string[];
}
export interface SeedText {
    content: string;
    difficulty: Difficulty;
    wordCount: number;
    language: string;
}
export declare function getWordLists(language?: string): WordList[];
export declare function getSupportedLanguages(): LanguageInfo[];
/**
 * Generate seed texts for all registered languages and difficulties.
 */
export declare function generateSeedTexts(textsPerList?: number, wordCount?: number): SeedText[];
//# sourceMappingURL=word-lists.d.ts.map