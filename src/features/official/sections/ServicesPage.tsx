import { useId, useState } from "react";
import { ArrowUpRight, CheckCircle, ChevronDown, Send } from "lucide-react";
import { SERVICES, TRUST_ICONS, type ServiceId, type ServiceMeta } from "../content";
import { WorkshopDecor } from "../decor/WorkshopDecor";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import { NavLink } from "../ui/NavLink";
import { Em, SectionHeading, SectionLabel } from "../ui/Section";
import { BADGE, CTA } from "../ui/styles";

function ServiceCard({ svc, open, onToggle }: { svc: ServiceMeta; open: boolean; onToggle: () => void }) {
  const { t, list } = useOfficial();
  const { tokens: T } = useTheme();
  const listId = useId();
  const features = list<string>(`services.${svc.id}.features`);

  return (
    <article className={`neon-card group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${T.card} ${T.cardHov}`}>
      <div aria-hidden="true" className={`h-1.5 w-full ${svc.accentClass}`} />
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between">
          <div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-theme-color-1 text-theme-color-2 shadow-sm transition group-hover:scale-105">
            <svc.Icon size={22} />
          </div>
          <span className={BADGE}>{t(`services.${svc.id}.badge`)}</span>
        </div>

        <h3 className={`mt-4 text-lg font-bold ${T.h}`}>{t(`services.${svc.id}.label`)}</h3>
        <p className={`mt-2 flex-1 text-sm leading-relaxed ${T.body}`}>{t(`services.${svc.id}.desc`)}</p>

        {/* The ::after stretches the button over the whole card, so a tap anywhere toggles it. */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={listId}
          className={`mt-2 flex min-h-12 items-center gap-1.5 self-start text-xs font-semibold underline-offset-4 transition after:absolute after:inset-0 after:content-[''] hover:underline ${T.accent}`}
        >
          {open ? t("services.hide") : t("services.see")}
          <ChevronDown size={12} aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        <ul id={listId} hidden={!open} className={`mt-2 space-y-2 border-t pt-4 ${T.div}`}>
          {features.map((f) => (
            <li key={f} className={`flex items-center gap-2 text-xs ${T.body}`}>
              <CheckCircle size={12} className={`shrink-0 ${T.icon}`} aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const { t, list } = useOfficial();
  const { tokens: T } = useTheme();
  const [expanded, setExpanded] = useState<ServiceId | null>(null);
  const trust = list<string>("trust");

  return (
    <section className={`relative min-h-screen px-4 py-20 sm:py-28 ${T.sec}`}>
      <div className="relative mx-auto max-w-6xl">
        <div className="relative lg:px-28 xl:px-36">
          <WorkshopDecor />
          <div className="relative z-10 max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <SectionLabel>{t("services.pageLabel")}</SectionLabel>
            <SectionHeading>
              {t("services.pageTitle")} <Em>{t("services.pageTitleEm")}</Em>
            </SectionHeading>
            <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>{t("services.pageBody")}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              svc={svc}
              open={expanded === svc.id}
              onToggle={() => setExpanded((cur) => (cur === svc.id ? null : svc.id))}
            />
          ))}
        </div>

        <ul className="mt-14 flex flex-wrap gap-3">
          {TRUST_ICONS.map((Icon, i) => (
            <li key={trust[i] ?? i} className={`flex items-center gap-2 rounded-full border px-4 py-2 ${T.card}`}>
              <Icon size={14} className={T.icon} aria-hidden="true" />
              <span className={`text-xs font-medium ${T.body}`}>{trust[i]}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <NavLink to="inquiry" className={CTA}>
            <Send size={14} aria-hidden="true" />
            {t("services.book")}
            <ArrowUpRight size={13} aria-hidden="true" />
          </NavLink>
        </div>
      </div>
    </section>
  );
}
