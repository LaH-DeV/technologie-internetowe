import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Duration, Difficulty } from "@typeburn/shared";
import { api } from "../../../shared/api/client.js";
import {
  useTypingEngine,
  type TypingPhase,
} from "../hooks/use-typing-engine.js";
import { TextDisplay } from "./TextDisplay.js";
import { StatsBar } from "./StatsBar.js";

interface TypingTestProps {
  duration: Duration;
  difficulty: Difficulty;
  language: string;
  onFinish: (data: {
    textId: number;
    duration: Duration;
    elapsedMs: number;
    keystrokes: import("@typeburn/shared").Keystroke[];
    wpm: number;
    rawWpm: number;
    accuracy: number;
  }) => void;
  onPhaseChange?: (phase: TypingPhase) => void;
  onReadyChange?: (ready: boolean) => void;
}

export function TypingTest({
  duration,
  difficulty,
  language,
  onFinish,
  onPhaseChange,
  onReadyChange,
}: TypingTestProps) {
  const [textNonce, setTextNonce] = useState(0);
  const {
    data: textData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["text", difficulty, language, textNonce],
    queryFn: () => api.getText(difficulty, language),
    refetchOnWindowFocus: false,
  });

  const text = textData?.content ?? "";
  const firedRef = useRef(false);

  const {
    phase,
    input,
    timeLeft,
    elapsedMs,
    stats,
    keystrokes,
    mistakePositions,
    reset,
    handleKeyDown: handleEngineKeyDown,
  } = useTypingEngine(text, duration);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Report text readiness to parent
  const textReady = !isLoading && !error && !!textData;
  useEffect(() => {
    onReadyChange?.(textReady);
  }, [textReady, onReadyChange]);

  // Keep container focused so it receives keyboard input
  useEffect(() => {
    // Small delay ensures the DOM is settled after route transitions and data loads
    const id = requestAnimationFrame(() => {
      containerRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [phase, textNonce, text]);

  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    // Shortcuts for restart / new text (active when test is running or finished)
    if (phase !== "idle") {
      if (e.key === "Tab") {
        e.preventDefault();
        firedRef.current = false;
        reset();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        firedRef.current = false;
        reset();
        setTextNonce((n) => n + 1);
        return;
      }
    }
    // Forward to typing engine
    handleEngineKeyDown(e);
  };

  // Trigger onFinish when test completes
  if (phase === "finished" && textData && !firedRef.current) {
    firedRef.current = true;
    setTimeout(() => {
      onFinish({
        textId: textData.id,
        duration,
        elapsedMs,
        keystrokes,
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        accuracy: stats.accuracy,
      });
    }, 0);
  }

  const handleNewText = () => {
    firedRef.current = false;
    reset();
    setTextNonce((n) => n + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted text-lg">Loading text...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-incorrect text-lg" role="alert">
          Failed to load text test
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      autoFocus
      onKeyDown={handleContainerKeyDown}
      role="textbox"
      aria-label="Typing test area. Start typing to begin."
      aria-multiline="true"
      className="flex flex-col gap-4 sm:gap-8 outline-none"
    >
      <StatsBar stats={stats} timeLeft={timeLeft} phase={phase} />

      <div className="relative">
        <div className="bg-bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 min-h-[160px] sm:min-h-[200px] max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
          <TextDisplay
            text={text}
            input={input}
            mistakePositions={mistakePositions}
          />
        </div>
        {phase === "idle" && (
          <p
            className="absolute inset-0 flex items-center justify-center text-text text-sm font-medium bg-bg-card/60 rounded-2xl pointer-events-none"
            aria-live="polite"
          >
            Start typing to begin the test
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {phase !== "idle" && (
          <button
            onClick={() => {
              firedRef.current = false;
              reset();
            }}
            tabIndex={0}
            className="px-4 py-2 bg-bg-card text-text-muted rounded-lg hover:bg-bg-hover hover:text-text transition-colors font-medium text-sm"
          >
            Restart <kbd className="ml-1 text-xs opacity-50">tab</kbd>
          </button>
        )}
        <button
          onClick={handleNewText}
          tabIndex={0}
          className="px-4 py-2 bg-bg-card text-text-muted rounded-lg hover:bg-bg-hover hover:text-text transition-colors font-medium text-sm"
        >
          New text{" "}
          {phase !== "idle" && (
            <kbd className="ml-1 text-xs opacity-50">esc</kbd>
          )}
        </button>
      </div>
    </div>
  );
}
