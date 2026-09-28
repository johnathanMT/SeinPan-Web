import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Live height of an element (the fixed header changes with language and
 * breakpoint). Measured in a layout effect — before the browser paints — so
 * the page never renders with a guessed offset and then jumps (CLS).
 *
 * `estimate` should match the real height as often as possible: a wrong
 * guess costs a second render and a full-page layout before first paint.
 */
export function useElementHeight(ref: RefObject<HTMLElement | null>, estimate: number | (() => number)): number {
  const [height, setHeight] = useState(estimate);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setHeight(Math.ceil(el.getBoundingClientRect().height));
    update();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return height;
}
