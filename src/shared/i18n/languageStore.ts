import { readStorage, writeStorage } from "../lib/storage";
import { type Lang } from "../lib/text";

/**
 * Remembers the visitor's language choice (localStorage, with a cookie
 * fallback for browsers that block storage). Same keys as the previous
 * i18next-browser-languagedetector setup, so saved choices carry over.
 */
const KEY = "seinpan_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readCookie(): string | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${KEY}=`));
  return match ? decodeURIComponent(match.slice(KEY.length + 1)) : null;
}

export function readSavedLanguage(supported: readonly Lang[]): Lang | null {
  const saved = readStorage(KEY) ?? readCookie();
  return supported.find((code) => code === saved) ?? null;
}

export function saveLanguage(lang: Lang): void {
  writeStorage(KEY, lang);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${KEY}=${encodeURIComponent(lang)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict${secure}`;
}
