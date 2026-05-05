import { useState, useRef, useCallback } from "react";
import type { Duration, Difficulty, Keystroke } from "@typeburn/shared";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { TypingTest } from "../features/typing/components/TypingTest.js";
import type { TypingPhase } from "../features/typing/hooks/use-typing-engine.js";
import { ResultsScreen } from "../features/results/components/ResultsScreen.js";
import { DurationPicker } from "../shared/components/DurationPicker.js";
import { DifficultyPicker } from "../shared/components/DifficultyPicker.js";
import { LanguagePicker } from "../shared/components/LanguagePicker.js";
import type { useNickname } from "../shared/hooks/use-nickname.js";
import { useLanguage } from "../shared/hooks/use-language.js";

interface FinishData {
  textId: number;
  duration: Duration;
  elapsedMs: number;
  keystrokes: Keystroke[];
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

export function TypingPage({ nick }: { nick: ReturnType<typeof useNickname> }) {
  const navigate = useNavigate();
  const [duration, setDuration] = useState<Duration>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [language, setLanguage] = useLanguage();
  const [testPhase, setTestPhase] = useState<TypingPhase>("idle");
  const [textReady, setTextReady] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const finishDataRef = useRef<FinishData | null>(null);
  const hasFinishedRef = useRef(false);

  const settingsDisabled = testPhase !== "idle" || !textReady;
  const settingsTabIndex = settingsDisabled ? -1 : undefined;

  if (!nick.nickname) {
    return <Navigate to="/nickname" replace />;
  }

  const handleFinish = useCallback((data: FinishData) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    finishDataRef.current = data;
    setShowResults(true);
  }, []);

  const handlePlayAgain = () => {
    hasFinishedRef.current = false;
    finishDataRef.current = null;
    setShowResults(false);
  };

  if (showResults && finishDataRef.current) {
    return (
      <ResultsScreen
        textId={finishDataRef.current.textId}
        duration={finishDataRef.current.duration}
        elapsedMs={finishDataRef.current.elapsedMs}
        keystrokes={finishDataRef.current.keystrokes}
        nickname={nick.nickname}
        wpm={finishDataRef.current.wpm}
        rawWpm={finishDataRef.current.rawWpm}
        accuracy={finishDataRef.current.accuracy}
        onPlayAgain={handlePlayAgain}
        onViewLeaderboard={() => navigate("/leaderboard")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex justify-center gap-2">
        <Link
          to="/nickname"
          onClick={(e) => {
            if (settingsDisabled) {
              e.preventDefault();
              return;
            }
            nick.startEditing();
          }}
          tabIndex={settingsTabIndex}
          aria-disabled={settingsDisabled || undefined}
          className={`px-3 py-1 rounded-md bg-bg-card text-text-muted text-sm font-mono transition-colors ${
            settingsDisabled
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "hover:bg-bg-hover hover:text-text"
          }`}
          title="Change nickname"
        >
          {nick.nickname}
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <LanguagePicker
          value={language}
          onChange={setLanguage}
          disabled={settingsDisabled}
          tabIndex={settingsTabIndex}
        />
        <div className="w-px h-5 bg-bg-card hidden sm:block" />
        <DurationPicker
          value={duration}
          onChange={setDuration}
          disabled={settingsDisabled}
          tabIndex={settingsTabIndex}
        />
        <div className="w-px h-5 bg-bg-card hidden sm:block" />
        <DifficultyPicker
          value={difficulty}
          onChange={setDifficulty}
          disabled={settingsDisabled}
          tabIndex={settingsTabIndex}
        />
      </div>

      <TypingTest
        key={`${duration}-${difficulty}-${language}`}
        duration={duration}
        difficulty={difficulty}
        language={language}
        onFinish={handleFinish}
        onPhaseChange={setTestPhase}
        onReadyChange={setTextReady}
      />
    </div>
  );
}
