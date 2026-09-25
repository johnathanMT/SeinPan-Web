import { ArrowUpRight, CheckCircle } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { SERVICES } from "../content";
import { WorkshopDecor } from "../decor/WorkshopDecor";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import { NavLink } from "../ui/NavLink";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { Em, SectionHeading, SectionLabel } from "../ui/Section";
import { ARROW_ICON, ARROW_LINK, BADGE } from "../ui/styles";

export function HomeServices() {
  const { t, list } = useOfficial();
  const { tokens: T } = useTheme();
  const [lead, ...rest] = SERVICES;
  const leadFeatures = list<string>(`services.${lead.id}.features`);

  return (
    <section className={`cv-auto relative px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="relative mx-auto max-w-6xl">
        <div className="relative lg:px-28 xl:px-36">
          <WorkshopDecor />
          <Reveal className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="lg:max-w-xl xl:max-w-2xl">
              <SectionLabel>{t("homeServices.label")}</SectionLabel>
              <SectionHeading>
                {t("homeServices.title")} <Em>{t("homeServices.titleEm")}</Em>
              </SectionHeading>
            </div>
            <NavLink to="services" className={`${ARROW_LINK} shrink-0 whitespace-nowrap ${T.accent}`}>
              {t("homeServices.all")}
              <ArrowUpRight size={15} className={ARROW_ICON} aria-hidden="true" />
            </NavLink>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-2 lg:grid-rows-2" stagger={0.12}>
          <RevealItem className="lg:row-span-2">
            <NavLink
              to="services"
              className="neon-card-dark group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-theme-color-1 p-8 text-left text-white shadow-md shadow-theme-color-4/15 hover:-translate-y-1 sm:p-10"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-theme-color-3/35 blur-3xl transition duration-500 group-hover:bg-theme-color-3/50" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-lines bg-[length:40px_40px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
              <span className="relative flex items-center justify-between">
                <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-2xl bg-theme-color-2 text-theme-color-4 shadow-md">
                  <lead.Icon size={24} />
                </span>
                <span className={BADGE}>{t(`services.${lead.id}.badge`)}</span>
              </span>
              <h3 className="relative mt-10 font-display text-4xl text-theme-color-2 sm:text-5xl">{t(`services.${lead.id}.short`)}</h3>
              <p className="relative mt-4 max-w-md text-sm leading-loose text-white sm:text-base">{keepWords(t(`services.${lead.id}.desc`))}</p>
              <ul className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {leadFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white">
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-theme-color-2" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-10 text-sm font-semibold text-theme-color-2">
                {t("homeServices.seeList")}
                <ArrowUpRight size={15} className={ARROW_ICON} aria-hidden="true" />
              </span>
            </NavLink>
          </RevealItem>

          {rest.map((svc) => (
            <RevealItem key={svc.id} className="h-full">
              <NavLink
                to="services"
                className={`group flex h-full w-full flex-col rounded-2xl border p-8 text-left transition duration-300 hover:-translate-y-1 ${T.card} ${T.cardHov}`}
              >
                <span className="flex items-center justify-between">
                  <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl bg-theme-color-1 text-theme-color-2 shadow-sm">
                    <svc.Icon size={20} />
                  </span>
                  <span className={BADGE}>{t(`services.${svc.id}.badge`)}</span>
                </span>
                <h3 className={`mt-6 font-display text-3xl ${T.h}`}>{t(`services.${svc.id}.short`)}</h3>
                <p className={`mt-3 text-sm leading-loose ${T.body}`}>{keepWords(t(`services.${svc.id}.desc`))}</p>
                <span className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold ${T.accent}`}>
                  {t("homeServices.seeList")}
                  <ArrowUpRight size={15} className={ARROW_ICON} aria-hidden="true" />
                </span>
              </NavLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
