// src/components/sections/Hero.jsx
// Cinematic hero on a DEEP FOREST GREEN (PCB) base, with the shop name in
// copper/mustard and a soft copper glow. Center-aligned, fully responsive,
// localized (EN / MY / JA) via home.json + common.json.
import { motion, useReducedMotion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import CircuitTraces from "../canvas/CircuitTraces";

export function Hero() {
  const { t } = useTranslation(["home", "common"]);
  const reduce = useReducedMotion();

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden bg-forest-900 px-6 text-center"
    >
      {/* deep-forest gradient base */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-800 via-forest-900 to-forest-950" />
      {/* faint PCB traces (brand layer) + dotted grid */}
      <CircuitTraces />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />
      {/* radial copper glow behind the title */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,134,42,0.22),transparent_68%)] blur-2xl" />
      {/* edge vignette so text stays crisp */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,21,15,0.9)_100%)]" />

      <div className="relative max-w-3xl py-20">
        <motion.span
          {...rise(0)}
          className="inline-flex items-center gap-2 rounded-full border border-copper-500/40 bg-copper-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-copper-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-copper-400" aria-hidden />
          {t("hero.badge")}
        </motion.span>

        <motion.h1
          {...rise(0.08)}
          className="mt-6 text-4xl font-bold leading-tight text-copper-400 [text-shadow:0_2px_30px_rgba(200,134,42,0.25)] sm:text-6xl md:text-7xl"
        >
          {t("hero.name")}
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mx-auto mt-5 max-w-2xl text-lg text-pcb-100/90 sm:text-xl"
        >
          <Trans i18nKey="hero.tagline" ns="home">
            Expert electronics repair you can <span className="text-copper-300">trust</span>.
          </Trans>
        </motion.p>

        <motion.p
          {...rise(0.24)}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-pcb-100/60 sm:text-base"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          {...rise(0.32)}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#contact"
            className="w-full rounded-full bg-copper-500 px-7 py-3 text-sm font-semibold text-forest-950 shadow-glow transition hover:bg-copper-400 sm:w-auto"
          >
            {t("hero.ctaPrimary")}
          </a>
          <a
            href="#services"
            className="w-full rounded-full border border-copper-500/40 px-7 py-3 text-sm font-medium text-copper-200 transition hover:border-copper-400 hover:text-copper-100 sm:w-auto"
          >
            {t("hero.ctaSecondary")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
