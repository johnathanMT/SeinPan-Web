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
import enOfficial from "./locales/en/official.json";
import myCommon from "./locales/my/common.json";
import myHome from "./locales/my/home.json";
import myCatalog from "./locales/my/catalog.json";
import myOfficial from "./locales/my/official.json";
// Single source of truth for supported languages (used by LanguageSwitcher).
// Burmese is first: it is the default for first-time visitors.
export const SUPPORTED = [
  { code: "my", label: "Myanmar", native: "မြန်မာ", dir: "ltr" },
  { code: "en", label: "English", native: "English", dir: "ltr" },
];

const resources = {
  en: { common: enCommon, home: enHome, catalog: enCatalog, official: enOfficial },
  my: { common: myCommon, home: myHome, catalog: myCatalog, official: myOfficial },
};

i18n
  .use(LanguageDetector) // detect + persist preferred language
  .use(initReactI18next) // wire into React via context
  .init({
    resources,
    // First-time visitors see Burmese. A saved choice (localStorage/cookie)
    // still wins, so switching to English sticks. Browser language is ignored
    // so an English OS does not override the shop default.
    fallbackLng: "my",
    supportedLngs: ["my", "en"],
    load: "languageOnly",
    ns: ["common", "home", "catalog", "official"],
    defaultNS: "common",
    interpolation: { escapeValue: false }, // React already escapes output
    detection: {
      order: ["localStorage", "cookie"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "seinpan_lang",
      lookupCookie: "seinpan_lang",
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
