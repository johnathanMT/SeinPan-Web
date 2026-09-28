import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * Four "exploded view" components that float above the board: a QFP chip, an
 * electrolytic capacitor, a toroidal coil and a colour-banded resistor.
 * Depth comes from gradients (painted once), never from animated filters.
 */

function useIds(...names: string[]): Record<string, string> {
  const base = useId().replace(/[^\w-]/g, "");
  return Object.fromEntries(names.map((n) => [n, `${n}${base}`]));
}

export function ChipArt() {
  const id = useIds("body", "pin", "shine");
  const pins = Array.from({ length: 8 }, (_, i) => 26 + i * 9.7);
  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id.body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34403D" />
          <stop offset="1" stopColor="#101413" />
        </linearGradient>
        <linearGradient id={id.pin} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E2AE" />
          <stop offset="1" stopColor="#B8873A" />
        </linearGradient>
        <linearGradient id={id.shine} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {pins.map((o) => (
        <g key={o} fill={`url(#${id.pin})`}>
          <rect x={o - 2} y={6} width={4} height={16} rx={1} />
          <rect x={o - 2} y={98} width={4} height={16} rx={1} />
          <rect x={6} y={o - 2} width={16} height={4} rx={1} />
          <rect x={98} y={o - 2} width={16} height={4} rx={1} />
        </g>
      ))}
      <rect x={18} y={18} width={84} height={84} rx={6} fill={`url(#${id.body})`} />
      <rect x={18} y={18} width={84} height={84} rx={6} fill={`url(#${id.shine})`} />
      <rect x={24} y={24} width={72} height={72} rx={3} fill="none" stroke="#fff" strokeOpacity="0.07" />
      <circle cx={32} cy={32} r={4} fill="#0A0D0C" stroke="#fff" strokeOpacity="0.12" />
      <text x={60} y={60} textAnchor="middle" fontSize={11} letterSpacing={2} fill="#E6C27A" fillOpacity="0.85" className="font-mono">
        SP-1989
      </text>
      <text x={60} y={75} textAnchor="middle" fontSize={7} letterSpacing={1.5} fill="#EAE0D0" fillOpacity="0.45" className="font-mono">
        YGN · 37Y
      </text>
    </svg>
  );
}

export function CapacitorArt() {
  const id = useIds("can", "top", "lead");
  return (
    <svg viewBox="0 0 60 150" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id.can} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0C2624" />
          <stop offset="0.38" stopColor="#2F7A72" />
          <stop offset="0.62" stopColor="#1F5A55" />
          <stop offset="1" stopColor="#0C2624" />
        </linearGradient>
        <radialGradient id={id.top} cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F4F1EA" />
          <stop offset="1" stopColor="#9C9A92" />
        </radialGradient>
        <linearGradient id={id.lead} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E8E8E" />
          <stop offset="0.5" stopColor="#F2F2F2" />
          <stop offset="1" stopColor="#8E8E8E" />
        </linearGradient>
      </defs>
      <rect x={18} y={96} width={3} height={52} rx={1.5} fill={`url(#${id.lead})`} />
      <rect x={39} y={96} width={3} height={44} rx={1.5} fill={`url(#${id.lead})`} />
      <rect x={6} y={8} width={48} height={92} rx={9} fill={`url(#${id.can})`} />
      <rect x={38} y={8} width={11} height={92} fill="#EAE0D0" fillOpacity="0.85" />
      {[26, 44, 62, 80].map((y) => (
        <rect key={y} x={41} y={y} width={5} height={2} rx={1} fill="#184542" />
      ))}
      <ellipse cx={30} cy={10} rx={24} ry={6} fill={`url(#${id.top})`} />
      <path d="M22 10 H38 M30 6 V14" stroke="#6E6C66" strokeWidth={1.4} />
      <text x={22} y={58} fontSize={7} fill="#EAE0D0" fillOpacity="0.8" transform="rotate(-90 22 58)" textAnchor="middle" className="font-mono">
        470µF
      </text>
    </svg>
  );
}

export function ToroidArt() {
  const id = useIds("core", "wire");
  const turns = 30;
  return (
    <svg viewBox="0 0 140 140" className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id={id.core} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.45" stopColor="#1A1512" />
          <stop offset="0.75" stopColor="#3B2A22" />
          <stop offset="1" stopColor="#1A1512" />
        </radialGradient>
        <linearGradient id={id.wire} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2B98E" />
          <stop offset="0.5" stopColor="#C77B4F" />
          <stop offset="1" stopColor="#7A3E22" />
        </linearGradient>
      </defs>
      <path d="M30 118 L14 136 M110 118 L126 136" stroke="#C77B4F" strokeWidth={3} strokeLinecap="round" />
      <circle cx={70} cy={66} r={44} fill="none" stroke={`url(#${id.core})`} strokeWidth={26} />
      {Array.from({ length: turns }, (_, i) => {
        const a = (i / turns) * Math.PI * 2;
        const [c, s] = [Math.cos(a), Math.sin(a)];
        return (
          <path
            key={i}
            d={`M${70 + c * 29} ${66 + s * 29} L${70 + c * 59} ${66 + s * 59}`}
            stroke={`url(#${id.wire})`}
            strokeWidth={4.2}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={70} cy={66} r={27} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth={2} />
    </svg>
  );
}

export function ResistorArt() {
  const id = useIds("body", "lead");
  const bands = [
    [44, "#6B3A1E"],
    [58, "#111"],
    [72, "#C0392B"],
    [92, "#D4AF37"],
  ] as const;
  return (
    <svg viewBox="0 0 160 40" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id.body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3DDB8" />
          <stop offset="0.55" stopColor="#D9B98A" />
          <stop offset="1" stopColor="#9E7D52" />
        </linearGradient>
        <linearGradient id={id.lead} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F2F2" />
          <stop offset="1" stopColor="#8E8E8E" />
        </linearGradient>
      </defs>
      <rect x={0} y={18.5} width={160} height={3} rx={1.5} fill={`url(#${id.lead})`} />
      <rect x={32} y={8} width={96} height={24} rx={12} fill={`url(#${id.body})`} />
      {bands.map(([x, color]) => (
        <rect key={x} x={x} y={8} width={7} height={24} fill={color} />
      ))}
      <rect x={36} y={11} width={88} height={5} rx={2.5} fill="#fff" fillOpacity="0.28" />
    </svg>
  );
}

interface FloatProps {
  children: ReactNode;
  className: string;
  /** Pointer-parallax travel in px (deeper = moves more). */
  depth: number;
  /** Levitation: vertical travel (px), tilt (deg), period and phase (s). */
  float: readonly [y: number, tilt: number, duration: number, delay: number];
  loop: boolean;
}

/** Positions a part, levitates it (full tier) and shifts it with the pointer. */
export function FloatingPart({ children, className, depth, float: [y, tilt, duration, delay], loop }: FloatProps) {
  const style = {
    "--depth": depth,
    "--lev-y": `-${y}px`,
    "--rot-a": `${-tilt * 0.3}deg`,
    "--rot-b": `${tilt}deg`,
    "--dur": `${duration}s`,
    "--delay": `${delay}s`,
  } as CSSProperties;
  return (
    <div className={`float-part absolute ${className}`} style={style}>
      <div className="float-depth">
        <div className={loop ? "perf-loop motion-safe:animate-levitate-solid" : undefined}>{children}</div>
        {/* Contact shadow: a pre-blurred gradient, no filter. */}
        <div className="mx-auto mt-2 h-3 w-3/4 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.28),transparent)]" />
      </div>
    </div>
  );
}
