import { pgTable, serial, text, integer, boolean, timestamp, real, varchar, pgEnum, index, } from "drizzle-orm/pg-core";
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const texts = pgTable("texts", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    wordCount: integer("word_count").notNull(),
    language: varchar("language", { length: 10 }).notNull().default("en"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    textId: integer("text_id")
        .references(() => texts.id)
        .notNull(),
    nickname: varchar("nickname", { length: 20 })
        .notNull()
        .default("anonymous"),
    durationSec: integer("duration_sec").notNull(),
    wpm: real("wpm").notNull(),
    rawWpm: real("raw_wpm").notNull(),
    accuracy: real("accuracy").notNull(),
    language: varchar("language", { length: 10 }).notNull().default("en"),
    ipHash: varchar("ip_hash", { length: 64 }),
    isValid: boolean("is_valid").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    leaderboardIdx: index("idx_sessions_leaderboard").on(table.isValid, table.language, table.durationSec, table.wpm),
}));
export const keystrokes = pgTable("keystrokes", {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
        .references(() => sessions.id)
        .notNull(),
    charExpected: varchar("char_expected", { length: 1 }).notNull(),
    charTyped: varchar("char_typed", { length: 1 }).notNull(),
    timestampMs: integer("timestamp_ms").notNull(),
    correct: boolean("correct").notNull(),
}, (table) => ({
    sessionIdx: index("idx_keystrokes_session").on(table.sessionId),
}));
//# sourceMappingURL=schema.js.map