import type { Duration } from "@typeburn/shared";
import { LanguagePicker } from "../../../shared/components/LanguagePicker.js";
import { useLeaderboard } from "../hooks/use-leaderboard.js";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const DURATION_OPTIONS: (Duration | "all")[] = ["all", 15, 30, 60];

export function Leaderboard() {
  const [duration, setDuration] = useState<Duration | "all">("all");
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useLeaderboard(
    duration === "all" ? undefined : duration,
    language,
  );

  const hasEverLoaded = useRef(false);
  if (!isLoading && !error && !!data) hasEverLoaded.current = true;
  const showControls = hasEverLoaded.current;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-bg-card text-text-muted rounded-lg hover:bg-bg-hover hover:text-text transition-colors text-sm font-medium"
        >
          Play
        </Link>
      </div>

      {showControls && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex gap-1 sm:gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`
                px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-mono text-xs sm:text-sm font-medium transition-colors
                ${
                  duration === d
                    ? "bg-primary text-white"
                    : "bg-bg-card text-text-muted hover:bg-bg-hover hover:text-text"
                }
              `}
              >
                {d === "all" ? "All" : `${d}s`}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-bg-card hidden sm:block" />
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setLanguage(undefined)}
              className={`
              px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
              ${
                !language
                  ? "bg-primary text-white"
                  : "bg-bg-card text-text-muted hover:bg-bg-hover hover:text-text"
              }
            `}
            >
              All
            </button>
            <LanguagePicker
              value={language ?? ""}
              onChange={(l) => setLanguage(l)}
            />
          </div>
        </div>
      )}

      {isLoading && (
        <p
          className="text-text-muted text-center py-8"
          role="status"
          aria-live="polite"
        >
          Loading...
        </p>
      )}

      {!isLoading && error && (
        <p className="text-incorrect text-center py-8" role="alert">
          Failed to load leaderboard
        </p>
      )}

      {!isLoading && !error && data && data.length === 0 && (
        <p className="text-text-muted text-center py-8">
          {showControls
            ? "No results for the selected filters."
            : "No results yet. Be the first!"}
        </p>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <div className="bg-bg-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-hover">
                <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs text-text-muted uppercase tracking-wider">
                  #
                </th>
                <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs text-text-muted uppercase tracking-wider">
                  Player
                </th>
                <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs text-text-muted uppercase tracking-wider">
                  WPM
                </th>
                <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs text-text-muted uppercase tracking-wider">
                  Accuracy
                </th>
                {duration === "all" && (
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden sm:table-cell">
                    Time
                  </th>
                )}
                {!language && (
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden sm:table-cell">
                    Lang
                  </th>
                )}
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-bg-hover/50 last:border-b-0 hover:bg-bg-hover/30 transition-colors"
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-mono text-text-muted text-sm">
                    {entry.position}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-mono text-text font-medium text-sm">
                    {entry.nickname}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-mono font-bold text-primary text-sm">
                    {Math.round(entry.wpm)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-mono text-correct text-sm">
                    {entry.accuracy.toFixed(1)}%
                  </td>
                  {duration === "all" && (
                    <td className="px-4 py-3 font-mono text-text-muted text-sm hidden sm:table-cell">
                      {entry.durationSec}s
                    </td>
                  )}
                  {!language && (
                    <td className="px-4 py-3 font-mono text-text-muted text-sm uppercase hidden sm:table-cell">
                      {entry.language}
                    </td>
                  )}
                  <td className="px-4 py-3 text-text-muted text-sm hidden sm:table-cell">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
