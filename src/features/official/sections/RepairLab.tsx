import { Cpu } from "lucide-react";
import { keepWords, toLocalDigits } from "../../../shared/lib/text";
import { LAB_ICONS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import type { LabItem } from "../types";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { Em, SectionHeading, SectionLabel } from "../ui/Section";
import { BEZEL, CABINET_SHADOW, CrtOverlay, TvKnob } from "../ui/Tv";

// Four sine periods across a 480×60 box. The strip is twice the screen width
// and slides by half, so the loop is seamless.
const PERIOD = 120;
const WAVE = Array.from({ length: 4 }, (_, i) => {
  const x = i * PERIOD;
  return i === 0 ? `M0 30 C20 4 40 4 60 30 S100 56 120 30` : `S${x + 40} 4 ${x + 60} 30 S${x + 100} 56 ${x + 120} 30`;
}).join(" ");

/** Decorative bench oscilloscope in the same cabinet as the hero television. */
function BenchScope() {
  return (
    <div aria-hidden="true" className={`mx-auto w-full max-w-md rounded-2xl bg-wood-grain p-2.5 ${CABINET_SHADOW}`}>
      <div className={`rounded-xl p-1.5 ${BEZEL}`}>
        <div className="relative h-32 overflow-hidden rounded-lg bg-crt-glow sm:h-36">
          <div className="absolute inset-0 bg-grid-lines bg-[length:24px_24px]" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <div className="perf-loop absolute inset-y-4 left-0 w-[200%] motion-safe:animate-scope">
            <svg viewBox="0 0 480 60" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_0_5px_rgba(126,232,224,0.85)]">
              <path d={WAVE} fill="none" stroke="#7EE8E0" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <span className="absolute left-3 top-2 font-mono text-[10px] tracking-[0.2em] text-theme-gold">CH1 · 50 Hz</span>
          <span className="absolute right-3 top-2 font-mono text-[10px] tracking-[0.2em] text-[#7EE8E0]">SIGNAL OK</span>
          <CrtOverlay subtle roll={false} />
        </div>
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-2.5">
        <div className="h-5 w-24 rounded bg-speaker-grille shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" />
        <div className="flex items-center gap-2.5">
          <span className="perf-loop h-2 w-2 rounded-full bg-[#7EE8E0] shadow-[0_0_8px_2px_rgba(126,232,224,0.7)] motion-safe:animate-breathe" />
          <TvKnob small angle={-40} />
          <TvKnob small angle={25} />
          <TvKnob small angle={70} />
        </div>
      </div>
    </div>
  );
}

/**
 * The repair standard, shown as a rack of bench instruments. Every claim
 * here repeats one the site already makes (services, hero, trust strip).
 */
export function RepairLab() {
  const { t, list, lang } = useOfficial();
  const { isDark, tokens: T } = useTheme();
  const items = list<LabItem>("lab.items");

  return (
    <section className={`cv-auto relative overflow-hidden border-t px-4 py-20 sm:py-28 ${T.div} ${T.sec}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-theme-color-1/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-theme-color-3/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <SectionLabel>{t("lab.label")}</SectionLabel>
            <SectionHeading>
              {t("lab.title")} <Em>{t("lab.titleEm")}</Em>
            </SectionHeading>
            <p className={`mt-5 max-w-xl text-base leading-loose ${T.body}`}>{keepWords(t("lab.body"))}</p>
          </Reveal>
          <Reveal delay={150}>
            <BenchScope />
          </Reveal>
        </div>

        <RevealGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {items.map(({ title, body, tag }, i) => {
            const Icon = LAB_ICONS[i] ?? Cpu;
            return (
              <RevealItem as="li" key={title} className="h-full">
                <article
                  className={`neon-card-dark relative flex h-full flex-col overflow-hidden rounded-2xl bg-theme-color-1 p-6 text-white transition duration-300 hover:-translate-y-1 ${
                    isDark ? "ring-1 ring-theme-color-2/15" : "shadow-lg shadow-theme-color-4/15"
                  }`}
                >
                  <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-theme-gold/70 to-transparent" />
                  <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[length:32px_32px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
                  {/* Panel screws */}
                  <span aria-hidden="true" className="absolute left-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-white/20" />

                  <div className="relative flex items-center justify-between">
                    <div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-theme-color-4/60 ring-1 ring-theme-gold/30">
                      <Icon size={22} className="text-theme-gold" />
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-theme-gold-light">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#7EE8E0] shadow-[0_0_6px_1px_rgba(126,232,224,0.8)]" />
                      {tag}
                    </span>
                  </div>

                  <p aria-hidden="true" className="relative mt-6 font-display text-sm text-theme-gold/80">
                    {toLocalDigits(String(i + 1).padStart(2, "0"), lang)}
                  </p>
                  <h3 className="relative mt-1 text-lg font-bold leading-snug">{keepWords(title)}</h3>
                  <p className="relative mt-3 flex-1 text-[15px] leading-loose text-white/90">{keepWords(body)}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
