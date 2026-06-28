// src/components/sections/ServicesSection.jsx
// "Our services" — glassmorphism card grid of repair expertise.
// Content (titles/bodies) comes from home.json -> services.items.*, so it is
// fully translatable (EN / MY / JA). Same glass recipe + copper accents as the
// rest of the site. Responsive: 1 col (mobile) -> 2 -> 3 (desktop).
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GridCanvas from "../canvas/GridCanvas";

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl " +
  "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.7)]";

// Inline SVG glyphs (no extra dependency). Each repair type gets an apt icon.
const icons = {
  led: (
    <path d="M3 5h18v11H3zM8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" fill="none" />
  ),
  lcd: (
    <path d="M3 5h18v11H3zM7 9h6M7 12h10" stroke="currentColor" strokeWidth="1.6" fill="none" />
  ),
  plasma: (
    <path d="M4 5h16v11H4zM9 20h6M12 9l-1.5 3h3L12 15" stroke="currentColor" strokeWidth="1.6" fill="none" />
  ),
  power: (
    <path d="M13 3l-7 10h5l-1 8 7-11h-5z" stroke="currentColor" strokeWidth="1.6" fill="none" />
  ),
  audio: (
    <path d="M4 9v6h4l5 4V5L8 9zM17 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.6" fill="none" />
  ),
  diagnostics: (
    <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 21l-4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
  ),
};

const ORDER = ["led", "lcd", "plasma", "power", "audio", "diagnostics"];

export function ServicesSection() {
  const { t } = useTranslation("home");
  const reduce = useReducedMotion();

  return (
    <GridCanvas>
      <p className="relative mb-2 text-xs uppercase tracking-[0.14em] text-copper-400">
        {t("services.label")}
      </p>
      <h2 className="relative mb-2 text-3xl font-semibold text-white sm:text-4xl">
        {t("services.title")}
      </h2>
      <p className="relative mb-10 max-w-xl text-slate-400">{t("services.subtitle")}</p>

      <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ORDER.map((key, i) => (
          <motion.article
            key={key}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { y: -4 }}
            className={`${glass} group p-6 transition-colors hover:border-copper-500/40`}
          >
            <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl border border-copper-500/30 bg-copper-500/10 text-copper-300 transition group-hover:bg-copper-500/20">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                {icons[key]}
              </svg>
            </span>
            <h3 className="text-lg font-semibold text-white">{t(`services.items.${key}.title`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {t(`services.items.${key}.body`)}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="relative mt-10">
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-copper-500 px-6 py-3 text-sm font-semibold text-forest-950 transition hover:bg-copper-400"
        >
          {t("services.cta")}
          <span aria-hidden>→</span>
        </a>
      </div>
    </GridCanvas>
  );
}

export default ServicesSection;
