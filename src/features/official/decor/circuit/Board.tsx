import { useId, type CSSProperties } from "react";
import { endOf, RAIL, route, type Led, type Part, type Strip } from "./geometry";

/**
 * Board artwork, coloured through CSS variables set on the decor root
 * (--c-trace, --c-pad, --c-silk, --c-body, --c-copper). The inspection lens
 * renders the same components with gold variables, so the two always align.
 */

const trace: CSSProperties = { stroke: "var(--c-trace)" };
const pad: CSSProperties = { fill: "var(--c-pad)" };
const body: CSSProperties = { fill: "var(--c-body)" };
const silk: CSSProperties = { fill: "var(--c-silk)" };
const delayVar = (name: string, seconds: number) => ({ [name]: `${seconds}s` }) as CSSProperties;

/** Unique, url()-safe id for SVG defs (the lens renders a second copy). */
function useSvgId(prefix: string): string {
  return `${prefix}${useId().replace(/[^\w-]/g, "")}`;
}

function Pins({ count, pitch, length, side, size }: { count: number; pitch: number; length: number; side: "x" | "y"; size: number }) {
  const start = -((count - 1) * pitch) / 2;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const o = start + i * pitch;
        return side === "x" ? (
          <g key={i} style={pad}>
            <rect x={o - 1.5} y={-size / 2 - length} width={3} height={length} />
            <rect x={o - 1.5} y={size / 2} width={3} height={length} />
          </g>
        ) : (
          <g key={i} style={pad}>
            <rect x={-size / 2 - length} y={o - 1.5} width={length} height={3} />
            <rect x={size / 2} y={o - 1.5} width={length} height={3} />
          </g>
        );
      })}
    </>
  );
}

function PartShape({ kind }: { kind: Part["kind"] }) {
  switch (kind) {
    case "qfp":
      return (
        <>
          <Pins count={8} pitch={7} length={8} side="x" size={60} />
          <Pins count={8} pitch={7} length={8} side="y" size={60} />
          <rect x={-30} y={-30} width={60} height={60} rx={4} style={body} />
          <rect x={-25} y={-25} width={50} height={50} rx={2} fill="none" stroke="rgba(255,255,255,0.08)" />
          <circle cx={-19} cy={-19} r={3} fill="rgba(255,255,255,0.18)" />
          <text x={0} y={3} textAnchor="middle" fontSize={8} letterSpacing={1.5} style={silk} className="font-mono">
            SP-89
          </text>
        </>
      );
    case "soic":
      return (
        <>
          <Pins count={4} pitch={9} length={6} side="x" size={22} />
          <rect x={-23} y={-11} width={46} height={22} rx={2} style={body} />
          <circle cx={-17} cy={-5} r={1.8} fill="rgba(255,255,255,0.2)" />
        </>
      );
    case "crystal":
      return (
        <>
          <rect x={-20} y={-8} width={40} height={16} rx={8} style={body} />
          <rect x={-15} y={-4} width={30} height={8} rx={4} fill="none" style={{ stroke: "var(--c-pad)" }} strokeWidth={1.2} />
        </>
      );
    case "capTop":
      return (
        <>
          <circle r={16} style={body} />
          <circle r={12} fill="none" style={{ stroke: "var(--c-silk)" }} strokeWidth={1} />
          <path d="M-6 0 H6 M0 -6 V6" style={{ stroke: "var(--c-silk)" }} strokeWidth={1.2} />
          <path d="M-16 0 A16 16 0 0 1 -11.3 -11.3" fill="none" style={{ stroke: "var(--c-pad)" }} strokeWidth={3} />
        </>
      );
    case "toroidTop":
      return (
        <>
          <circle r={24} fill="none" style={{ stroke: "var(--c-copper)" }} strokeWidth={13} />
          {Array.from({ length: 20 }, (_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const [c, s] = [Math.cos(a), Math.sin(a)];
            return <path key={i} d={`M${c * 17} ${s * 17} L${c * 31} ${s * 31}`} style={{ stroke: "var(--c-body)" }} strokeWidth={1.2} opacity={0.55} />;
          })}
          <circle r={9} style={body} />
        </>
      );
    case "smd":
      return (
        <>
          <rect x={-9} y={-4} width={18} height={8} rx={1} style={body} />
          <rect x={-9} y={-4} width={4} height={8} style={pad} />
          <rect x={5} y={-4} width={4} height={8} style={pad} />
        </>
      );
  }
}

const LABEL_OFFSET: Record<Part["kind"], number> = { qfp: 50, soic: 26, crystal: 20, capTop: 28, toroidTop: 44, smd: 16 };

function MountedPart({ part }: { part: Part }) {
  const { kind, x, y, label, rotate = 0, delay } = part;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="pnp" style={delayVar("--pnp-delay", delay)}>
        <PartShape kind={kind} />
      </g>
      {label && (
        <text x={0} y={LABEL_OFFSET[kind]} textAnchor="middle" fontSize={9} letterSpacing={1} style={silk} className="via font-mono">
          {label}
        </text>
      )}
    </g>
  );
}

function StatusLed({ led, blink }: { led: Led; blink: boolean }) {
  const color = led.gold ? "#E6C27A" : "#7EE8E0";
  const style = delayVar("--led-delay", led.delay);
  return (
    <g transform={`translate(${led.x} ${led.y})`}>
      <g className={blink ? "perf-loop motion-safe:animate-led-blink" : undefined} style={{ animationDelay: `${led.delay + 1.2}s` }}>
        <circle r={9} fill={color} className="led-halo" style={style} opacity={0} />
        <rect x={-3.5} y={-2.5} width={7} height={5} rx={1} fill={color} className="led" style={style} />
      </g>
    </g>
  );
}

interface StripProps {
  strip: Strip;
  className: string;
  align: "top" | "bottom";
  /** Gold copy inside the inspection lens: adds a soft halo under each trace. */
  gleam?: boolean;
  /** LEDs blink after power-on (full tier). */
  blink?: boolean;
}

export function BoardStrip({ strip, className, align, gleam = false, blink = false }: StripProps) {
  const { width, height, traces, vias, parts, leds, legend } = strip;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={align === "top" ? "xMidYMin slice" : "xMidYMax slice"}
      className={className}
      aria-hidden="true"
    >
      {gleam &&
        traces.map(({ points }) => (
          <path key={`h${points.join()}`} d={route(points)} fill="none" stroke="rgba(230,194,122,0.28)" strokeWidth={7} strokeLinecap="round" />
        ))}
      {traces.map((t) => (
        <path
          key={t.points.join()}
          d={route(t.points)}
          pathLength={1}
          fill="none"
          strokeWidth={gleam ? 1.8 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="trace-draw"
          style={{ ...trace, "--draw-delay": `${t.delay}s`, "--draw-duration": "1.6s" } as CSSProperties}
        />
      ))}
      {[...vias, ...traces.map(endOf).filter((p) => p !== undefined)].map(([cx, cy], i) => (
        <g key={`${cx}-${cy}-${i}`} className="via">
          <circle cx={cx} cy={cy} r={4.2} fill="none" style={{ stroke: "var(--c-pad)" }} strokeWidth={1.6} />
          <circle cx={cx} cy={cy} r={1.5} style={pad} />
        </g>
      ))}
      {parts.map((part) => (
        <MountedPart key={`${part.kind}-${part.x}-${part.y}`} part={part} />
      ))}
      {leds.map((led) => (
        <StatusLed key={`${led.x}-${led.y}`} led={led} blink={blink} />
      ))}
      {legend && (
        <text x={legend[0]} y={legend[1]} fontSize={9} letterSpacing={2.5} style={silk} className="via font-mono">
          {legend[2]}
        </text>
      )}
    </svg>
  );
}

/** Data packets running along the traces that carry one (full tier only). */
export function Packets({ strip, className, align }: Omit<StripProps, "gleam" | "blink">) {
  return (
    <svg
      viewBox={`0 0 ${strip.width} ${strip.height}`}
      preserveAspectRatio={align === "top" ? "xMidYMin slice" : "xMidYMax slice"}
      className={className}
      aria-hidden="true"
    >
      {strip.traces
        .filter((t) => t.packet)
        .map((t, i) => {
          const style = { animationDelay: `${3 + i * 1.3}s`, animationDuration: `${4.2 + i * 0.7}s` } as CSSProperties;
          const common = { d: route(t.points), pathLength: 1, fill: "none", strokeLinecap: "round" as const, strokeDasharray: "0.05 2", className: "perf-loop motion-safe:animate-packet", style };
          return (
            <g key={t.points.join()}>
              <path {...common} stroke="#7EE8E0" strokeWidth={8} strokeOpacity={0.18} />
              <path {...common} stroke="#E6F7F5" strokeWidth={2.5} />
            </g>
          );
        })}
    </svg>
  );
}

/** A side edge: the rail tile repeated down the full section height. */
export function Rail({ className }: { className: string }) {
  const id = useSvgId("rail");
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id={id} width={RAIL.width} height={RAIL.height} patternUnits="userSpaceOnUse">
          {RAIL.traces.map((points) => (
            <path key={points.join()} d={route(points, 8)} fill="none" style={trace} strokeWidth={1.5} strokeLinecap="round" />
          ))}
          {RAIL.vias.map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r={4} fill="none" style={{ stroke: "var(--c-pad)" }} strokeWidth={1.5} />
              <circle cx={cx} cy={cy} r={1.4} style={pad} />
            </g>
          ))}
          {RAIL.smd.map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(90)`}>
              <rect x={-9} y={-4} width={18} height={8} rx={1} style={body} />
              <rect x={-9} y={-4} width={4} height={8} style={pad} />
              <rect x={5} y={-4} width={4} height={8} style={pad} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
