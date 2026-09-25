import { createContext, useContext } from "react";

/** Tailwind class strings for the current colour scheme. */
export interface ThemeTokens {
  page: string;
  sec: string;
  altSec: string;
  card: string;
  cardHov: string;
  feature: string;
  h: string;
  body: string;
  muted: string;
  label: string;
  accent: string;
  /** Emphasis colour for large headline words (≥3:1 on the section background). */
  em: string;
  /** Emphasis colour for small text (≥4.5:1). */
  emSmall: string;
  div: string;
  soft: string;
  chip: string;
  icon: string;
}

// Contrast ratios are verified against every surface these tokens sit on
// (cream page, tinted alt sections, translucent cards) — see docs/AUDIT.
const LIGHT: ThemeTokens = Object.freeze({
  page: "bg-theme-color-2 text-theme-color-4",
  sec: "bg-theme-color-2",
  altSec: "bg-theme-color-1/[0.08]",
  card: "border border-theme-color-4/10 bg-white/50 shadow-md shadow-theme-color-4/5",
  cardHov: "neon-card hover:border-theme-color-3/40",
  feature: "bg-theme-color-1 text-white shadow-md shadow-theme-color-4/10",
  h: "text-theme-color-4",
  body: "text-theme-color-4/90",
  muted: "text-theme-color-4/80",
  label: "text-theme-color-4",
  accent: "text-theme-color-4",
  em: "text-theme-color-3",
  emSmall: "text-theme-color-3-ink",
  div: "border-theme-color-4/10",
  soft: "border-theme-color-4/10 bg-theme-color-2/70",
  chip: "border-theme-color-4/10 bg-white/60 text-theme-color-4 shadow-sm",
  icon: "text-theme-color-3",
});

const DARK: ThemeTokens = Object.freeze({
  page: "bg-theme-color-4 text-theme-color-2",
  sec: "bg-theme-color-4",
  altSec: "bg-theme-color-1/40",
  card: "border border-theme-color-2/15 bg-white/5 shadow-sm",
  cardHov: "neon-card hover:border-theme-color-3/60",
  feature: "bg-theme-color-1 text-white shadow-md shadow-theme-color-4/10",
  h: "text-theme-color-2",
  body: "text-theme-color-2/90",
  muted: "text-theme-color-2/80",
  label: "text-theme-color-2",
  accent: "text-theme-color-2",
  em: "text-theme-gold",
  emSmall: "text-theme-gold",
  div: "border-theme-color-2/15",
  soft: "border-theme-color-2/10 bg-white/5",
  chip: "border-theme-color-2/15 bg-white/5 text-theme-color-2",
  icon: "text-theme-color-2",
});

export function getThemeTokens(isDark: boolean): ThemeTokens {
  return isDark ? DARK : LIGHT;
}


export interface ThemeContextValue {
  isDark: boolean;
  tokens: ThemeTokens;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  tokens: LIGHT,
  toggleTheme: () => {
    /* default: no provider mounted */
  },
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
