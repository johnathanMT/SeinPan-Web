// src/components/sections/TechnicianProfile.jsx
// "About the technician" — a glassmorphism bento for U Win Naing Swe.
// Layout: photo card (left) + bio / expertise / stats (right). Stacks on mobile.
// Drop a real photo at /public/technician.jpg (or pass photoSrc); if it is
// missing, a clean initials avatar is shown instead.
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GridCanvas from "../canvas/GridCanvas";
import HoloBackdrop from "../canvas/HoloBackdrop";

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl " +
  "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.7)]";

function TechPhoto({ src, initials }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-forest-700 to-forest-950">
        <span className="grid h-24 w-24 place-items-center rounded-full border border-copper-500/40 bg-copper-500/10 text-3xl font-semibold text-copper-300">
          {initials}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="h-full min-h-[280px] w-full rounded-2xl object-cover"
    />
  );
}

export function TechnicianProfile({ photoSrc = `${import.meta.env.BASE_URL}technician.jpg` }) {
  const { t } = useTranslation("home");
  const reduce = useReducedMotion();
  const expertise = t("about.expertise", { returnObjects: true }) || [];
  const initials = "WNS";

  return (
    <GridCanvas>
      <p className="relative mb-2 text-xs uppercase tracking-[0.14em] text-copper-400">
        {t("about.label")}
      </p>
      <h2 className="relative mb-8 text-3xl font-semibold text-white sm:text-4xl">
        {t("about.name")}
      </h2>

      <div className="relative overflow-hidden rounded-3xl border border-line p-5 sm:p-6">
        <HoloBackdrop />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid gap-5 lg:grid-cols-5"
        >
          {/* Photo card */}
          <div className={`${glass} overflow-hidden p-2 lg:col-span-2`}>
            <TechPhoto src={photoSrc} initials={initials} />
            <div className="px-3 py-3">
              <p className="text-base font-semibold text-white">{t("about.name")}</p>
              <p className="text-sm text-copper-300">{t("about.role")}</p>
            </div>
          </div>

          {/* Bio + expertise + stats */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            <div className={`${glass} p-6`}>
              <p className="text-sm leading-relaxed text-slate-300">{t("about.bio")}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Expertise */}
              <div className={`${glass} p-5`}>
                <p className="mb-3 text-xs uppercase tracking-[0.12em] text-copper-400">
                  {t("about.expertiseLabel")}
                </p>
                <ul className="space-y-2">
                  {(Array.isArray(expertise) ? expertise : []).map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-400" aria-hidden />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-rows-2 gap-5">
                <div className={`${glass} flex flex-col justify-center p-5`}>
                  <p className="text-3xl font-semibold text-copper-300">
                    {t("about.stats.yearsValue")}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{t("about.stats.yearsLabel")}</p>
                </div>
                <div className={`${glass} flex flex-col justify-center p-5`}>
                  <p className="text-3xl font-semibold text-copper-300">
                    {t("about.stats.repairsValue")}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{t("about.stats.repairsLabel")}</p>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-copper-500 px-5 py-2.5 text-sm font-medium text-forest-950 transition hover:bg-copper-400"
            >
              {t("about.cta")}
              <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </GridCanvas>
  );
}

export default TechnicianProfile;
