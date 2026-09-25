// src/components/canvas/HoloBackdrop.jsx
// Holographic gradient wash that sits BEHIND glass cards — blurred + dimmed
// so it reads as a subtle sheen, never a loud rainbow.
export function HoloBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-holo opacity-20 blur-3xl saturate-150" />
      <div className="absolute inset-0 bg-ink/70" />
    </div>
  );
}

export default HoloBackdrop;
