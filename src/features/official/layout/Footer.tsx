import { Clock, MapPin, Phone, Tv } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { EXTERNAL, LINKS, NAV_TABS, OPEN_DAYS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import type { DayHours } from "../types";
import { FacebookIcon, ViberIcon } from "../ui/BrandIcons";
import { NavLink } from "../ui/NavLink";
import { BRAND_BUTTON } from "../ui/styles";

const FOOTER_LINK =
  "inline-flex min-h-11 items-center text-left text-sm text-white/90 transition hover:text-theme-color-2 hover:underline hover:underline-offset-4";

/** Footer (always dark for impact). */
export function Footer() {
  const { t, list } = useOfficial();
  const links = list<string>("footer.links");
  const days = list<DayHours>("contact.days");

  return (
    <footer className="cv-auto relative isolate overflow-hidden bg-theme-color-4 px-4 pb-28 pt-16 text-white md:pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1 bg-theme-color-3" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-theme-color-2/10 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <NavLink to="home" className="group mb-5 flex min-h-11 items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-theme-color-3 shadow-md shadow-theme-color-4/20">
                <Tv size={18} className="text-white" aria-hidden="true" />
              </span>
              <span className="text-left leading-none">
                <span className="block text-sm font-extrabold leading-snug text-theme-color-2">{t("nav.brand")}</span>
                <span className="block text-xs leading-snug text-white/80">{t("footer.service")}</span>
              </span>
            </NavLink>
            <p className="max-w-xs text-sm leading-loose text-white/90">{keepWords(t("footer.blurb"))}</p>
            <a
              href={LINKS.tel}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-theme-color-3 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-color-4/20 transition hover:scale-105 hover:opacity-90"
            >
              <Phone size={14} aria-hidden="true" />
              {t("phone")}
            </a>
          </div>

          <nav aria-label={t("footer.navigation")}>
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t("footer.navigation")}</p>
            <ul className="space-y-0.5">
              {NAV_TABS.map(({ id }) => (
                <li key={id}>
                  <NavLink to={id} className={FOOTER_LINK}>
                    {t(`nav.${id}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t("footer.services")}</p>
            <ul className="space-y-0.5">
              {links.map((label) => (
                <li key={label}>
                  <NavLink to="services" className={FOOTER_LINK}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t("footer.contact")}</p>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-1 shrink-0 text-theme-color-2" aria-hidden="true" />
                <address className="not-italic">{keepWords(t("footer.address"))}</address>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-theme-color-2" aria-hidden="true" />
                <a href={LINKS.tel} className="inline-flex min-h-11 items-center transition hover:text-theme-color-2 hover:underline hover:underline-offset-4">
                  {t("phone")}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="mt-1 shrink-0 text-theme-color-2" aria-hidden="true" />
                <dl className="space-y-1">
                  {days.map(({ day, time }, i) => (
                    <div key={day}>
                      <dt className="inline">
                        {day}
                        <span aria-hidden="true" className="px-1.5 text-white/60">
                          ·
                        </span>
                      </dt>
                      <dd className={`inline whitespace-nowrap ${OPEN_DAYS[i] ? "" : "font-semibold text-theme-color-2"}`}>{time}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 rounded-2xl border border-theme-color-2/15 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-theme-color-2">{t("footer.connect")}</p>
            <p className="mt-1.5 text-sm text-white/90">{keepWords(t("footer.connectBody"))}</p>
          </div>
          <ul className="flex flex-wrap gap-3">
            <li>
              <a href={LINKS.facebook} {...EXTERNAL} aria-label={t("footer.social.facebookAria")} className={`${BRAND_BUTTON} bg-brand-facebook`}>
                <FacebookIcon size={18} />
                {t("footer.social.facebook")}
              </a>
            </li>
            <li>
              <a href={LINKS.viber} {...EXTERNAL} aria-label={t("footer.social.viberAria")} className={`${BRAND_BUTTON} bg-brand-viber`}>
                <ViberIcon size={18} />
                {t("footer.social.viber")}
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-theme-color-2/20 pt-6 text-xs text-white/85">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {t("footer.rights")}
            </p>
            <p className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-theme-color-3" />
              {t("footer.est")}
            </p>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-white/75">{keepWords(t("brandsDisclaimer"))}</p>
        </div>
      </div>
    </footer>
  );
}
