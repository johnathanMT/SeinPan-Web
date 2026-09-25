import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Live height of an element (the fixed header changes with language and
 * breakpoint). Measured in a layout effect — before the browser paints — so
 * the page never renders with a guessed offset and then jumps (CLS).
 */
export function useElementHeight(ref: RefObject<HTMLElement | null>, fallback: number): number {
  const [height, setHeight] = useState(fallback);
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
