import { useEffect } from "react";

type Loader = () => Promise<unknown>;

// requestIdleCallback is missing in Safari, so both are optional at runtime.
interface IdleApi {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
}

/**
 * Warms lazy chunks once the browser is idle after first paint, so switching
 * tabs later is instant. Skipped when the visitor asked to save data.
 */
export function useIdlePrefetch(loaders: readonly Loader[]): void {
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return undefined;

    const win = window as unknown as IdleApi;
    const run = () => {
      for (const load of loaders) load().catch(() => undefined);
    };
    if (win.requestIdleCallback) {
      const handle = win.requestIdleCallback(run, { timeout: 4000 });
      return () => win.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(run, 2500);
    return () => window.clearTimeout(timer);
  }, [loaders]);
}
