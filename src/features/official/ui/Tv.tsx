/** Vintage-television building blocks shared by the hero, cards and closing band. */

export const CRT_RADIUS = { borderRadius: "clamp(1.25rem, 4vw, 2.75rem) / clamp(1rem, 3.2vw, 2.25rem)" } as const;

export const CABINET_SHADOW =
  "shadow-[0_50px_90px_-35px_rgba(0,0,0,0.8),inset_0_2px_0_rgba(255,255,255,0.14),inset_0_-6px_0_rgba(0,0,0,0.35)] ring-1 ring-black/40";

export const BEZEL = "bg-[#121212] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),inset_0_10px_30px_rgba(0,0,0,0.9)]";

export function CrtOverlay({ subtle = false, roll = true }: { subtle?: boolean; roll?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div className={`absolute inset-0 bg-scanlines ${subtle ? "opacity-25" : "opacity-60"}`} />
      {roll && (
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent motion-safe:animate-crt-roll" />
      )}
      <div className="absolute inset-0 bg-crt-vignette" />
      <div className="absolute inset-0 bg-crt-glass" />
    </div>
  );
}

/** Decorative knob. The engraved label is part of the illustration (aria-hidden). */
export function TvKnob({ angle = 0, small = false, label }: { angle?: number; small?: boolean; label?: string }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-1.5">
      <div
        className={`relative rounded-full bg-[conic-gradient(#EFE6D6,#9C9282,#EFE6D6,#9C9282,#EFE6D6)] shadow-[0_6px_10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.7)] ${
          small ? "h-7 w-7" : "h-11 w-11 lg:h-14 lg:w-14"
        }`}
      >
        <div className="absolute inset-[18%] rounded-full bg-gradient-to-b from-[#F4EDE1] to-[#B8AC98] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
        <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="absolute left-1/2 top-[9%] h-[30%] w-[3px] -translate-x-1/2 rounded-full bg-theme-color-4" />
        </div>
      </div>
      {label && <span className="hidden text-[9px] font-semibold tracking-[0.25em] text-theme-color-2/70 sm:block">{label}</span>}
    </div>
  );
}
