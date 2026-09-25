import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Only the namespace the public homepage needs is bundled up front.
// The legacy /hub route registers its own namespaces when its chunk loads
// (see features/hub/registerHubLocales.ts).
import enOfficial from "../../locales/en/official.json";
import myOfficial from "../../locales/my/official.json";
import { readSavedLanguage, saveLanguage } from "./languageStore";
import { DEFAULT_LANG, SUPPORTED, toLang } from "./languages";

const codes = SUPPORTED.map((l) => l.code);

void i18n.use(initReactI18next).init({
  resources: {
    en: { official: enOfficial },
    my: { official: myOfficial },
  },
  // First-time visitors see Burmese; a saved choice wins. The browser's
  // language is deliberately ignored so an English OS doesn't override the
  // shop default.
  lng: readSavedLanguage(codes) ?? DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: codes,
  load: "languageOnly",
  ns: ["official"],
  defaultNS: "official",
  interpolation: { escapeValue: false }, // React escapes on render
  react: { useSuspense: false },
});

/** Keeps <html lang/dir> and the data-lang font hook in sync. */
function applyLangAttributes(lng: string): void {
  const code = toLang(lng);
  const meta = SUPPORTED.find((l) => l.code === code) ?? SUPPORTED[0];
  if (!meta) return;
  const root = document.documentElement;
  root.lang = meta.code;
  root.dir = meta.dir;
  root.dataset.lang = meta.code;
}

i18n.on("languageChanged", (lng) => {
  applyLangAttributes(lng);
  saveLanguage(toLang(lng));
});
applyLangAttributes(i18n.language);

export { SUPPORTED, DEFAULT_LANG, toLang };
export default i18n;
