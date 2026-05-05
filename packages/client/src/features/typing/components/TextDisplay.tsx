import { useEffect, useRef } from "react";

interface TextDisplayProps {
  text: string;
  input: string;
  mistakePositions: Set<number>;
}

export function TextDisplay({
  text,
  input,
  mistakePositions,
}: TextDisplayProps) {
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = caretRef.current;
    if (!el) return;
    const container = el.closest(".overflow-y-auto");
    if (!container) return;
    const lineHeight = el.offsetHeight;
    const elTop = el.offsetTop - container.scrollTop;
    const visibleBottom = container.clientHeight;
    if (elTop + lineHeight * 2 > visibleBottom) {
      container.scrollTop =
        el.offsetTop - container.clientHeight + lineHeight * 2;
    }
  }, [input.length]);

  return (
    <div className="font-mono text-base sm:text-2xl leading-relaxed select-none tracking-wide whitespace-pre-wrap break-all">
      {text.split("").map((char, i) => {
        let className: string;
        const isCurrentPos = i === input.length;

        if (i < input.length) {
          // Already typed
          if (input[i] !== char) {
            className = "text-incorrect bg-incorrect-bg rounded-sm";
          } else if (mistakePositions.has(i)) {
            className = "text-corrected bg-corrected-bg rounded-sm";
          } else {
            className = "text-correct";
          }
        } else {
          // Not yet typed
          className = "text-text-muted";
        }

        return (
          <span
            key={i}
            ref={isCurrentPos ? caretRef : undefined}
            className={`${className} ${isCurrentPos ? "border-l-2 border-caret motion-safe:animate-pulse" : ""}`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}
