// src/components/canvas/CircuitTraces.jsx
// Faint PCB trace layer — the deepest, quietest brand layer (<= 8% opacity).
export function CircuitTraces() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-copper-500 opacity-[0.06]"
      aria-hidden
    >
      <defs>
        <pattern id="pcb" width="180" height="180" patternUnits="userSpaceOnUse">
          <path d="M10 10 H90 V70 H150" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 120 H60 V160" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M110 8 V56 H150" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="90" cy="70" r="3" fill="currentColor" />
          <circle cx="150" cy="70" r="3" fill="currentColor" />
          <circle cx="60" cy="160" r="3" fill="currentColor" />
          <circle cx="110" cy="8" r="3" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pcb)" />
    </svg>
  );
}

export default CircuitTraces;
