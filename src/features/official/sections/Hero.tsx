import { useState, type CSSProperties } from "react";
import { ArrowUpRight, BadgeCheck, ClipboardList, Clock, Phone, Shield } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { LINKS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import type { StatItem } from "../types";
import { GlitchTitle } from "../ui/GlitchTitle";
import { NavLink } from "../ui/NavLink";
import { CTA } from "../ui/styles";
import { BEZEL, CABINET_SHADOW, CRT_RADIUS, CrtOverlay, TvKnob } from "../ui/Tv";

/* ── Floating studio dust (CSS keyframes on the compositor; off in the lite tier) ── */
interface Speck {
  x: string;
  y: string;
  s: number;
  d: number;
  dur: number;
  travel: number;
  far: boolean;
}

const STUDIO_DUST: readonly Speck[] = [
  { x: "7%", y: "24%", s: 5, d: 0, dur: 9, travel: 18, far: true },
  { x: "90%", y: "16%", s: 4, d: 1.3, dur: 11, travel: 14, far: true },
  { x: "46%", y: "8%", s: 3, d: 0.7, dur: 12, travel: 22, far: true },
  { x: "6%", y: "36%", s: 7, d: 0.4, dur: 8.5, travel: 10, far: false },
  { x: "92%", y: "32%", s: 6, d: 1.8, dur: 10, travel: 12, far: false },
  { x: "78%", y: "48%", s: 4, d: 2.2, dur: 9.4, travel: 8, far: false },
];

function speck(p: Speck) {
  const style = {
    left: p.x,
    top: p.y,
    width: p.s,
    height: p.s,
    "--travel": `-${p.travel}px`,
    "--dur": `${p.dur}s`,
    "--delay": `${p.d}s`,
  } as CSSProperties;
  return (
    <span
      key={`${p.x}-${p.y}`}
      style={style}
      className={`perf-loop absolute rounded-full opacity-20 motion-safe:animate-dust ${p.far ? "bg-theme-gold/40 blur-[1px]" : "bg-[#7ee8e0]/40 blur-md"}`}
    />
  );
}

function StudioDust() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {STUDIO_DUST.filter((p) => p.far).map(speck)}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {STUDIO_DUST.filter((p) => !p.far).map(speck)}
      </div>
    </>
  );
}

const STAT_BORDER = ["", "border-l", "border-t sm:border-l sm:border-t-0", "border-l border-t sm:border-t-0"];

const STANDBY_TITLE =
  "text-[#d9fff8] [text-shadow:0_0_6px_rgba(126,232,224,1),0_0_16px_rgba(45,212,191,0.9),0_0_32px_rgba(20,184,166,0.45)]";
const STANDBY_GOLD =
  "text-[#ffe7a3] [text-shadow:0_0_6px_rgba(230,194,122,1),0_0_16px_rgba(230,194,122,0.75),0_0_28px_rgba(174,112,87,0.4)]";
const STANDBY_BTN =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#7ee8e0]/80 bg-black/30 px-7 py-3.5 text-sm font-bold text-[#d9fff8] shadow-[0_0_18px_rgba(45,212,191,0.45),inset_0_0_14px_rgba(45,212,191,0.18)] [text-shadow:0_0_8px_rgba(126,232,224,0.95)] transition hover:scale-105 sm:w-auto";
const ON_TEL =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-theme-color-2/70 px-7 py-3.5 text-sm font-semibold text-theme-color-2 transition hover:scale-105 hover:bg-theme-color-2 hover:text-theme-color-4 sm:w-auto";
const STANDBY_TEL =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E6C27A]/80 bg-black/30 px-7 py-3.5 text-sm font-semibold text-[#ffe7a3] shadow-[0_0_16px_rgba(230,194,122,0.4)] [text-shadow:0_0_8px_rgba(230,194,122,0.9)] transition hover:scale-105 sm:w-auto";

/**
 * Hero, styled as a vintage television set. Above the fold, so nothing here
 * waits on JavaScript to become visible: the entrance is a CSS animation that
 * starts on the first frame (no delay to Largest Contentful Paint).
 */
export function Hero() {
  const { t, list } = useOfficial();
  const [isTvOn, setIsTvOn] = useState(true);
  const stats = list<StatItem>("hero.stats");
  const trust = [
    { Icon: Shield, label: t("hero.genuine") },
    { Icon: Clock, label: t("hero.sameDay") },
    { Icon: BadgeCheck, label: t("hero.noFee") },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-theme-color-1">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-theme-color-1" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_0%,transparent_36%,rgba(0,0,0,0.55)_100%)]" />
        {/* Radial gradients are already soft; the extra filter blur is only worth its cost on larger screens. */}
        <div className="absolute left-1/2 top-0 h-[40rem] w-[180%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(230,194,122,0.55)_0%,rgba(230,194,122,0.34)_52%,rgba(174,112,87,0.16)_74%,transparent_90%)] sm:blur-2xl" />
        <div className="absolute left-1/2 top-24 h-72 w-[78%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(126,232,224,0.28),transparent_68%)] sm:blur-3xl" />
        <div className="absolute inset-0 bg-grid-lines bg-[length:56px_56px] opacity-20 [mask-image:radial-gradient(ellipse_at_50%_30%,black_8%,transparent_62%)]" />
      </div>
      <StudioDust />

      <div className="relative mx-auto max-w-6xl px-3 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-6%] bottom-0 h-28 overflow-hidden [perspective:720px] sm:h-40">
          <div
            className="absolute left-1/2 top-0 h-[260%] w-[140%] -translate-x-1/2 origin-top [transform:rotateX(68deg)]"
            style={{
              backgroundImage: [
                "linear-gradient(to bottom, rgba(230,194,122,0.16), rgba(234,224,208,0.08) 28%, transparent 70%)",
                "linear-gradient(rgba(230,194,122,0.45) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(126,232,224,0.32) 1px, transparent 1px)",
              ].join(","),
              backgroundSize: "100% 100%, 48px 48px, 48px 48px",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16%, black 48%, transparent 92%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 16%, black 48%, transparent 92%)",
            }}
          />
        </div>

        <div className="relative z-10 motion-safe:animate-rise-in">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[calc(100%+0.15rem)] z-0 h-6 w-[62%] -translate-x-1/2 rounded-[100%] bg-black/80 opacity-70 blur-md motion-safe:animate-shadow-breathe sm:h-8 sm:w-[54%] sm:blur-lg"
          />
          <div className="relative will-change-transform motion-safe:animate-float-y">
            <div aria-hidden="true" className="pointer-events-none absolute -top-[4.25rem] left-1/2 h-[4.25rem] w-52 -translate-x-1/2 sm:-top-24 sm:h-24 sm:w-72">
              <span className="absolute bottom-2 left-1/2 h-20 w-[2px] origin-bottom -translate-x-1/2 -rotate-[32deg] rounded-full bg-gradient-to-t from-[#8F877B] to-[#EFE6D6] sm:bottom-3 sm:h-32 sm:w-[3px]">
                <span className="absolute -left-[3px] -top-1.5 h-2.5 w-2.5 rounded-full bg-[#EFE6D6] shadow sm:-left-[4px] sm:-top-2 sm:h-3 sm:w-3" />
              </span>
              <span className="absolute bottom-2 left-1/2 h-20 w-[2px] origin-bottom -translate-x-1/2 rotate-[32deg] rounded-full bg-gradient-to-t from-[#8F877B] to-[#EFE6D6] sm:bottom-3 sm:h-32 sm:w-[3px]">
                <span className="absolute -left-[3px] -top-1.5 h-2.5 w-2.5 rounded-full bg-[#EFE6D6] shadow sm:-left-[4px] sm:-top-2 sm:h-3 sm:w-3" />
              </span>
              <span className="absolute bottom-0 left-1/2 h-5 w-14 -translate-x-1/2 rounded-t-full bg-wood-grain shadow-[inset_0_2px_0_rgba(255,255,255,0.14)] sm:h-7 sm:w-20" />
            </div>

            <div className={`relative rounded-[1.75rem] bg-wood-grain p-2.5 sm:rounded-[2.75rem] sm:p-5 ${CABINET_SHADOW}`}>
              <div className="flex flex-col gap-2.5 sm:gap-5 lg:flex-row">
                <div className={`flex-1 rounded-[1.5rem] p-2 sm:rounded-[2.25rem] sm:p-4 ${BEZEL}`}>
                  <div
                    className={`relative isolate overflow-hidden transition-[background-color,box-shadow] duration-700 ${
                      isTvOn
                        ? "bg-crt-glow shadow-[inset_0_0_80px_rgba(0,0,0,0.65)] motion-safe:animate-crt-on"
                        : "bg-[#040605] shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]"
                    }`}
                    style={CRT_RADIUS}
                  >
                    <div
                      className={`relative z-10 flex flex-col items-center gap-6 px-4 py-12 text-center transition-colors duration-700 sm:gap-7 sm:px-10 sm:py-16 lg:py-20 ${
                        isTvOn ? "motion-safe:animate-crt-flicker" : ""
                      }`}
                    >
                      <p
                        className={`inline-flex items-center gap-3 text-xs font-semibold tracking-[0.3em] transition-all duration-700 sm:text-sm ${
                          isTvOn ? "text-theme-gold" : STANDBY_GOLD
                        }`}
                      >
                        <span aria-hidden="true" className="h-px w-8 bg-theme-gold/70 sm:w-12" />
                        {t("hero.since")}
                        <span aria-hidden="true" className="h-px w-8 bg-theme-gold/70 sm:w-12" />
                      </p>

                      <div>
                        <h1 className="px-2 font-display font-bold [text-wrap:balance]">
                          <span
                            className={`block py-1 text-5xl leading-relaxed transition-all duration-700 sm:text-7xl lg:text-8xl ${
                              isTvOn ? "text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.25)]" : STANDBY_TITLE
                            }`}
                          >
                            {t("hero.titleLine1")}
                          </span>
                          <GlitchTitle
                            text={t("hero.titleLine2")}
                            className="mt-1 block py-3 text-3xl leading-relaxed sm:text-5xl lg:text-6xl"
                            baseClassName={
                              isTvOn
                                ? "bg-gradient-to-r from-theme-gold-light via-theme-gold to-theme-gold-deep bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(230,194,122,0.35)]"
                                : STANDBY_GOLD
                            }
                          />
                        </h1>
                        <div aria-hidden="true" className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-theme-gold-deep via-theme-gold to-theme-gold-deep" />
                      </div>

                      <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row">
                        <NavLink to="inquiry" className={isTvOn ? `${CTA} w-full sm:w-auto` : STANDBY_BTN}>
                          <ClipboardList size={16} className="shrink-0" aria-hidden="true" />
                          <span>{keepWords(t("hero.quote"))}</span>
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </NavLink>
                        <a href={LINKS.tel} className={isTvOn ? ON_TEL : STANDBY_TEL}>
                          <Phone size={15} aria-hidden="true" />
                          {t("phone")}
                        </a>
                      </div>

                      <ul
                        className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs transition-all duration-700 sm:text-sm ${
                          isTvOn ? "text-white" : STANDBY_TITLE
                        }`}
                      >
                        {trust.map(({ Icon, label }) => (
                          <li key={label} className="inline-flex items-center gap-2">
                            <Icon size={14} className="text-theme-gold" aria-hidden="true" />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <CrtOverlay subtle={!isTvOn} roll={isTvOn} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-[1.1rem] bg-black/25 px-4 py-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] ring-1 ring-white/5 sm:rounded-[1.5rem] sm:px-6 lg:w-44 lg:flex-col lg:justify-start lg:gap-7 lg:rounded-[1.75rem] lg:px-4 lg:py-8">
                  <div aria-hidden="true" className="hidden text-center sm:block">
                    <p className="text-sm font-extrabold tracking-[0.3em] text-theme-gold">SEIN PAN</p>
                    <p className="mt-0.5 text-[9px] tracking-[0.35em] text-theme-color-2/60">EST. 1989</p>
                  </div>
                  <div
                    aria-hidden="true"
                    className="rounded-md bg-black px-3 py-1.5 font-mono text-sm font-bold tracking-[0.2em] text-theme-gold shadow-[inset_0_0_8px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] [text-shadow:0_0_8px_rgba(230,194,122,0.8)]"
                  >
                    MRTV
                  </div>
                  <div className="flex gap-4 lg:flex-col lg:gap-6">
                    <TvKnob angle={-40} label="CHANNEL" />
                    <TvKnob angle={55} label="VOLUME" />
                  </div>
                  <div aria-hidden="true" className="hidden h-10 w-24 rounded-lg bg-speaker-grille shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] sm:block lg:h-24 lg:w-full" />
                  <button
                    type="button"
                    onClick={() => setIsTvOn((on) => !on)}
                    aria-pressed={isTvOn}
                    aria-label={`POWER — ${t(isTvOn ? "hero.powerOff" : "hero.powerOn")}`}
                    className="-mx-2 flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-2 lg:mt-auto"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 rounded-full transition duration-500 ${
                        isTvOn ? "bg-theme-gold shadow-[0_0_12px_3px_rgba(230,194,122,0.95)]" : "bg-[#3a2a22] shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"
                      }`}
                    />
                    <span aria-hidden="true" className="text-[10px] font-semibold tracking-[0.25em] text-theme-color-2/80">
                      POWER
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="mx-auto flex w-[78%] justify-between">
              <span className="h-4 w-14 bg-[#3B1818] shadow-[0_12px_20px_rgba(0,0,0,0.5)] [clip-path:polygon(0_0,100%_0,82%_100%,18%_100%)] sm:h-6 sm:w-24" />
              <span className="h-4 w-14 bg-[#3B1818] shadow-[0_12px_20px_rgba(0,0,0,0.5)] [clip-path:polygon(0_0,100%_0,82%_100%,18%_100%)] sm:h-6 sm:w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:pb-24">
        <dl
          className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-md shadow-black/20 backdrop-blur-md motion-safe:animate-rise-in sm:grid-cols-4"
          style={{ animationDelay: "300ms" }}
        >
          {stats.map(({ value, label }, i) => (
            <div key={label} className={`flex flex-col-reverse border-white/15 px-4 py-6 text-center sm:py-8 ${STAT_BORDER[i] ?? ""}`}>
              <dt className="mt-1.5 text-xs tracking-wide text-white">{label}</dt>
              <dd className="font-display text-3xl font-bold text-theme-gold sm:text-4xl">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
