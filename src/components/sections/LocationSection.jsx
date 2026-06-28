// src/components/sections/LocationSection.jsx
// "Location & contact" — glassmorphism info card + responsive Google Map embed.
// Map pins the verified coordinates of Sein Pan Electronic (Yangon).
// Labels come from common.json -> location.*; data values from home.json -> location.*
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GridCanvas from "../canvas/GridCanvas";
import ContactForm from "./ContactForm";

// --- Verified place data (from the shop's Google Maps link) ---
const SHOP = {
  lat: 16.8999531,
  lng: 96.1515448,
  // Short link the owner shared (used for "View on Google Maps").
  shareUrl: "https://maps.app.goo.gl/Z2dqgYCYq5BUbVms6",
};

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl " +
  "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.7)]";

// Keyless embed: pins exact coordinates and follows the UI language (hl=).
const embedSrc = (lng) =>
  `https://www.google.com/maps?q=${SHOP.lat},${SHOP.lng}&z=17&hl=${lng}&output=embed`;

// Turn-by-turn directions to the shop.
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${SHOP.lat},${SHOP.lng}`;

function Row({ icon, label, children }) {
  return (
    <div className="flex gap-3 border-b border-white/5 py-3 last:border-0">
      <span className="mt-0.5 text-copper-400" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm text-slate-200">{children}</div>
      </div>
    </div>
  );
}

export function LocationSection() {
  const { t, i18n } = useTranslation(["home", "common"]);
  const reduce = useReducedMotion();
  const lang = (i18n.language || "en").split("-")[0];

  const phone = t("location.phoneValue");
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const rating = t("location.ratingValue");

  return (
    <GridCanvas>
      <p className="relative mb-2 text-xs uppercase tracking-[0.14em] text-copper-400">
        {t("location.label")}
      </p>
      <h2 className="relative mb-2 text-3xl font-semibold text-white sm:text-4xl">
        {t("location.title")}
      </h2>
      <p className="relative mb-8 max-w-xl text-slate-400">{t("location.subtitle")}</p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid items-start gap-5 lg:grid-cols-2"
      >
        {/* Contact form — alongside the map */}
        <ContactForm />

        {/* Map + location details, stacked */}
        <div className="flex flex-col gap-5">
          {/* Responsive map embed */}
          <div className={`${glass} overflow-hidden p-2`}>
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 10" }}>
              <iframe
                title={t("location.name")}
                src={embedSrc(lang)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Details card */}
          <div className={`${glass} flex flex-col p-6`}>
            <p className="text-base font-semibold text-white">{t("location.name")}</p>

            {rating ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-copper-300">
                <span aria-hidden>★</span>
                <span>{rating}</span>
                <span className="text-slate-500">· {t("location.rating", { ns: "common" })}</span>
              </p>
            ) : null}

            <div className="mt-4">
              <Row icon="📍" label={t("location.address", { ns: "common" })}>
                {t("location.addressValue")}
              </Row>
              <Row icon="🕒" label={t("location.hours", { ns: "common" })}>
                <span>{t("location.hoursValue")}</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {t("location.hoursNote")}
                </span>
              </Row>
              <Row icon="📞" label={t("location.phone", { ns: "common" })}>
                <a href={telHref} className="transition hover:text-copper-300">
                  {phone}
                </a>
              </Row>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={telHref}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-copper-500 px-5 py-2.5 text-sm font-medium text-forest-950 transition hover:bg-copper-400"
              >
                <span aria-hidden>📞</span>
                {t("location.callNow", { ns: "common" })}
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-copper-500/40 px-5 py-2.5 text-sm font-medium text-copper-200 transition hover:border-copper-400 hover:text-copper-100"
              >
                <span aria-hidden>🧭</span>
                {t("location.directions", { ns: "common" })}
              </a>
            </div>

            <a
              href={SHOP.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-copper-300"
            >
              {t("location.viewOnMaps", { ns: "common" })} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </motion.div>
    </GridCanvas>
  );
}

export default LocationSection;
