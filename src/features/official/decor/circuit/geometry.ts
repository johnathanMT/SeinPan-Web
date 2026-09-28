/**
 * Board layout for the About-section circuit. Coordinates are in each
 * strip's own viewBox. Traces are listed as orthogonal waypoints and routed
 * with 45° chamfered corners, the way real PCB traces are drawn.
 */
export type Pt = readonly [x: number, y: number];

export interface Trace {
  points: readonly Pt[];
  /** Draw-in delay (s). */
  delay: number;
  /** Carries a travelling data packet (full tier only). */
  packet?: boolean;
}

export type PartKind = "qfp" | "soic" | "crystal" | "capTop" | "toroidTop" | "smd";

export interface Part {
  kind: PartKind;
  x: number;
  y: number;
  /** Silkscreen designator, e.g. "U1". */
  label?: string;
  rotate?: number;
  /** Pick-and-place drop delay (s). */
  delay: number;
}

export interface Led {
  x: number;
  y: number;
  /** Power-on delay (s). */
  delay: number;
  gold?: boolean;
}

export interface Strip {
  width: number;
  height: number;
  traces: readonly Trace[];
  vias: readonly Pt[];
  parts: readonly Part[];
  leds: readonly Led[];
  /** Board legend text: [x, y, text]. */
  legend?: readonly [number, number, string];
}

const CHAMFER = 10;

/** SVG path through `points`, cutting each corner at 45°. */
export function route(points: readonly Pt[], chamfer = CHAMFER): string {
  const [first, ...rest] = points;
  if (!first) return "";
  let d = `M${first[0]} ${first[1]}`;
  for (let i = 0; i < rest.length; i += 1) {
    const cur = rest[i];
    const prev = points[i];
    const next = rest[i + 1];
    if (!cur || !prev) continue;
    if (!next) {
      d += ` L${cur[0]} ${cur[1]}`;
      break;
    }
    const inX = Math.sign(cur[0] - prev[0]);
    const inY = Math.sign(cur[1] - prev[1]);
    const outX = Math.sign(next[0] - cur[0]);
    const outY = Math.sign(next[1] - cur[1]);
    d += ` L${cur[0] - inX * chamfer} ${cur[1] - inY * chamfer} L${cur[0] + outX * chamfer} ${cur[1] + outY * chamfer}`;
  }
  return d;
}

/** Last waypoint of a trace (where its via or pad sits). */
export function endOf(trace: Trace): Pt | undefined {
  return trace.points[trace.points.length - 1];
}

/**
 * Top edge of the section. Parts stay in the top ~110 units or in the gap
 * between the two content columns (x ≈ 575–680), so none sit under text;
 * the centre cluster (U1) is what phones see.
 */
export const TOP: Strip = {
  width: 1200,
  height: 260,
  traces: [
    { points: [[0, 70], [200, 70], [200, 100], [420, 100], [420, 60], [560, 60]], delay: 0, packet: true },
    { points: [[0, 24], [274, 24]], delay: 0.2 },
    { points: [[1200, 40], [1010, 40], [1010, 100], [760, 100], [760, 60], [640, 60]], delay: 0.1, packet: true },
    { points: [[1200, 150], [1080, 150], [1080, 210], [930, 210]], delay: 0.35 },
    { points: [[612, 108], [612, 140], [652, 140], [652, 240]], delay: 0.5, packet: true },
    { points: [[580, 0], [580, 32]], delay: 0.15 },
    { points: [[620, 0], [620, 32]], delay: 0.25 },
    { points: [[900, 0], [900, 40], [955, 40]], delay: 0.45 },
    { points: [[326, 24], [470, 24], [470, 60], [560, 60]], delay: 0.3 },
  ],
  vias: [[200, 70], [420, 100], [1010, 100], [760, 60], [1080, 150], [652, 240], [470, 60], [652, 140]],
  parts: [
    { kind: "qfp", x: 600, y: 70, label: "U1", delay: 1.1 },
    { kind: "soic", x: 300, y: 24, label: "U2", delay: 1.35 },
    { kind: "crystal", x: 910, y: 210, label: "Y1", delay: 1.5 },
    { kind: "capTop", x: 975, y: 40, label: "C1", delay: 1.25 },
    { kind: "smd", x: 632, y: 140, label: "R4", delay: 1.6 },
    { kind: "smd", x: 310, y: 100, label: "C3", delay: 1.7 },
    { kind: "smd", x: 100, y: 70, label: "R2", delay: 1.8 },
  ],
  leds: [
    { x: 652, y: 26, delay: 2.5 },
    { x: 346, y: 12, delay: 2.75, gold: true },
    { x: 872, y: 230, delay: 2.95 },
  ],
  legend: [1040, 80, "SEIN PAN · REV 1989"],
};

/** Bottom edge of the section. */
export const BOTTOM: Strip = {
  width: 1200,
  height: 220,
  traces: [
    { points: [[0, 170], [220, 170], [220, 120], [462, 120]], delay: 0.1, packet: true },
    { points: [[1200, 180], [960, 180], [960, 130], [766, 130]], delay: 0, packet: true },
    { points: [[600, 220], [600, 160], [650, 160]], delay: 0.3 },
    { points: [[1100, 220], [1100, 90], [1200, 90]], delay: 0.4 },
    { points: [[40, 220], [40, 80], [0, 80]], delay: 0.5 },
    { points: [[520, 120], [620, 120], [620, 80], [710, 80]], delay: 0.45 },
  ],
  vias: [[220, 170], [960, 180], [650, 160], [1100, 90], [40, 80], [620, 80]],
  parts: [
    { kind: "toroidTop", x: 490, y: 120, label: "L1", delay: 1.2 },
    { kind: "soic", x: 738, y: 130, label: "U3", delay: 1.4 },
    { kind: "smd", x: 330, y: 120, label: "C7", delay: 1.6 },
    { kind: "smd", x: 860, y: 180, label: "R9", delay: 1.7 },
    { kind: "capTop", x: 1160, y: 150, label: "C8", delay: 1.5 },
  ],
  leds: [
    { x: 778, y: 108, delay: 2.6, gold: true },
    { x: 528, y: 94, delay: 2.85 },
  ],
};

/** Vertical tile repeated down each side edge (mirrored on the right). */
export const RAIL = {
  width: 90,
  height: 360,
  traces: [
    [[0, 40], [52, 40], [52, 130], [22, 130], [22, 220]],
    [[0, 260], [66, 260], [66, 330]],
    [[34, 0], [34, 14]],
    [[90, 180], [72, 180], [72, 210]],
  ] as readonly (readonly Pt[])[],
  vias: [[22, 220], [66, 330], [52, 40], [72, 210]] as readonly Pt[],
  smd: [[52, 86]] as readonly Pt[],
} as const;
