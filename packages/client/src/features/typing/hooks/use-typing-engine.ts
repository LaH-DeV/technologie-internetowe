import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { Duration, Keystroke } from "@typeburn/shared";
import {
  calculateWpm,
  calculateRawWpm,
  calculateAccuracy,
} from "@typeburn/shared";

export type TypingPhase = "idle" | "running" | "finished";

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface TypingEngineResult {
  phase: TypingPhase;
  input: string;
  timeLeft: number;
  elapsedMs: number;
  stats: TypingStats;
  keystrokes: Keystroke[];
  reset: () => void;
  mistakePositions: Set<number>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function useTypingEngine(
  text: string,
  durationSec: Duration,
): TypingEngineResult {
  const [phase, setPhase] = useState<TypingPhase>("idle");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(durationSec);

  const phaseRef = useRef<TypingPhase>("idle");
  const inputRef = useRef("");
  const startTimeRef = useRef(0);
  const finishedAtRef = useRef(0);
  const keystrokesRef = useRef<Keystroke[]>([]);
  const mistakePositionsRef = useRef<Set<number>>(new Set());
  const rafRef = useRef(0);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setInput("");
    setTimeLeft(durationSec);
    phaseRef.current = "idle";
    inputRef.current = "";
    startTimeRef.current = 0;
    finishedAtRef.current = 0;
    keystrokesRef.current = [];
    mistakePositionsRef.current = new Set();
  }, [durationSec]);

  // Reset when text or duration changes
  useEffect(() => {
    reset();
  }, [text, durationSec, reset]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent | KeyboardEvent) => {
      if (phaseRef.current === "finished") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Tab" || e.key === "Escape") return;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (inputRef.current.length > 0) {
          const newInput = inputRef.current.slice(0, -1);
          inputRef.current = newInput;
          setInput(newInput);
          keystrokesRef.current.pop();
        }
        return;
      }

      if (e.key.length !== 1) return;
      e.preventDefault();

      // Start on first printable character
      if (phaseRef.current === "idle") {
        startTimeRef.current = performance.now();
        phaseRef.current = "running";
        setPhase("running");
      }

      const currentInput = inputRef.current;
      if (currentInput.length >= text.length) return;

      const pos = currentInput.length;
      const charExpected = text[pos]!;

      keystrokesRef.current.push({
        charExpected,
        charTyped: e.key,
        timestampMs: Math.round(performance.now() - startTimeRef.current),
        correct: e.key === charExpected,
      });

      if (e.key !== charExpected) {
        mistakePositionsRef.current.add(pos);
      }

      const newInput = currentInput + e.key;
      inputRef.current = newInput;
      setInput(newInput);

      // Finished all text
      if (newInput.length >= text.length) {
        finishedAtRef.current = performance.now();
        phaseRef.current = "finished";
        setPhase("finished");
        cancelAnimationFrame(rafRef.current);
      }
    },
    [text],
  );

  // Timer tick
  useEffect(() => {
    if (phase !== "running") return;

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = durationSec - elapsed / 1000;

      if (remaining <= 0) {
        setTimeLeft(0);
        phaseRef.current = "finished";
        setPhase("finished");
        return;
      }

      setTimeLeft(remaining);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, durationSec]);

  // Compute stats — use actual elapsed time, capped at durationSec
  const maxMs = durationSec * 1000;
  const elapsedMs =
    phase === "idle"
      ? 0
      : phase === "finished"
        ? Math.min(
            (finishedAtRef.current || performance.now()) - startTimeRef.current,
            maxMs,
          )
        : (durationSec - timeLeft) * 1000;

  const ks = keystrokesRef.current;
  const correctChars = ks.filter((k) => k.correct).length;
  const incorrectChars = ks.length - correctChars;

  const stats: TypingStats = {
    wpm: calculateWpm(correctChars, elapsedMs),
    rawWpm: calculateRawWpm(ks.length, elapsedMs),
    accuracy: calculateAccuracy(ks),
    correctChars,
    incorrectChars,
    totalChars: ks.length,
  };

  return {
    phase,
    input,
    timeLeft,
    elapsedMs,
    stats,
    keystrokes: ks,
    mistakePositions: mistakePositionsRef.current,
    reset,
    handleKeyDown: handleKeyDown as (e: React.KeyboardEvent) => void,
  };
}
