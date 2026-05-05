import { z } from "zod";

export const keystrokeSchema = z.object({
  charExpected: z.string().length(1),
  charTyped: z.string().length(1),
  timestampMs: z.number().int().nonnegative(),
  correct: z.boolean(),
});

export const NICKNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
export const NICKNAME_INVALID_CHARS = /[^a-zA-Z0-9_-]/g;

export const sessionSubmissionSchema = z.object({
  textId: z.number().int().positive(),
  durationSec: z.number().refine((v) => [15, 30, 60].includes(v), {
    message: "Duration must be 15, 30, or 60 seconds",
  }),
  elapsedMs: z.number().int().positive(),
  keystrokes: z.array(keystrokeSchema).min(1).max(10_000),
  nickname: z
    .string()
    .trim()
    .min(1, "Nickname is required")
    .max(20, "Nickname must be 20 characters or less")
    .regex(NICKNAME_REGEX, "Only letters, numbers, hyphens, and underscores"),
});

export const leaderboardQuerySchema = z.object({
  duration: z.coerce
    .number()
    .refine((v) => [15, 30, 60].includes(v))
    .optional(),
  language: z.string().min(2).max(10).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const textQuerySchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  language: z.string().min(2).max(10).optional(),
});
