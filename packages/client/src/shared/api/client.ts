import type {
  Text,
  SessionSubmission,
  SessionResult,
  LeaderboardEntry,
  Difficulty,
} from "@typeburn/shared";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body: Record<string, unknown> = await res.json().catch(() => ({}));
    const message =
      typeof body.error === "string"
        ? body.error
        : `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  getText(difficulty?: Difficulty, language?: string) {
    const params = new URLSearchParams();
    if (difficulty) params.set("difficulty", difficulty);
    if (language) params.set("language", language);
    const qs = params.toString();
    return request<Text>(`/texts${qs ? `?${qs}` : ""}`);
  },

  getLanguages() {
    return request<import("@typeburn/shared").LanguageInfo[]>("/languages");
  },

  submitSession(data: SessionSubmission) {
    return request<SessionResult>("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getLeaderboard(duration?: number, language?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams();
    if (duration) params.set("duration", String(duration));
    if (language) params.set("language", language);
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    return request<LeaderboardEntry[]>(`/leaderboard?${params}`);
  },
};
