import { lazy, Suspense, useRef } from "react";
import { ClipboardList, MapPin } from "lucide-react";
import { useInViewOnce } from "../../../shared/hooks/useInViewOnce";
import { keepWords } from "../../../shared/lib/text";
import { ABOUT_STAT_ICONS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import type { StatItem, TimelineItem } from "../types";
import { NavLink } from "../ui/NavLink";
import { RevealGroup, RevealItem } from "../ui/Reveal";
import { Em, SectionHeading, SectionLabel } from "../ui/Section";
import { CTA } from "../ui/styles";
import { TechPhoto } from "../ui/TechPhoto";

// Heavy animated SVG backdrop: its own chunk, fetched when the section nears the viewport.
const CircuitDecor = lazy(() => import("../decor/CircuitDecor"));

function DeferredCircuitDecor() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInViewOnce(ref, { rootMargin: "400px 0px" });
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {near && (
        <Suspense fallback={null}>
          <CircuitDecor />
        </Suspense>
      )}
    </div>
  );
}

export function About({ featured = false }: { featured?: boolean }) {
  const { t, list } = useOfficial();
  const { isDark, tokens: T } = useTheme();
  const timeline = list<TimelineItem>("about.timeline");
  const stats = list<StatItem>("about.stats");
  const glass = isDark
    ? "border border-white/20 bg-theme-color-1/55 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md"
    : "border border-white/50 bg-[#EAE0D0]/80 shadow-[0_10px_28px_rgba(104,44,44,0.08)] backdrop-blur-md";

  return (
    <section className={`relative overflow-hidden px-4 ${featured ? "cv-auto py-16 sm:py-20" : "min-h-screen py-20 sm:py-28"} ${T.altSec}`}>
      <DeferredCircuitDecor />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-theme-color-3/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-theme-color-1/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <RevealGroup className="space-y-6" stagger={0.1}>
            <RevealItem>
              <SectionLabel>{t("about.label")}</SectionLabel>
              <SectionHeading>
                {t("about.title")} <Em>{t("about.titleTrust")}</Em>
                {t("about.titleAfter")}
              </SectionHeading>
            </RevealItem>

            <RevealItem className={`flex gap-4 rounded-2xl border-l-4 border-theme-color-3 p-5 ${glass}`}>
              <MapPin size={20} className="mt-1 shrink-0 text-theme-color-3" aria-hidden="true" />
              <p className={`text-[15px] font-medium leading-loose sm:text-base ${T.h}`}>{keepWords(t("about.notice"))}</p>
            </RevealItem>

            <RevealItem className={`space-y-4 rounded-2xl p-5 text-[15px] leading-loose sm:p-6 sm:text-base ${glass} ${T.body}`}>
              <p>
                {keepWords(t("about.p1a"))} <strong className={`font-semibold ${T.h}`}>{t("about.p1name")}</strong> {t("about.p1b")}{" "}
                <strong className={`font-semibold ${T.h}`}>{t("about.p1year")}</strong> {keepWords(t("about.p1c"))}
              </p>
              <p>{keepWords(t("about.p2"))}</p>
              <p>
                {t("about.p3a")} <strong className={`font-semibold ${T.accent}`}>{t("about.p3place")}</strong>
                {keepWords(t("about.p3b"))}
              </p>
            </RevealItem>

            {!featured && (
              <RevealItem className={`flex items-center gap-4 rounded-2xl p-5 ${glass}`}>
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-theme-color-3 p-[3px]">
                  <TechPhoto sizes="64px" decorative />
                </div>
                <div>
                  <p className={`font-bold ${T.h}`}>{t("tech.name")}</p>
                  <p className={`text-xs ${T.muted}`}>{t("tech.role")}</p>
                  <p className={`mt-1 text-xs font-semibold ${T.accent}`}>{t("about.journey")}</p>
                </div>
              </RevealItem>
            )}

            <RevealItem>
              <NavLink to="inquiry" className={`${CTA} mt-2`}>
                <ClipboardList size={14} aria-hidden="true" />
                {t("about.book")}
              </NavLink>
            </RevealItem>
          </RevealGroup>

          <div className="relative">
            <div aria-hidden="true" className="absolute bottom-6 left-[1.2rem] top-6 w-0.5 bg-gradient-to-b from-theme-color-3 via-theme-color-1 to-transparent" />
            <RevealGroup as="ol" className="space-y-5" stagger={0.1}>
              {timeline.map(({ year, title, body }) => (
                <RevealItem as="li" key={year} className="relative pl-14">
                  <span aria-hidden="true" className="absolute left-0 top-5 grid h-10 w-10 place-items-center rounded-full bg-theme-color-1 shadow-md shadow-theme-color-4/15">
                    <span className="h-2.5 w-2.5 rounded-full bg-theme-color-2" />
                  </span>
                  <div className={`rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 ${glass}`}>
                    <p className={`font-display text-2xl ${T.em}`}>{year}</p>
                    <h3 className={`mt-1 text-base font-bold ${T.h}`}>{title}</h3>
                    <p className={`mt-2 text-sm leading-loose ${T.body}`}>{keepWords(body)}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        <RevealGroup as="ul" className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.08}>
          {ABOUT_STAT_ICONS.map((Icon, i) => (
            <RevealItem as="li" key={stats[i]?.label ?? i} className={`rounded-2xl px-4 py-7 text-center ${T.feature}`}>
              <div aria-hidden="true" className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-theme-color-3">
                <Icon size={18} className="text-white" />
              </div>
              <p className="font-display text-3xl text-theme-gold">{stats[i]?.value}</p>
              <p className="mt-1 text-xs text-white">{stats[i]?.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
