import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";

const BUTTON_THRESHOLD = 3;

interface LanguagePickerProps {
  value: string;
  onChange: (lang: string) => void;
  disabled?: boolean;
  tabIndex?: number;
}

export function LanguagePicker({
  value,
  onChange,
  disabled,
  tabIndex,
}: LanguagePickerProps) {
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => api.getLanguages(),
    staleTime: Infinity,
  });

  if (!languages || languages.length <= 1) return null;

  if (languages.length <= BUTTON_THRESHOLD) {
    return (
      <div className="flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            disabled={disabled}
            tabIndex={tabIndex}
            className={`
              px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
              ${
                value === lang.code
                  ? "bg-primary text-white"
                  : "bg-bg-card text-text-muted hover:bg-bg-hover hover:text-text"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {lang.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      tabIndex={tabIndex}
      aria-label="Language"
      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium
        bg-bg-card text-text border border-bg-hover
        focus:outline-none focus:ring-2 focus:ring-primary
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {value === "" && (
        <option value="" disabled>
          Language
        </option>
      )}
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
