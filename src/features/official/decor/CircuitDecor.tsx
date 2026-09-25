import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "../../../shared/hooks/useInViewOnce";
import { getPerformanceTier } from "../../../shared/perf/tier";
import { useTheme } from "../theme";

/**
 * Animated PCB backdrop for the About section — loaded as its own chunk
 * when the section nears the viewport.
 *
 * Previous version: a JS scroll listener driving 3 parallax layers plus
 * 5 SVG pulses each re-rendering a triple drop-shadow filter every frame.
 * Now:
 *  - trace draw-in: CSS transition on stroke-dashoffset (pathLength="1")
 *  - parallax: CSS scroll-driven animation (off the main thread) where
 *    supported; static elsewhere, in the lite tier and for reduced motion
 *  - pulses: CSS stroke-dashoffset loop; glow drawn with a wide faint stroke
 *    instead of filters; not rendered at all in the lite tier
 *  - chip glow: a pre-blurred copy fading in/out (opacity is composited)
 */

const TEAL = "#184542";
const TERRACOTTA = "#AE7057";
const MAROON = "#682C2C";
const PULSE_TEAL = "#14B8A6";
const PULSE_GOLD = "#E6C27A";

interface Trace {
  d: string;
  gold: boolean;
  delay: number;
  pulse: boolean;
}

const TRACE_PATHS: readonly Trace[] = [
  { d: "M48 72 H168 V148 H292 V88 H420 V168 H548 V112 H692 V196", gold: false, delay: 0, pulse: true },
  { d: "M92 36 V128 H216 V248 H148 V348 H268 V428", gold: true, delay: 0.25, pulse: true },
  { d: "M752 48 V132 H608 V248 H728 V336 H580 V412", gold: false, delay: 0.4, pulse: false },
  { d: "M36 292 H156 V392 H288 V468 H400", gold: true, delay: 0.55, pulse: true },
  { d: "M360 52 V168 H488 V96 H560 V200 H640", gold: false, delay: 0.7, pulse: false },
  { d: "M720 220 H560 V320 H680 V400 H760", gold: true, delay: 0.85, pulse: true },
  { d: "M200 200 H320 V280 H240 V360", gold: false, delay: 1.0, pulse: false },
  { d: "M480 300 H620 V380 H520 V460 H700", gold: false, delay: 1.15, pulse: true },
];

const VIAS: readonly (readonly [number, number])[] = [
  [168, 72], [292, 148], [420, 88], [548, 168], [216, 128],
  [148, 348], [608, 132], [728, 248], [156, 292], [288, 392],
  [488, 168], [560, 320], [320, 200], [620, 300], [692, 112],
];

const CORNER_TRACES = ["M0 100 H80 V40 H0", "M800 80 H720 V20 H800", "M0 420 H100 V500 H0", "M800 440 H700 V510 H800"];

const MASK = "radial-gradient(ellipse 28% 24% at 38% 32%, transparent 0%, transparent 6%, black 42%)";

function FieldSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 800 520" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {children}
    </svg>
  );
}

function CircuitField() {
  return (
    <FieldSvg>
      <defs>
        <pattern id="pcb-micro" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke={TEAL} strokeWidth="0.6" opacity="0.45" />
        </pattern>
      </defs>
      <rect width="800" height="520" fill="url(#pcb-micro)" opacity="0.25" />

      {VIAS.map(([cx, cy], i) => (
        <g key={`${cx}-${cy}`} className="via">
          <circle cx={cx} cy={cy} r="3.2" fill="none" stroke={i % 2 ? TERRACOTTA : TEAL} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="1.6" fill={i % 2 ? TERRACOTTA : TEAL} />
        </g>
      ))}

      {TRACE_PATHS.map(({ d, gold, delay }) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          fill="none"
          stroke={gold ? TERRACOTTA : TEAL}
          strokeWidth="1.75"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="trace-draw"
          style={{ "--draw-delay": `${delay}s` } as CSSProperties}
        />
      ))}
    </FieldSvg>
  );
}

function EnergyPulses() {
  return (
    <FieldSvg>
      {TRACE_PATHS.filter((trace) => trace.pulse).map(({ d, gold, delay }) => {
        const stroke = gold ? PULSE_GOLD : PULSE_TEAL;
        const style = { "--dur": `${6.8 + delay}s`, "--delay": `${delay + 2.2}s` } as CSSProperties;
        const common = {
          d,
          fill: "none",
          stroke,
          strokeLinecap: "round" as const,
          strokeDasharray: "10 2400",
          opacity: 0,
          className: "perf-loop motion-safe:animate-pulse-travel",
          style,
        };
        return (
          <g key={d}>
            <path {...common} strokeWidth={16} strokeOpacity={0.12} />
            <path {...common} strokeWidth={9} strokeOpacity={0.28} />
            <path {...common} strokeWidth={4} />
          </g>
        );
      })}
    </FieldSvg>
  );
}

function MicrochipWire({ className = "" }: { className?: string }) {
  const pins = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
      <rect x="30" y="30" width="60" height="60" rx="2" stroke={TEAL} strokeWidth="1.75" />
      <rect x="38" y="38" width="44" height="44" rx="1" stroke={TEAL} strokeWidth="1.25" opacity="0.7" />
      <rect x="50" y="50" width="20" height="20" stroke={TERRACOTTA} strokeWidth="1.6" />
      <path d="M52 30 A8 8 0 0 0 68 30" stroke={TEAL} strokeWidth="1.5" />
      <circle cx="42" cy="42" r="2" stroke={TERRACOTTA} strokeWidth="1.5" />
      <path d="M54 56h12M60 50v12" stroke={MAROON} strokeWidth="1.4" opacity="0.85" />
      {pins.map((i) => {
        const o = 36 + i * 7.5;
        return (
          <g key={i} stroke={TERRACOTTA} strokeWidth="1.6">
            <path d={`M${o} 30 V18`} />
            <path d={`M${o} 90 V102`} />
            <path d={`M30 ${o} H18`} />
            <path d={`M90 ${o} H102`} />
          </g>
        );
      })}
    </svg>
  );
}

function CapacitorWire({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 140" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
      <path d="M32 8 V48" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M32 92 V132" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M14 48 H50" stroke={TERRACOTTA} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 58 H50" stroke={MAROON} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 72 H46" stroke={TEAL} strokeWidth="1.5" opacity="0.7" />
      <path d="M22 80 H42" stroke={TEAL} strokeWidth="1.5" opacity="0.5" />
      <circle cx="32" cy="8" r="2.2" stroke={TERRACOTTA} strokeWidth="1.5" />
      <circle cx="32" cy="132" r="2.2" stroke={TERRACOTTA} strokeWidth="1.5" />
    </svg>
  );
}

function CoilWire({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 64" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
      <path d="M4 32 H22" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M158 32 H176" stroke={TEAL} strokeWidth="1.75" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = 22 + i * 19.5;
        const b = 41.5 + i * 19.5;
        return <path key={i} d={`M${a} 32 C${a} 10, ${b} 10, ${b} 32 C${b} 54, ${a} 54, ${a} 32`} stroke={i % 2 ? TERRACOTTA : TEAL} strokeWidth="1.75" />;
      })}
      <circle cx="4" cy="32" r="2" stroke={MAROON} strokeWidth="1.5" />
      <circle cx="176" cy="32" r="2" stroke={MAROON} strokeWidth="1.5" />
    </svg>
  );
}

function BreathingChip({ className = "" }: { className?: string }) {
  return (
    <div className={`perf-loop opacity-40 motion-safe:animate-breathe ${className}`}>
      <MicrochipWire className="h-auto w-full" />
      <div className="perf-glow pointer-events-none absolute inset-0 opacity-0 motion-safe:animate-glow-breathe">
        <MicrochipWire className="h-auto w-full [filter:drop-shadow(0_0_14px_rgba(94,234,212,0.45))_drop-shadow(0_0_6px_rgba(230,194,122,0.35))]" />
      </div>
    </div>
  );
}

interface LevitateProps {
  children: ReactNode;
  className?: string;
  rotateAmp?: number;
  floatY?: number;
  duration?: number;
  delay?: number;
}

function LevitatingWire({ children, className = "", rotateAmp = 4, floatY = 10, duration = 14, delay = 0 }: LevitateProps) {
  const style = {
    "--lev-y": `-${floatY}px`,
    "--rot-a": `${-rotateAmp * 0.15}deg`,
    "--rot-b": `${rotateAmp}deg`,
    "--dur": `${duration}s`,
    "--delay": `${delay}s`,
  } as CSSProperties;
  return (
    <div style={style} className={`perf-loop opacity-40 motion-safe:animate-levitate ${className}`}>
      {children}
    </div>
  );
}

export default function CircuitDecor() {
  const { isDark } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const drawn = useInViewOnce(rootRef, { threshold: 0.15 });
  const lite = getPerformanceTier() === "lite";
  const overlay = isDark ? "mix-blend-overlay" : "";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-drawn={drawn || undefined}
      className="circuit-decor pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ WebkitMaskImage: MASK, maskImage: MASK }}
    >
      <div className={`parallax-far absolute inset-[-8%] opacity-40 ${overlay}`}>
        <CircuitField />
      </div>

      {!lite && (
        <div className="parallax-far-plain absolute inset-[-8%] opacity-90">
          <EnergyPulses />
        </div>
      )}

      <div className={`parallax-mid absolute inset-0 ${overlay} ${isDark ? "opacity-35" : "opacity-40"}`}>
        <FieldSvg>
          {CORNER_TRACES.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              fill="none"
              stroke={i % 2 ? TERRACOTTA : TEAL}
              strokeWidth="1.75"
              className="trace-draw"
              style={{ "--draw-delay": `${0.4 + i * 0.15}s`, "--draw-duration": "2.2s" } as CSSProperties}
            />
          ))}
        </FieldSvg>
      </div>

      <div className="parallax-near absolute inset-0">
        <BreathingChip className="absolute -right-1 top-4 w-12 sm:right-[2%] sm:top-[7%] sm:w-16 lg:w-[5.5rem] xl:right-[3.5%] xl:w-[6.5rem]" />
        <LevitatingWire className="absolute -left-1 top-[34%] w-8 sm:left-[1.5%] sm:w-10 xl:left-[2.5%] xl:w-12" rotateAmp={6} floatY={12} duration={16} delay={0.4}>
          <CapacitorWire className="h-auto w-full" />
        </LevitatingWire>
        <LevitatingWire className="absolute -right-2 bottom-[6%] w-28 sm:bottom-[9%] sm:right-[4%] sm:w-36 lg:w-40 xl:right-[6%] xl:w-48" rotateAmp={3} floatY={8} duration={18} delay={1.1}>
          <CoilWire className="h-auto w-full" />
        </LevitatingWire>
        <BreathingChip className="absolute -left-1 bottom-[16%] w-11 rotate-[8deg] sm:bottom-[18%] sm:left-[2%] sm:w-14 xl:w-16" />
        <LevitatingWire className="absolute right-1 top-[46%] w-7 -rotate-6 sm:right-[3%] sm:w-8 lg:w-9" rotateAmp={8} floatY={9} duration={13} delay={0.8}>
          <CapacitorWire className="h-auto w-full" />
        </LevitatingWire>
      </div>
    </div>
  );
}
