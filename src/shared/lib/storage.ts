/**
 * localStorage access that never throws. Storage can be unavailable
 * (Safari private mode, disabled cookies, quota errors, sandboxed frames);
 * a preference that fails to persist must never break rendering.
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the preference simply won't persist */
  }
}
