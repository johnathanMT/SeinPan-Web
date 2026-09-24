// Simplified wordmarks used only to name brands this shop repairs.
// They are not official brand assets.

function Mark({ label, width, children }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} 36`}
      className="h-8 w-auto sm:h-9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function Word({ x, y = 24, size = 15, spacing = 1.4, weight = 700, children, fill = 'currentColor' }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={fill}
      fontFamily="Inter, Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={weight}
      letterSpacing={spacing}
    >
      {children}
    </text>
  );
}

export function SamsungLogo() {
  return (
    <Mark label="Samsung" width="150">
      <ellipse cx="75" cy="18" rx="72" ry="15.5" fill="none" stroke="#1428A0" strokeWidth="2.2" />
      <Word x="75" y="23" size="13" spacing="2.4" fill="#1428A0">SAMSUNG</Word>
    </Mark>
  );
}

export function LgLogo() {
  return (
    <Mark label="LG" width="40">
      <circle cx="20" cy="18" r="16" fill="#A50034" />
      <path
        d="M13.2 11.2v11.4c0 1.6 1.1 2.6 2.7 2.6h3.1"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="22.6" cy="13.4" r="1.5" fill="#fff" />
      <path d="M16.6 22.6c2.4 1.6 6.2 1.6 8.4-.2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </Mark>
  );
}

export function SonyLogo() {
  return (
    <Mark label="Sony" width="92">
      <Word x="46" y="24" size="20" spacing="3.2" weight={600} fill="#111">SONY</Word>
    </Mark>
  );
}

export function PanasonicLogo() {
  return (
    <Mark label="Panasonic" width="168">
      <Word x="84" y="24" size="15" spacing="0.4" fill="#0049B0">Panasonic</Word>
    </Mark>
  );
}

export function ToshibaLogo() {
  return (
    <Mark label="Toshiba" width="128">
      <Word x="64" y="24" size="16" spacing="1.6" fill="#E60026">TOSHIBA</Word>
    </Mark>
  );
}

export function SharpLogo() {
  return (
    <Mark label="Sharp" width="110">
      <Word x="55" y="24" size="18" spacing="2.8" weight={800} fill="#E31C23">SHARP</Word>
    </Mark>
  );
}

export function TclLogo() {
  return (
    <Mark label="TCL" width="78">
      <Word x="39" y="25" size="22" spacing="2.2" weight={800} fill="#E31C23">TCL</Word>
    </Mark>
  );
}

export function HisenseLogo() {
  return (
    <Mark label="Hisense" width="130">
      <Word x="65" y="24" size="17" spacing="0.2" fill="#00B0EA">Hisense</Word>
    </Mark>
  );
}

export function PhilipsLogo() {
  return (
    <Mark label="Philips" width="132">
      <path d="M14 6.5 21 4l7 2.5v9.2c0 6.2-3.8 10.4-7 12.3-3.2-1.9-7-6.1-7-12.3V6.5Z" fill="#0B5CAB" />
      <path d="M21 7.2c2.4 0 3.6 1.5 3.6 3.3 0 1.4-.7 2.4-1.8 3l2.2 5.1h-2.1l-1.9-4.6h-.8v4.6H18.8V7.2H21Zm0 1.7h-.8v2.7h.8c.9 0 1.4-.5 1.4-1.35 0-.85-.5-1.35-1.4-1.35Z" fill="#fff" />
      <Word x="86" y="24" size="15" spacing="0.6" fill="#0B5CAB">PHILIPS</Word>
    </Mark>
  );
}

export function HaierLogo() {
  return (
    <Mark label="Haier" width="100">
      <Word x="50" y="24" size="18" spacing="1.1" fill="#0055A5">Haier</Word>
    </Mark>
  );
}

export function SkyworthLogo() {
  return (
    <Mark label="Skyworth" width="140">
      <Word x="70" y="24" size="16" spacing="0.3" fill="#E31C23">Skyworth</Word>
    </Mark>
  );
}

export function ChanghongLogo() {
  return (
    <Mark label="Changhong" width="150">
      <Word x="75" y="24" size="15" spacing="0.2" fill="#E31C23">Changhong</Word>
    </Mark>
  );
}

export const BRAND_LOGOS = [
  { id: 'samsung', Logo: SamsungLogo },
  { id: 'lg', Logo: LgLogo },
  { id: 'sony', Logo: SonyLogo },
  { id: 'panasonic', Logo: PanasonicLogo },
  { id: 'toshiba', Logo: ToshibaLogo },
  { id: 'sharp', Logo: SharpLogo },
  { id: 'tcl', Logo: TclLogo },
  { id: 'hisense', Logo: HisenseLogo },
  { id: 'philips', Logo: PhilipsLogo },
  { id: 'haier', Logo: HaierLogo },
  { id: 'skyworth', Logo: SkyworthLogo },
  { id: 'changhong', Logo: ChanghongLogo },
];
