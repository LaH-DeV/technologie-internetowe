import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Duration, Keystroke, SessionResult } from "@typeburn/shared";
import { api } from "../../../shared/api/client.js";
import { useEffect, useRef } from "react";

interface ResultsScreenProps {
  textId: number;
  duration: Duration;
  elapsedMs: number;
  keystrokes: Keystroke[];
  nickname: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export function ResultsScreen({
  textId,
  duration,
  elapsedMs,
  keystrokes,
  nickname,
  wpm,
  rawWpm,
  accuracy,
  onPlayAgain,
  onViewLeaderboard,
}: ResultsScreenProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      api.submitSession({
        textId,
        durationSec: duration,
        elapsedMs,
        keystrokes,
        nickname,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });

  const submittedRef = useRef(false);
  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;

  useEffect(() => {
    if (keystrokes.length > 0 && !submittedRef.current) {
      submittedRef.current = true;
      mutateRef.current();
    }
  }, [keystrokes.length]);

  const result: SessionResult | undefined = mutation.data;

  return (
    <div
      className="flex flex-col items-center gap-8 py-8"
      role="region"
      aria-label="Test results"
    >
      <h2 className="text-3xl font-bold">Results</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <StatCard label="WPM" value={wpm} color="text-primary" />
        <StatCard label="Raw WPM" value={rawWpm} color="text-text" />
        <StatCard
          label="Accuracy"
          value={`${accuracy}%`}
          color="text-correct"
        />
        <StatCard
          label="Characters"
          value={`${keystrokes.filter((k) => k.correct).length}/${keystrokes.length}`}
          color="text-text"
        />
      </div>

      {mutation.isPending && (
        <p className="text-text-muted text-sm" role="status" aria-live="polite">
          Submitting result...
        </p>
      )}

      {mutation.isError && (
        <p className="text-incorrect text-sm" role="alert">
          Failed to submit: {mutation.error.message}
        </p>
      )}

      {result && !result.isValid && (
        <p className="text-caret text-sm" role="alert">
          Session flagged — excluded from leaderboard
        </p>
      )}

      {result && result.isValid && (
        <p className="text-correct text-sm" role="status" aria-live="polite">
          Result saved to leaderboard
        </p>
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onViewLeaderboard}
          className="px-6 py-3 bg-bg-card text-text rounded-xl font-semibold hover:bg-bg-hover transition-colors"
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-bg-card rounded-xl p-4 sm:p-6 flex flex-col items-center gap-1 sm:gap-2">
      <span className="text-xs text-text-muted uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-xl sm:text-3xl font-bold font-mono ${color}`}>
        {value}
      </span>
    </div>
  );
}
