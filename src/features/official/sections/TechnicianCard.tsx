import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { SKILL_ICONS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import { NavLink } from "../ui/NavLink";
import { Reveal } from "../ui/Reveal";
import { SectionLabel } from "../ui/Section";
import { ARROW_ICON, ARROW_LINK } from "../ui/styles";
import { TechPhoto } from "../ui/TechPhoto";
import { BEZEL, CABINET_SHADOW, CrtOverlay, TvKnob } from "../ui/Tv";

export function TechnicianCard() {
  const { t, list } = useOfficial();
  const { tokens: T } = useTheme();
  const skills = list<string>("tech.skills");
  const values = list<string>("tech.values");
  const stats: readonly [string | undefined, string][] = [
    [values[0], t("tech.repaired")],
    [values[1], t("tech.yearsShort")],
    [values[2], t("tech.genuine")],
  ];

  return (
    <section className={`overflow-x-clip px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-theme-color-3/25 via-transparent to-theme-color-1/30 blur-2xl" />
          <div className={`relative rounded-[2rem] bg-wood-grain p-3 ${CABINET_SHADOW}`}>
            <div className={`rounded-[1.6rem] p-2 ${BEZEL}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-theme-color-1" style={{ borderRadius: "1.4rem / 1.15rem" }}>
                <TechPhoto sizes="(min-width: 424px) 344px, calc(100vw - 72px)" />
                <CrtOverlay subtle roll={false} />
              </div>
            </div>
            <div aria-hidden="true" className="flex items-center justify-between px-2 pb-4 pt-3">
              <div className="h-7 w-28 rounded-md bg-speaker-grille shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" />
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-theme-gold shadow-[0_0_8px_2px_rgba(230,194,122,0.7)]" />
                <TvKnob small angle={-35} />
                <TvKnob small angle={50} />
              </div>
            </div>
          </div>
          <p className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-theme-color-3 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-color-4/25">
            <BadgeCheck size={16} className="text-white" aria-hidden="true" />
            {t("tech.years")}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <SectionLabel>{t("tech.label")}</SectionLabel>
          <h2 className={`font-display text-4xl leading-snug sm:text-5xl ${T.h}`}>{t("tech.name")}</h2>
          <p className={`mt-1 text-sm font-semibold sm:text-base ${T.accent}`}>{t("tech.role")}</p>
          <p className={`mt-5 max-w-xl text-base leading-loose ${T.body}`}>{keepWords(t("tech.bio"))}</p>

          <p className={`mt-8 text-xs font-semibold tracking-[0.14em] ${T.muted}`}>{t("tech.skillsLabel")}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SKILL_ICONS.map((Icon, i) => (
              <li key={skills[i] ?? i} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${T.chip}`}>
                <Icon size={12} className={T.icon} aria-hidden="true" />
                {skills[i]}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className={`flex flex-col-reverse rounded-2xl p-4 text-center ${T.feature}`}>
                <dt className="mt-1 text-xs text-white">{label}</dt>
                <dd className="font-display text-2xl font-bold text-theme-gold sm:text-3xl">{value}</dd>
              </div>
            ))}
          </dl>

          <NavLink to="about" className={`${ARROW_LINK} mt-6 ${T.accent}`}>
            {t("tech.story")}
            <ArrowUpRight size={15} className={ARROW_ICON} aria-hidden="true" />
          </NavLink>
        </Reveal>
      </div>
    </section>
  );
}
