import type { Difficulty } from "@typeburn/shared";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  disabled?: boolean;
  tabIndex?: number;
}

export function DifficultyPicker({
  value,
  onChange,
  disabled,
  tabIndex,
}: DifficultyPickerProps) {
  return (
    <div className="flex gap-2">
      {DIFFICULTIES.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          disabled={disabled}
          tabIndex={tabIndex}
          className={`
            px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors
            ${
              value === d
                ? "bg-primary text-white"
                : "bg-bg-card text-text-muted hover:bg-bg-hover hover:text-text"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {d}
        </button>
      ))}
    </div>
  );
}
