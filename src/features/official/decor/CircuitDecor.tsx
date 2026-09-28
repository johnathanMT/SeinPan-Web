import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { useInViewOnce } from "../../../shared/hooks/useInViewOnce";
import { prefersReducedMotion } from "../../../shared/lib/motion";
import { getPerformanceTier } from "../../../shared/perf/tier";
import { useTheme } from "../theme";
import { BoardStrip, Packets, Rail } from "./circuit/Board";
import { CapacitorArt, ChipArt, FloatingPart, ResistorArt, ToroidArt } from "./circuit/FloatingParts";
import { BOTTOM, TOP } from "./circuit/geometry";
import { LENS_SIZE, useInspectionLight } from "./circuit/useInspectionLight";

/**
 * "The board powers on" — the About section's backdrop, loaded as its own
 * chunk when the section nears the viewport.
 *
 *  1. Assemble: traces draw in along the edges, then parts drop onto the
 *     board like a pick-and-place machine (one-off CSS transitions).
 *  2. Power on: status LEDs light in sequence and a gold inspection light
 *     sweeps the board once.
 *  3. Live (full tier): data packets run along the traces, LEDs blink, the
 *     pointer becomes an inspection lamp revealing gold copper, and four
 *     floating parts levitate and shift with the pointer.
 *
 * Budget: only transform/opacity loops (plus a few short dash offsets), no
 * animated filters, no React renders after mount, and every loop pauses
 * while the section is off-screen. The lite tier (phones, low-end devices,
 * reduced motion) keeps the assembled board and the one-off sweep only.
 */

type Palette = Record<"--c-trace" | "--c-pad" | "--c-silk" | "--c-body" | "--c-copper", string>;

const LIGHT: Palette = {
  "--c-trace": "rgba(24,69,66,0.42)",
  "--c-pad": "rgba(162,102,78,0.8)",
  "--c-silk": "rgba(104,44,44,0.55)",
  "--c-body": "#1E2A28",
  "--c-copper": "#B7764F",
};
const DARK: Palette = {
  "--c-trace": "rgba(234,224,208,0.22)",
  "--c-pad": "rgba(230,194,122,0.6)",
  "--c-silk": "rgba(234,224,208,0.45)",
  "--c-body": "#101816",
  "--c-copper": "#B7764F",
};
/** Copper under the inspection light. */
const GOLD: Palette = {
  "--c-trace": "#F0CF8A",
  "--c-pad": "#F6E2AE",
  "--c-silk": "rgba(246,226,174,0.9)",
  "--c-body": "#1E2A28",
  "--c-copper": "#E09A68",
};

const TOP_CLASS = "absolute inset-x-0 top-0 h-[200px] w-full sm:h-[260px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]";
const BOTTOM_CLASS = "absolute inset-x-0 bottom-0 h-[180px] w-full sm:h-[220px] [mask-image:linear-gradient(to_top,black_55%,transparent)]";
const RAIL_CLASS = "rail absolute top-[140px] bottom-[120px] w-[90px] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]";

/** The whole board: strips on the top and bottom edges, rails down the sides. */
function Board({ gleam = false, blink = false }: { gleam?: boolean; blink?: boolean }) {
  return (
    <>
      <div className="parallax-mid absolute inset-0">
        <BoardStrip strip={TOP} align="top" className={TOP_CLASS} gleam={gleam} blink={blink} />
      </div>
      <div className="parallax-near absolute inset-0">
        <BoardStrip strip={BOTTOM} align="bottom" className={BOTTOM_CLASS} gleam={gleam} blink={blink} />
      </div>
      <Rail className={`${RAIL_CLASS} left-0`} />
      <Rail className={`${RAIL_CLASS} right-0 -scale-x-100`} />
    </>
  );
}

/** Sets data-live while the section is on screen, so every loop pauses off-screen. */
function useLiveWhileVisible(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) el.dataset.live = "";
      else delete el.dataset.live;
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

export default function CircuitDecor() {
  const { isDark } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensInnerRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const drawn = useInViewOnce(rootRef, { threshold: 0.12 });
  const full = getPerformanceTier() === "full" && !prefersReducedMotion();

  useLiveWhileVisible(rootRef);
  useInspectionLight({ root: rootRef, lens: lensRef, lensInner: lensInnerRef, parallax: floatRef }, full);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-drawn={drawn || undefined}
      className="circuit-decor pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={(isDark ? DARK : LIGHT) as CSSProperties}
    >
      <Board blink={full} />

      {/* Power-on sweep: a band of gold light crosses the board once. */}
      <div className="circuit-sweep absolute inset-y-0 left-0 w-[240px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_45%,black_55%,transparent)]">
        <div className="circuit-sweep-inner absolute left-0 top-0 h-full w-[var(--w)]" style={GOLD as CSSProperties}>
          <Board gleam />
        </div>
      </div>

      {full && (
        <>
          <div className="absolute inset-0">
            <Packets strip={TOP} align="top" className={TOP_CLASS} />
          </div>
          <div className="absolute inset-0">
            <Packets strip={BOTTOM} align="bottom" className={BOTTOM_CLASS} />
          </div>

          {/* Inspection lamp: the lens moves, its content moves the other way. */}
          <div ref={lensRef} className="circuit-lens" style={{ width: LENS_SIZE, height: LENS_SIZE }}>
            <div ref={lensInnerRef} className="absolute left-0 top-0 will-change-transform" style={GOLD as CSSProperties}>
              <Board gleam />
            </div>
          </div>
        </>
      )}

      {/* Showpieces live in the side margins, which are ≥64px only from xl. */}
      <div ref={floatRef} className="float-layer parallax-near absolute inset-0 hidden xl:block">
        <FloatingPart className="right-1 top-[7%] w-14 min-[1400px]:right-[3%] min-[1400px]:w-24" depth={18} float={[10, 3, 14, 0]} loop={full}>
          <div className="relative">
            <div className="perf-glow absolute -inset-6 rounded-full bg-[radial-gradient(closest-side,rgba(126,232,224,0.35),transparent)] opacity-0 motion-safe:animate-glow-breathe" />
            <ChipArt />
          </div>
        </FloatingPart>
        <FloatingPart className="left-[1.2%] top-[36%] w-8 min-[1400px]:left-[3.5%] min-[1400px]:w-11" depth={26} float={[12, 6, 16, 0.4]} loop={full}>
          <CapacitorArt />
        </FloatingPart>
        <FloatingPart className="bottom-[9%] right-1 w-14 min-[1400px]:right-[3%] min-[1400px]:w-24" depth={12} float={[8, 4, 18, 1.1]} loop={full}>
          <ToroidArt />
        </FloatingPart>
        <FloatingPart className="bottom-[24%] left-0 w-16 -rotate-[68deg] min-[1400px]:left-[2.5%] min-[1400px]:w-24 min-[1400px]:-rotate-[18deg]" depth={22} float={[9, 5, 13, 0.8]} loop={full}>
          <ResistorArt />
        </FloatingPart>
      </div>
    </div>
  );
}
