import type { Difficulty } from "@typeburn/shared";
import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Load word-lists from JSON files in ../data/word-lists/
// Each file: { "name": "English", "easy": [...], "medium": [...], "hard": [...] }
// Filename (without .json) = language code.
// ---------------------------------------------------------------------------

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const dataDir = join(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "data",
  "word-lists",
);

let cachedLists: WordList[] | null = null;
let cachedLanguages: LanguageInfo[] | null = null;

function loadAll() {
  if (cachedLists) return;

  const lists: WordList[] = [];
  const langs: LanguageInfo[] = [];

  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const code = basename(file, ".json");
    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(readFileSync(join(dataDir, file), "utf-8"));
    } catch (err) {
      console.error(`[word-lists] Failed to parse ${file}, skipping:`, err);
      continue;
    }
    const name: string = (raw.name as string) ?? code;
    langs.push({ code, name });

    for (const d of DIFFICULTIES) {
      const words = raw[d] as string[] | undefined;
      if (words && words.length > 0) {
        lists.push({ language: code, difficulty: d, words });
      }
    }
  }

  cachedLists = lists;
  cachedLanguages = langs.sort((a, b) => a.code.localeCompare(b.code));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getWordLists(language?: string): WordList[] {
  loadAll();
  if (language) return cachedLists!.filter((wl) => wl.language === language);
  return cachedLists!;
}

export function getSupportedLanguages(): LanguageInfo[] {
  loadAll();
  return cachedLanguages!;
}

// ---------------------------------------------------------------------------
// Text generation helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i]!, copy[j]!] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function generateText(words: string[], wordCount: number): string {
  const result: string[] = [];
  while (result.length < wordCount) result.push(...shuffle(words));
  return result.slice(0, wordCount).join(" ");
}

/**
 * Generate seed texts for all registered languages and difficulties.
 */
export function generateSeedTexts(
  textsPerList = 5,
  wordCount = 200,
): SeedText[] {
  const out: SeedText[] = [];
  for (const wl of getWordLists()) {
    for (let i = 0; i < textsPerList; i++) {
      out.push({
        content: generateText(wl.words, wordCount),
        difficulty: wl.difficulty,
        wordCount,
        language: wl.language,
      });
    }
  }
  return out;
}
