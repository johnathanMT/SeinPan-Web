const QUERY = "(prefers-reduced-motion: reduce)";

/** One-off check (e.g. before starting an animation or a smooth scroll). */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}
