import { ArrowUpRight, ClipboardList } from "lucide-react";
import { keepWords, toLocalDigits } from "../../../shared/lib/text";
import { PROCESS_ICONS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import type { StepItem } from "../types";
import { NavLink } from "../ui/NavLink";
import { Reveal } from "../ui/Reveal";
import { SectionHeading, SectionLabel } from "../ui/Section";
import { CTA } from "../ui/styles";

export function ProcessStrip() {
  const { t, list, lang } = useOfficial();
  const { isDark, tokens: T } = useTheme();
  const steps = list<StepItem>("process.steps");

  return (
    <section className={`cv-auto px-4 py-20 sm:py-28 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>{t("process.label")}</SectionLabel>
          <SectionHeading>{t("process.title")}</SectionHeading>
        </Reveal>
        <div className="relative mt-14">
          <div aria-hidden="true" className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-theme-color-3/60 to-transparent md:block" />
          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-6">
            {steps.map(({ title, body }, i) => {
              const Icon = PROCESS_ICONS[i] ?? ClipboardList;
              return (
                <Reveal as="li" key={title} delay={i * 120} className="flex flex-col items-center text-center">
                  <div
                    aria-hidden="true"
                    className={`relative grid h-16 w-16 place-items-center rounded-full bg-theme-color-1 text-theme-color-2 shadow-md shadow-theme-color-4/15 ring-8 ${
                      isDark ? "ring-theme-color-4" : "ring-theme-color-2"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-theme-color-3 text-xs font-bold text-white">
                      {toLocalDigits(i + 1, lang)}
                    </span>
                  </div>
                  <h3 className={`mt-6 text-lg font-bold ${T.h}`}>{title}</h3>
                  <p className={`mt-2 max-w-xs text-sm leading-loose ${T.body}`}>{keepWords(body)}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>
        <div className="mt-12 flex justify-center">
          <NavLink to="inquiry" className={CTA}>
            {t("process.start")}
            <ArrowUpRight size={14} aria-hidden="true" />
          </NavLink>
        </div>
      </div>
    </section>
  );
}
