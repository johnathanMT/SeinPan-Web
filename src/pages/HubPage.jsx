// src/pages/HubPage.jsx
// The Hub (landing) page: integration grid + glassmorphism bento insights.
// All copy comes from translation files; the <Header/> is provided by RootLayout.
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import GridCanvas from "../components/canvas/GridCanvas";
import CircuitTraces from "../components/canvas/CircuitTraces";
import HoloBackdrop from "../components/canvas/HoloBackdrop";
import Hero from "../components/sections/Hero";
import TechnicianProfile from "../components/sections/TechnicianProfile";
import ServicesSection from "../components/sections/ServicesSection";
import LocationSection from "../components/sections/LocationSection";
import { IntegrationGrid } from "../components/integrations/IntegrationGrid";
import { BentoGrid } from "../components/bento/BentoGrid";
import { BentoCard } from "../components/bento/BentoCard";

function ProfileSummary() {
  const { t } = useTranslation("common");
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-pcb-500 to-copper-500 text-sm font-semibold text-ink-900">
          EC
        </div>
        <div>
          <p className="text-sm font-medium text-white">Emily Carter</p>
          <p className="text-xs text-slate-500">emily@acme.com</p>
        </div>
      </div>
      <dl className="space-y-1.5 text-[12px]">
        <div className="flex justify-between border-b border-white/5 py-1">
          <dt className="text-slate-500">Lifetime value</dt>
          <dd className="text-copper-300">$140</dd>
        </div>
        <div className="flex justify-between border-b border-white/5 py-1">
          <dt className="text-slate-500">{t("since")}</dt>
          <dd className="text-slate-300">Oct 2, 2024</dd>
        </div>
      </dl>
    </div>
  );
}

export default function HubPage() {
  const { t } = useTranslation("home");

  return (
    <>
      {/* Hero — deep forest green base, copper shop name */}
      <Hero />

      {/* About — technician bio (glassmorphism bento) */}
      <section id="about">
        <TechnicianProfile />
      </section>

      {/* Services — repair expertise card grid */}
      <section id="services">
        <ServicesSection />
      </section>

      {/* Section 01 — integrations */}
      <GridCanvas>
        <CircuitTraces />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-copper-400">
              {t("integrations.label")}
            </p>
            <h2 className="text-4xl font-semibold text-white">
              <Trans i18nKey="integrations.title" ns="home">
                Connect with your <span className="text-copper-400">favorite components</span>
              </Trans>
            </h2>
            <p className="mt-4 max-w-md text-slate-400">{t("integrations.subtitle")}</p>
            <Link
              to="/immersive"
              className="mt-6 inline-flex rounded-full border border-line px-5 py-2.5 text-sm text-white transition hover:border-copper-500/50 hover:text-copper-300"
            >
              {t("insights.label")} →
            </Link>
          </div>
          <IntegrationGrid />
        </div>
      </GridCanvas>

      {/* Section 02 — glassmorphism bento */}
      <GridCanvas>
        <p className="relative mb-2 text-xs uppercase tracking-[0.14em] text-copper-400">
          {t("insights.label")}
        </p>
        <h2 className="relative mb-8 text-4xl font-semibold text-white">{t("insights.title")}</h2>
        <div className="relative overflow-hidden rounded-2xl border border-line p-5">
          <HoloBackdrop />
          <BentoGrid className="relative">
            <BentoCard className="md:row-span-2" accent>
              <ProfileSummary />
            </BentoCard>
            <BentoCard tKey="insights.cards.conversion" href="#" />
            <BentoCard tKey="insights.cards.analytics" href="#" />
            <BentoCard tKey="insights.cards.insights" href="#" highlight />
            <BentoCard tKey="insights.cards.repair" href="#" />
          </BentoGrid>
        </div>
      </GridCanvas>

      {/* Location & contact — map embed + glass details card */}
      <section id="contact">
        <LocationSection />
      </section>
    </>
  );
}
