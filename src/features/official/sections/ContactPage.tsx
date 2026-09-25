import type { ReactNode } from "react";
import { ArrowUpRight, Clock, MapPin, Phone, Tv } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { EXTERNAL, LINKS, OPEN_DAYS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import type { DayHours } from "../types";
import { FacebookIcon } from "../ui/BrandIcons";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { Em, SectionHeading, SectionLabel } from "../ui/Section";
import { ARROW_ICON } from "../ui/styles";

function CardHeader({ icon, title, sub, iconBg = "bg-theme-color-1" }: { icon: ReactNode; title: string; sub?: string; iconBg?: string }) {
  const { tokens: T } = useTheme();
  return (
    <div className="mb-4 flex items-center gap-3">
      <div aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-sm ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className={`text-sm font-bold ${T.h}`}>{title}</h3>
        {sub && <p className={`truncate text-xs ${T.muted}`}>{sub}</p>}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { t, list } = useOfficial();
  const { isDark, tokens: T } = useTheme();
  const days = list<DayHours>("contact.days");
  const card = `rounded-2xl border p-6 ${T.card} ${T.cardHov}`;

  return (
    <section className={`min-h-screen px-4 py-20 sm:py-28 ${T.altSec}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>{t("contact.label")}</SectionLabel>
          <SectionHeading>
            {t("contact.title")}
            <Em>{t("contact.titleEm")}</Em>
            {t("contact.titleEnd")}
          </SectionHeading>
          <p className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${T.body}`}>{t("contact.body")}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <RevealGroup className="space-y-4" stagger={0.1}>
            <RevealItem className={card}>
              <CardHeader icon={<Phone size={17} className="text-theme-color-2" />} title={t("contact.phones")} />
              <a
                href={LINKS.tel}
                className="neon-cta group flex min-h-12 items-center justify-between rounded-xl bg-theme-color-3 px-4 py-3 text-sm text-white shadow-sm hover:scale-[1.02]"
              >
                <span className="font-semibold">{t("phone")}</span>
                <ArrowUpRight size={13} className={ARROW_ICON} aria-hidden="true" />
              </a>
            </RevealItem>

            <RevealItem className={card}>
              <CardHeader icon={<Clock size={17} className="text-theme-color-2" />} title={t("contact.hours")} />
              <dl className={`divide-y ${isDark ? "divide-theme-color-2/10" : "divide-theme-color-4/10"}`}>
                {days.map(({ day, time }, i) => {
                  const open = OPEN_DAYS[i] ?? false;
                  return (
                    <div key={day} className="flex items-center justify-between gap-4 py-2.5">
                      <dt className={`text-xs ${T.muted}`}>{day}</dt>
                      <dd className="flex items-center gap-2">
                        <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${open ? "bg-theme-color-1" : "bg-theme-color-3"}`} />
                        <span className={`whitespace-nowrap text-xs font-semibold tabular-nums ${open ? T.h : T.emSmall}`}>{time}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </RevealItem>

            <RevealItem className={card}>
              <CardHeader icon={<MapPin size={17} className="text-theme-color-2" />} title={t("contact.address")} />
              <address className={`whitespace-pre-line text-sm not-italic leading-relaxed ${T.body}`}>{t("contact.addressLines")}</address>
              <p className={`mt-3 text-xs ${T.muted}`}>{t("contact.previous")}</p>
            </RevealItem>

            <RevealItem className={card}>
              <CardHeader
                icon={<FacebookIcon size={19} className="text-white" />}
                iconBg="bg-brand-facebook"
                title={t("contact.facebookTitle")}
                sub={t("contact.facebookHandle")}
              />
              <p className={`mb-4 text-sm leading-relaxed ${T.body}`}>{keepWords(t("contact.facebookBody"))}</p>
              <a
                href={LINKS.facebook}
                {...EXTERNAL}
                className="group flex min-h-12 items-center justify-between rounded-xl bg-theme-color-1 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:opacity-90"
              >
                <span className="inline-flex items-center gap-2">
                  <FacebookIcon size={16} />
                  {t("contact.facebookCta")}
                </span>
                <ArrowUpRight size={13} className={ARROW_ICON} aria-hidden="true" />
              </a>
            </RevealItem>
          </RevealGroup>

          {/* Stylised map; the whole panel opens Google Maps. */}
          <Reveal className="h-full">
            <a
              href={LINKS.maps}
              {...EXTERNAL}
              aria-label={t("contact.mapAria")}
              className="neon-card-dark group relative block h-full min-h-[360px] overflow-hidden rounded-2xl bg-theme-color-1 shadow-md shadow-theme-color-4/15 lg:min-h-0"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(234,224,208,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(234,224,208,0.12) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(234,224,208,0.3)" strokeWidth="2" />
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(234,224,208,0.22)" strokeWidth="1.5" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(234,224,208,0.22)" strokeWidth="1.5" />
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(234,224,208,0.14)" strokeWidth="1" />
                <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(234,224,208,0.14)" strokeWidth="1" />
                {/* Maydar Wee Market main road */}
                <line x1="0" y1="52%" x2="100%" y2="52%" stroke="rgba(174,112,87,0.85)" strokeWidth="7" strokeLinecap="round" />
              </svg>

              <div aria-hidden="true" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-theme-color-3/30 motion-safe:animate-ping" />
                  <div className="absolute -inset-2 rounded-full bg-theme-color-3/20" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-full border-4 border-theme-color-2 bg-theme-color-3 shadow-md">
                    <Tv size={22} className="text-white" />
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-theme-color-2 px-4 py-2.5 text-center shadow-md">
                  <p className="text-xs font-extrabold text-theme-color-4">{t("contact.mapName")}</p>
                  <p className="text-xs font-semibold text-theme-color-4">{t("contact.mapPlace")}</p>
                  <p className="text-xs text-theme-color-4/85">{t("contact.mapArea")}</p>
                </div>
              </div>

              <div aria-hidden="true" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-theme-color-2 text-xs font-extrabold text-theme-color-4 shadow-sm">
                N
              </div>
              <p aria-hidden="true" className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.15em] text-white/85">
                {t("contact.mapLabel")}
              </p>
              <span
                aria-hidden="true"
                className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-theme-color-3 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:scale-105 group-hover:opacity-90"
              >
                <MapPin size={13} />
                {t("contact.openMaps")}
                <ArrowUpRight size={12} className={ARROW_ICON} />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
