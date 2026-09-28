// Simplified wordmarks used only to name brands this shop repairs.
// They are not official brand assets.

import type { ComponentType, ReactNode } from "react";

interface MarkProps {
  label: string;
  /** viewBox cropped to the drawn content (measured) so every logo fills its card evenly. */
  box: string;
  children: ReactNode;
}

function Mark({ label, box, children }: MarkProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={box}
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

interface WordProps {
  x: number | string;
  y?: number | string;
  size?: number | string;
  spacing?: number | string;
  weight?: number;
  fill?: string;
  children: ReactNode;
}

function Word({ x, y = 24, size = 15, spacing = 1.4, weight = 700, children, fill = "currentColor" }: WordProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={fill}
      fontFamily="'Inter Variable', Inter, Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={weight}
      letterSpacing={spacing}
    >
      {children}
    </text>
  );
}

function SamsungLogo() {
  return (
    <Mark label="Samsung" box="1.5 1.5 147 33">
      <ellipse cx="75" cy="18" rx="72" ry="15" fill="#1428A0" transform="rotate(-4 75 18)" />
      <Word x="75" y="23" size="14" spacing="2.2" weight={800} fill="#fff">SAMSUNG</Word>
    </Mark>
  );
}

function LgLogo() {
  return (
    <Mark label="LG" box="0.5 0.5 76 35">
      <circle cx="18" cy="18" r="16" fill="#A50034" />
      <path d="M12.2 10.5v10.8c0 1.5 1 2.4 2.5 2.4h3.2" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="21.4" cy="12.6" r="1.6" fill="#fff" />
      <path d="M26.5 18.4a8.6 8.6 0 1 1-2.2-6.1" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <Word x="60" y="25" size="21" spacing="0.5" weight={700} fill="#6B6B6B">LG</Word>
    </Mark>
  );
}

function SonyLogo() {
  return (
    <Mark label="Sony" box="9.8 4.5 72.5 25.5">
      <Word x="46" y="24" size="20" spacing="3.2" weight={700} fill="#000">SONY</Word>
    </Mark>
  );
}

function PanasonicLogo() {
  return (
    <Mark label="Panasonic" box="40.7 7.7 86.6 21">
      <Word x="84" y="24" size="16" spacing="0.4" weight={800} fill="#0049B0">Panasonic</Word>
    </Mark>
  );
}

function ToshibaLogo() {
  return (
    <Mark label="Toshiba" box="21.1 7.7 85.9 21">
      <Word x="64" y="24" size="16" spacing="1.6" fill="#E60026">TOSHIBA</Word>
    </Mark>
  );
}

function SharpLogo() {
  return (
    <Mark label="Sharp" box="15 6.4 80 22.9">
      <Word x="55" y="24" size="18" spacing="2.8" weight={800} fill="#E31C23">SHARP</Word>
    </Mark>
  );
}

function TclLogo() {
  return (
    <Mark label="TCL" box="12.8 3.6 52.4 27.4">
      <Word x="39" y="25" size="22" spacing="2.2" weight={800} fill="#E31C23">TCL</Word>
    </Mark>
  );
}

function HisenseLogo() {
  return (
    <Mark label="Hisense" box="30.2 7.1 69.6 22.3">
      <Word x="65" y="24" size="17" spacing="0.2" weight={800} fill="#00A9A5">Hisense</Word>
    </Mark>
  );
}

function PhilipsLogo() {
  return (
    <Mark label="Philips" box="12.5 2.5 100 27">
      <path d="M14 6.5 21 4l7 2.5v9.2c0 6.2-3.8 10.4-7 12.3-3.2-1.9-7-6.1-7-12.3V6.5Z" fill="#0B5CAB" />
      <path d="M21 7.2c2.4 0 3.6 1.5 3.6 3.3 0 1.4-.7 2.4-1.8 3l2.2 5.1h-2.1l-1.9-4.6h-.8v4.6H18.8V7.2H21Zm0 1.7h-.8v2.7h.8c.9 0 1.4-.5 1.4-1.35 0-.85-.5-1.35-1.4-1.35Z" fill="#fff" />
      <Word x="74" y="24" size="15" spacing="0.6" weight={800} fill="#0B5CAB">PHILIPS</Word>
    </Mark>
  );
}

function HaierLogo() {
  return (
    <Mark label="Haier" box="23.2 6.4 53.5 22.9">
      <Word x="50" y="24" size="18" spacing="1.1" fill="#0055A5">Haier</Word>
    </Mark>
  );
}

function SkyworthLogo() {
  return (
    <Mark label="Skyworth" box="31.3 7.7 77.4 21.2">
      <Word x="70" y="24" size="16" spacing="0.3" fill="#E31C23">Skyworth</Word>
    </Mark>
  );
}

function ChanghongLogo() {
  return (
    <Mark label="Changhong" box="30.9 9 88.1 19.7">
      <Word x="75" y="24" size="15" spacing="0.2" fill="#E31C23">Changhong</Word>
    </Mark>
  );
}

export const BRAND_LOGOS: readonly { id: string; Logo: ComponentType }[] = [
  { id: "samsung", Logo: SamsungLogo },
  { id: "lg", Logo: LgLogo },
  { id: "sony", Logo: SonyLogo },
  { id: "panasonic", Logo: PanasonicLogo },
  { id: "toshiba", Logo: ToshibaLogo },
  { id: "sharp", Logo: SharpLogo },
  { id: "tcl", Logo: TclLogo },
  { id: "hisense", Logo: HisenseLogo },
  { id: "philips", Logo: PhilipsLogo },
  { id: "haier", Logo: HaierLogo },
  { id: "skyworth", Logo: SkyworthLogo },
  { id: "changhong", Logo: ChanghongLogo },
];
