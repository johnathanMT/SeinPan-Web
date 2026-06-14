// src/pages/ImmersivePage.jsx
// Full-screen, chrome-free immersive page. It has NO standard header, so it
// carries its own floating <LanguageSwitcher variant="immersive"/> top-right —
// demonstrating that the switcher stays consistent across Hub and Immersive.
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/i18n/LanguageSwitcher";
import CircuitTraces from "../components/canvas/CircuitTraces";

export default function ImmersivePage() {
  const { t } = useTranslation(["home", "common"]);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" />
      <CircuitTraces />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 bg-holo opacity-[0.12] blur-3xl saturate-150" />

      {/* floating switcher, mirrors the Hub header's top-right placement */}
      <div className="absolute right-6 top-6 z-20">
        <LanguageSwitcher variant="immersive" />
      </div>

      <div className="relative max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-copper-400">
          {t("integrations.label")}
        </p>
        <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
          <Trans i18nKey="integrations.title" ns="home">
            Connect with your <span className="text-copper-400">favorite components</span>
          </Trans>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-slate-400">{t("integrations.subtitle")}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#catalog"
            className="rounded-full bg-copper-500 px-6 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-copper-400"
          >
            {t("cta.explore", { ns: "common" })}
          </a>
          <Link
            to="/"
            className="rounded-full border border-line px-6 py-2.5 text-sm text-white transition hover:border-copper-500/50 hover:text-copper-300"
          >
            ← Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
