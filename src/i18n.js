// src/i18n.js
// Central i18next configuration for Sein Pan Electronic.
// Import this ONCE at app entry (src/main.jsx) BEFORE rendering <App/>.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// --- Bundled translations (small app). For large catalogs, swap to
// i18next-http-backend + public/locales for lazy per-language loading. ---
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enCatalog from "./locales/en/catalog.json";
import myCommon from "./locales/my/common.json";
import myHome from "./locales/my/home.json";
import myCatalog from "./locales/my/catalog.json";
import jaCommon from "./locales/ja/common.json";
import jaHome from "./locales/ja/home.json";
import jaCatalog from "./locales/ja/catalog.json";

// Single source of truth for supported languages (used by LanguageSwitcher).
export const SUPPORTED = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "my", label: "Myanmar", native: "မြန်မာ", dir: "ltr" },
  { code: "ja", label: "Japanese", native: "日本語", dir: "ltr" },
];

const resources = {
  en: { common: enCommon, home: enHome, catalog: enCatalog },
  my: { common: myCommon, home: myHome, catalog: myCatalog },
  ja: { common: jaCommon, home: jaHome, catalog: jaCatalog },
};

i18n
  .use(LanguageDetector) // detect + persist preferred language
  .use(initReactI18next) // wire into React via context
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "my", "ja"],
    ns: ["common", "home", "catalog"],
    defaultNS: "common",
    interpolation: { escapeValue: false }, // React already escapes output
    detection: {
      // Order in which a saved/preferred language is looked up.
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      // Persistence: writing here is what makes the choice survive reloads.
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "sp_lang",
      lookupCookie: "sp_lang",
    },
    react: { useSuspense: false },
  });

// Keep <html lang>, dir, and the font hook in sync on every language change.
// The data-lang attribute is the CSS hook used in index.css to swap fonts.
function applyLangAttributes(lng) {
  const meta = SUPPORTED.find((l) => l.code === lng) || SUPPORTED[0];
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
  document.documentElement.dataset.lang = meta.code;
}

i18n.on("languageChanged", applyLangAttributes);
// Apply once on initial load too (detector has already resolved the language).
applyLangAttributes(i18n.language);

export default i18n;
