import { useNavigate } from "react-router-dom";
import type { useNickname } from "../shared/hooks/use-nickname";
import { generateNickname } from "../shared/utils/nickname-generator.js";

export function NicknamePage({
  nick,
}: {
  nick: ReturnType<typeof useNickname>;
}) {
  const navigate = useNavigate();
  const isNew = !nick.nickname;

  const handleSubmit = () => {
    if (nick.submit()) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-16">
      <h2 className="text-2xl font-bold">
        {isNew ? "Enter your nickname" : "Change nickname"}
      </h2>
      <p className="text-text-muted text-sm">
        {isNew
          ? "Pick a name for the leaderboard"
          : `Currently: ${nick.nickname}`}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nick.draft}
          onChange={(e) => nick.updateDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape" && !isNew) navigate("/");
          }}
          placeholder="nickname"
          aria-label="Enter your nickname"
          maxLength={20}
          autoFocus
          className="px-3 py-2 rounded-lg bg-bg-card text-text text-lg font-mono w-64 text-center border border-bg-hover focus:border-primary focus:outline-none placeholder:text-text-muted"
        />
        <button
          type="button"
          onClick={() => nick.updateDraft(generateNickname())}
          title="Generate random nickname"
          aria-label="Generate random nickname"
          className="px-2.5 py-2 rounded-lg bg-bg-card text-text-muted border border-bg-hover hover:bg-bg-hover hover:text-text transition-colors text-lg"
        >
          🎲
        </button>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!nick.draft.trim()}
          className="px-4 py-1.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isNew ? "Start" : "Save"}
        </button>
        {!isNew && (
          <button
            onClick={() => navigate("/")}
            className="px-4 py-1.5 bg-bg-card text-text-muted rounded-lg font-semibold text-sm hover:bg-bg-hover hover:text-text transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      <p className="text-text-muted text-xs">
        Letters, numbers, hyphens, underscores only
      </p>
    </div>
  );
}
