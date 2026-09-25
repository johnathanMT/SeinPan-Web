import { ClipboardList, Phone } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { LINKS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";
import { NavLink } from "../ui/NavLink";
import { Reveal } from "../ui/Reveal";
import { CTA, OUTLINE_ON_DARK } from "../ui/styles";
import { BEZEL, CABINET_SHADOW, CRT_RADIUS, CrtOverlay } from "../ui/Tv";

export function ClosingBand() {
  const { t } = useOfficial();
  const { tokens: T } = useTheme();
  return (
    <section className={`cv-auto px-4 pb-20 sm:pb-28 ${T.sec}`}>
      <Reveal className={`mx-auto max-w-6xl rounded-[1.75rem] bg-wood-grain p-2.5 sm:rounded-[2.5rem] sm:p-4 ${CABINET_SHADOW}`}>
        <div className={`rounded-[1.5rem] p-2 sm:rounded-[2rem] sm:p-3 ${BEZEL}`}>
          <div
            className="relative isolate overflow-hidden bg-crt-glow px-6 py-16 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.65)] sm:px-16 sm:py-24"
            style={CRT_RADIUS}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-grid-lines bg-[length:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
              <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-theme-color-3/25 blur-3xl" />
            </div>
            <CrtOverlay />
            <p className="text-xs font-semibold tracking-[0.2em] text-theme-gold">{t("closing.label")}</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-snug text-white [text-wrap:balance] sm:text-5xl">
              {keepWords(t("closing.title"))}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-loose text-white">{keepWords(t("closing.body"))}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <NavLink to="inquiry" className={CTA}>
                <ClipboardList size={16} aria-hidden="true" />
                {t("closing.submit")}
              </NavLink>
              <a href={LINKS.tel} className={OUTLINE_ON_DARK}>
                <Phone size={15} aria-hidden="true" />
                {t("phone")}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
