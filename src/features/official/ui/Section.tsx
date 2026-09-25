import { Children, type ReactNode } from "react";
import { keepNodeWords } from "../../../shared/lib/text";
import { useTheme } from "../theme";

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { tokens } = useTheme();
  return (
    <p className={`mb-3 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] ${tokens.label} ${className}`}>
      <span aria-hidden="true" className="h-0.5 w-7 rounded-full bg-theme-color-3" />
      {children}
    </p>
  );
}

export function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { tokens } = useTheme();
  return (
    <h2 className={`font-display text-3xl font-normal leading-snug tracking-tight sm:text-5xl ${tokens.h} ${className}`}>
      {Children.map(children, keepNodeWords)}
    </h2>
  );
}

/** Headline emphasis word, AA-compliant in both colour schemes. */
export function Em({ children }: { children: ReactNode }) {
  const { tokens } = useTheme();
  return <span className={tokens.em}>{children}</span>;
}
