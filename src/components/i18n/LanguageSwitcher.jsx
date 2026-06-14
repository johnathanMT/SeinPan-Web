// src/components/i18n/LanguageSwitcher.jsx
// One switcher used in BOTH the Hub (compact) and Immersive (glassy) layouts.
// Reads i18n.language from context, so every instance stays in sync.
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED } from "../../i18n";

export function LanguageSwitcher({ variant = "hub" }) {
  const { i18n, t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SUPPORTED.find((l) => l.code === i18n.language) || SUPPORTED[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const change = (code) => {
    i18n.changeLanguage(code); // persists to localStorage + updates <html lang>
    setOpen(false);
  };

  const triggerCls = [
    "inline-flex items-center gap-2 rounded-full border border-line",
    "text-sm text-slate-200 transition hover:border-copper-500/50 hover:text-copper-300",
    variant === "immersive" ? "px-4 py-2.5 bg-white/[0.04] backdrop-blur" : "px-3 py-1.5",
  ].join(" ");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerCls}
      >
        <span aria-hidden>🌐</span>
        <span>{current.native}</span>
        <span className="text-xs opacity-70" aria-hidden>▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-800/90 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
        >
          {SUPPORTED.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === current.code}
                onClick={() => change(l.code)}
                className={[
                  "flex w-full items-center justify-between px-4 py-2.5 text-sm transition",
                  l.code === current.code
                    ? "text-copper-300 bg-copper-500/10"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-copper-300",
                ].join(" ")}
              >
                <span>{l.native}</span>
                <span className="text-xs text-slate-500">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSwitcher;
