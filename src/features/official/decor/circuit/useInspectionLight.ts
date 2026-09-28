import { useEffect, type RefObject } from "react";

export const LENS_SIZE = 320;
const HALF = LENS_SIZE / 2;
const TOUCH_HOLD_MS = 1400;

interface Refs {
  root: RefObject<HTMLElement | null>;
  lens: RefObject<HTMLElement | null>;
  lensInner: RefObject<HTMLElement | null>;
  /** Receives --px/--py. Keep it small: custom properties inherit, so setting
   *  them on the root would restyle every board element on each move. */
  parallax: RefObject<HTMLElement | null>;
}

/**
 * The pointer becomes an inspection lamp: a lens that reveals the gold copy
 * of the board, plus a subtle parallax (--px/--py, -1…1) for floating parts.
 *
 * Zero React renders: listeners on the section write transforms straight to
 * the DOM once per animation frame. The lens and its counter-shifted content
 * are composited layers, so moving them never repaints the board.
 * It also keeps --w on the root (used by the one-off power-on sweep) and the
 * lens content sized to the root.
 */
export function useInspectionLight({ root, lens, lensInner, parallax }: Refs, enabled: boolean): void {
  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return undefined;

    const resize = () => {
      const { width, height } = rootEl.getBoundingClientRect();
      rootEl.style.setProperty("--w", `${Math.round(width)}px`);
      const inner = lensInner.current;
      if (inner) {
        inner.style.width = `${width}px`;
        inner.style.height = `${height}px`;
      }
    };
    resize();
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    ro?.observe(rootEl);

    const section = rootEl.closest("section");
    if (!enabled || !section) return () => ro?.disconnect();

    let frame = 0;
    let hideTimer = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      const rect = rootEl.getBoundingClientRect();
      const lx = x - rect.left;
      const ly = y - rect.top;
      const lensEl = lens.current;
      const inner = lensInner.current;
      if (lensEl && inner) {
        lensEl.style.transform = `translate3d(${lx - HALF}px, ${ly - HALF}px, 0)`;
        inner.style.transform = `translate3d(${HALF - lx}px, ${HALF - ly}px, 0)`;
        if (!("on" in lensEl.dataset)) lensEl.dataset.on = "";
      }
      parallax.current?.style.setProperty("--px", ((lx / rect.width) * 2 - 1).toFixed(3));
      parallax.current?.style.setProperty("--py", ((ly / rect.height) * 2 - 1).toFixed(3));
    };
    const schedule = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const hide = () => {
      if (lens.current) delete lens.current.dataset.on;
      parallax.current?.style.setProperty("--px", "0");
      parallax.current?.style.setProperty("--py", "0");
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") schedule(event);
    };
    // Touch has no hover: a tap lights the lamp briefly where the finger lands.
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      schedule(event);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hide, TOUCH_HOLD_MS);
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerdown", onDown, { passive: true });
    section.addEventListener("pointerleave", hide);
    return () => {
      ro?.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointerleave", hide);
    };
  }, [root, lens, lensInner, parallax, enabled]);
}
