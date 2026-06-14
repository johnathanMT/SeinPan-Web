// src/components/layout/Header.jsx
// Professional, theme-matched header for Sein Pan Electronic.
// - Sticky, translucent; gains a solid bg + copper hairline on scroll.
// - Localized nav via common.json keys.
// - <LanguageSwitcher> sits at the far right on desktop, and inside the
//   mobile menu on small screens, so it's reachable on every layout.
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation("common");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { key: "nav.catalog", href: "#catalog" },
    { key: "nav.about", href: "#about" },
    { key: "nav.contact", href: "#contact" },
  ];

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-copper-500/20 bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-copper-500/40 bg-copper-500/10 text-copper-300">
            {/* simple chip glyph; replace with your logo svg/img */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-white">{t("brand")}</span>
            <span className="text-[11px] tracking-wide text-copper-400">{t("since")}</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-copper-300"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        {/* Right cluster: CTA + LanguageSwitcher (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#quote"
            className="rounded-full bg-copper-500 px-4 py-1.5 text-sm font-medium text-ink-900 transition hover:bg-copper-400"
          >
            {t("cta.quote")}
          </a>
          {/* ▼▼▼ THE LANGUAGE SWITCHER ▼▼▼ */}
          <LanguageSwitcher variant="hub" />
          {/* ▲▲▲ ---------------------- ▲▲▲ */}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-200 md:hidden"
        >
          <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-copper-300"
              >
                {t(item.key)}
              </a>
            ))}
            <a
              href="#quote"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-copper-500 px-4 py-2 text-center text-sm font-medium text-ink-900"
            >
              {t("cta.quote")}
            </a>
            {/* Switcher inside the mobile menu so it's reachable on phones */}
            <div className="mt-3 border-t border-line pt-3">
              <LanguageSwitcher variant="immersive" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
