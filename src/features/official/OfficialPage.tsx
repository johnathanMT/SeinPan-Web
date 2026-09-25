import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { useIdlePrefetch } from "../../shared/hooks/useIdlePrefetch";
import type { TabId } from "./content";
import { useElementHeight } from "./hooks/useElementHeight";
import { useHashTab } from "./hooks/useHashTab";
import { useOfficial } from "./hooks/useOfficial";
import { useThemePreference } from "./hooks/useThemePreference";
import { BackBar } from "./layout/BackBar";
import { BottomNav } from "./layout/BottomNav";
import { Footer } from "./layout/Footer";
import { Navbar } from "./layout/Navbar";
import { SkipLink } from "./layout/SkipLink";
import { NavigationContext } from "./navigation";
import { About } from "./sections/About";
import { HomePage } from "./sections/HomePage";
import { getThemeTokens, ThemeContext } from "./theme";

// Inner tabs are separate chunks: the homepage never pays for them, and they
// are prefetched while the browser is idle so switching tabs stays instant.
const loadServices = () => import("./sections/ServicesPage");
const loadInquiry = () => import("./sections/InquiryPage");
const loadContact = () => import("./sections/ContactPage");
const ServicesPage = lazy(loadServices);
const InquiryPage = lazy(loadInquiry);
const ContactPage = lazy(loadContact);
const PREFETCH = [loadServices, loadInquiry, loadContact] as const;

const HOME_TITLE = document.title;
const MAIN_ID = "main-content";

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "services":
      return <ServicesPage />;
    case "about":
      return <About />;
    case "inquiry":
      return <InquiryPage />;
    case "contact":
      return <ContactPage />;
    case "home":
      return <HomePage />;
  }
}

function TabFallback() {
  const { t } = useOfficial();
  return (
    <div className="grid min-h-screen place-items-center" aria-busy="true">
      <span className="h-8 w-8 rounded-full border-2 border-theme-color-3 border-t-transparent motion-safe:animate-spin" aria-hidden="true" />
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}

export default function OfficialPage() {
  const { t } = useOfficial();
  const [active, navigate] = useHashTab();
  const [isDark, toggleTheme] = useThemePreference();
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const headerH = useElementHeight(headerRef, 90);
  useIdlePrefetch(PREFETCH);

  const theme = useMemo(() => ({ isDark, tokens: getThemeTokens(isDark), toggleTheme }), [isDark, toggleTheme]);
  const nav = useMemo(() => ({ active, navigate }), [active, navigate]);

  // Page title per tab, and move focus to the new content so screen readers
  // announce the change (skipped on first load).
  const firstRun = useRef(true);
  useEffect(() => {
    document.title = active === "home" ? HOME_TITLE : `${t(`nav.${active}`)} · Sein Pan Electronic`;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [active, t]);

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationContext.Provider value={nav}>
        <div className={`min-h-screen overflow-x-clip antialiased ${theme.tokens.page}`}>
          <SkipLink targetId={MAIN_ID} />
          <Navbar ref={headerRef} />
          <main id={MAIN_ID} ref={mainRef} tabIndex={-1} style={{ paddingTop: headerH }} className="outline-none">
            {active !== "home" && <BackBar top={headerH} />}
            <Suspense fallback={<TabFallback />}>
              <TabContent tab={active} />
            </Suspense>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </NavigationContext.Provider>
    </ThemeContext.Provider>
  );
}
