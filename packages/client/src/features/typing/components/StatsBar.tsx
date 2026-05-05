import type { TypingStats, TypingPhase } from "../hooks/use-typing-engine.js";

interface StatsBarProps {
  stats: TypingStats;
  timeLeft: number;
  phase: TypingPhase;
}

export function StatsBar({ stats, timeLeft, phase }: StatsBarProps) {
  const displayTime = phase === "idle" ? "--" : Math.ceil(timeLeft).toString();

  return (
    <div
      className="flex items-center justify-center gap-4 sm:gap-8 font-mono text-base sm:text-lg"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={
        phase === "idle"
          ? "Waiting to start"
          : `WPM: ${stats.wpm}, Accuracy: ${stats.accuracy.toFixed(1)}%, Time: ${displayTime}s`
      }
    >
      <Stat label="WPM" value={phase === "idle" ? "--" : stats.wpm} />
      <Stat
        label="ACC"
        value={phase === "idle" ? "--" : `${stats.accuracy.toFixed(1)}%`}
      />
      <Stat
        label="TIME"
        value={displayTime}
        highlight={timeLeft <= 5 && phase === "running"}
      />
      <Stat label="RAW" value={phase === "idle" ? "--" : stats.rawWpm} />
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-text-muted uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-lg sm:text-2xl font-bold tabular-nums min-w-[4ch] sm:min-w-[5.5ch] text-center ${highlight ? "text-incorrect animate-pulse" : "text-text"}`}
      >
        {value}
      </span>
    </div>
  );
}
