import { useCallback, useEffect, useRef, useState } from "react";
import { keepWords } from "../../../shared/lib/text";
import { prefersReducedMotion } from "../../../shared/hooks/usePrefersReducedMotion";

interface GlitchTitleProps {
  text: string;
  className?: string;
  baseClassName?: string;
}

/** One-shot CRT glitch on mount, on text change and on hover (CSS-driven). */
export function GlitchTitle({ text, className = "", baseClassName = "" }: GlitchTitleProps) {
  const [play, setPlay] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  const burst = useCallback(() => {
    if (prefersReducedMotion()) return;
    window.clearTimeout(timer.current);
    if (frame.current !== undefined) window.cancelAnimationFrame(frame.current);
    setPlay(false);
    frame.current = window.requestAnimationFrame(() => {
      setPlay(true);
      timer.current = window.setTimeout(() => setPlay(false), 800);
    });
  }, []);

  useEffect(() => {
    burst();
    return () => {
      window.clearTimeout(timer.current);
      if (frame.current !== undefined) window.cancelAnimationFrame(frame.current);
    };
  }, [text, burst]);

  const words = keepWords(text);
  return (
    <span className={`glitch-title ${play ? "glitch-title--play" : ""} ${className}`} onMouseEnter={burst}>
      <span className={`glitch-title__base ${baseClassName}`}>{words}</span>
      <span aria-hidden="true" className="glitch-title__slice glitch-title__slice--cyan">
        {words}
      </span>
      <span aria-hidden="true" className="glitch-title__slice glitch-title__slice--amber">
        {words}
      </span>
      <span aria-hidden="true" className="glitch-title__scan" />
    </span>
  );
}
