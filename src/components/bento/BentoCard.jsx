// src/components/bento/BentoCard.jsx
// i18n-aware BentoCard. Design, classes, and Framer Motion are UNCHANGED from
// the original — the ONLY addition is an optional `tKey` prop that resolves
// title/body from translation files. Backward-compatible: existing
// `title="..."` / `body="..."` usages still work exactly as before.
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export function BentoCard({
  tKey,                 // e.g. "insights.cards.analytics" -> reads .title/.body
  ns = "home",          // namespace the tKey lives in
  title,                // raw fallback (used when no tKey)
  body,                 // raw fallback
  href,
  accent = false,       // copper-tinted focal card
  highlight = false,    // emphasized "Learn more"
  className,
  children,
}) {
  const { t } = useTranslation([ns, "common"]);
  const reduce = useReducedMotion();

  // Resolve from translations if tKey is given, else fall back to raw props.
  const _title = tKey ? t(`${tKey}.title`) : title;
  const _body = tKey ? t(`${tKey}.body`) : body;
  const _more = t("cta.learnMore"); // shared label from common.json

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={clsx(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6",
        "border backdrop-blur-xl transition-colors",
        "border-white/10 bg-white/[0.04]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.7)]",
        accent && "border-copper-500/30 bg-copper-500/[0.06]",
        "hover:border-copper-500/40",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[conic-gradient(from_180deg_at_50%_50%,#0f9d5833,#818cf833,#e4b75a33,#0f9d5833)] blur-2xl"
      />

      <div className="relative">
        {children}
        {_title && <h3 className="text-lg font-semibold text-white">{_title}</h3>}
        {_body && <p className="mt-2 text-sm leading-relaxed text-slate-400">{_body}</p>}
      </div>

      {href && (
        <a
          href={href}
          className={clsx(
            "relative mt-5 inline-flex items-center gap-1 text-sm font-medium",
            highlight ? "text-copper-300" : "text-slate-300 hover:text-copper-300",
          )}
        >
          {_more}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </a>
      )}
    </motion.div>
  );
}

export default BentoCard;
