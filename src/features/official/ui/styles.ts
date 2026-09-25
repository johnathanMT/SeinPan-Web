/** Shared class strings (one source of truth for repeated UI patterns). */

export const CTA =
  "neon-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-theme-color-3 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-theme-color-4/20 hover:scale-105 active:scale-100";

export const BADGE = "rounded-full bg-theme-color-3 px-3 py-1 text-xs font-bold text-white shadow-sm";

/** Outlined cream button, used on dark (teal / wood) surfaces. */
export const OUTLINE_ON_DARK =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-theme-color-2/70 px-7 py-3.5 text-sm font-semibold text-theme-color-2 transition hover:scale-105 hover:bg-theme-color-2 hover:text-theme-color-4";

/** Square icon button in the header (44px, 48px hit area). */
export const HEADER_ICON_BTN =
  "tap-48 grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-theme-color-2/25 text-theme-color-2 transition hover:bg-white/10";

/** Text link with a trailing arrow; 48px tall for touch. */
export const ARROW_LINK = "group inline-flex min-h-12 items-center gap-1.5 text-sm font-semibold";

export const ARROW_ICON = "transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

/** Third-party brand button (colours in tailwind.config: brand.*). */
export const BRAND_BUTTON =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md shadow-black/15 transition hover:-translate-y-0.5 hover:brightness-110";
