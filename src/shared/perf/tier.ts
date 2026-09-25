/**
 * Adaptive loading: decide once, at startup, how much decorative motion a
 * device should run. The result is written to <html data-perf="…"> so CSS
 * can switch purely decorative loops off (see styles/index.css) and code can
 * skip mounting expensive decor.
 *
 *  - lite: reduced-motion users, Save-Data, 2G, ≤4 GB RAM, ≤4 CPU cores,
 *          and touch phones (the common low-end Android case)
 *  - full: everything else
 */
export type PerformanceTier = "full" | "lite";

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
};

export function detectPerformanceTier(win: Window = window): PerformanceTier {
  const nav = win.navigator as NavigatorWithHints;
  const matches = (query: string): boolean => win.matchMedia(query).matches;

  if (matches("(prefers-reduced-motion: reduce)")) return "lite";
  if (nav.connection?.saveData) return "lite";
  if (/(^|-)2g$/.test(nav.connection?.effectiveType ?? "")) return "lite";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return "lite";
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4) {
    return "lite";
  }
  if (matches("(pointer: coarse)") && matches("(max-width: 767px)")) return "lite";
  return "full";
}

export function applyPerformanceTier(tier: PerformanceTier, root: HTMLElement = document.documentElement): void {
  root.dataset.perf = tier;
}

export function getPerformanceTier(root: HTMLElement = document.documentElement): PerformanceTier {
  return root.dataset.perf === "lite" ? "lite" : "full";
}
