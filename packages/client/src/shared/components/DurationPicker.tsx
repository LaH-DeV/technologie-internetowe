import type { Duration } from "@typeburn/shared";

const DURATIONS: Duration[] = [15, 30, 60];

interface DurationPickerProps {
  value: Duration;
  onChange: (d: Duration) => void;
  disabled?: boolean;
  tabIndex?: number;
}

export function DurationPicker({
  value,
  onChange,
  disabled,
  tabIndex,
}: DurationPickerProps) {
  return (
    <div className="flex gap-2">
      {DURATIONS.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          disabled={disabled}
          tabIndex={tabIndex}
          className={`
            px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-mono text-xs sm:text-sm font-medium transition-colors
            ${
              value === d
                ? "bg-primary text-white"
                : "bg-bg-card text-text-muted hover:bg-bg-hover hover:text-text"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {d}s
        </button>
      ))}
    </div>
  );
}
