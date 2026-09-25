import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toLang } from "../../../shared/i18n/languages";
import type { Lang } from "../../../shared/lib/text";

/**
 * Translation helper for the official site.
 * `list<T>(key)` reads an array value (returnObjects) with a safe fallback,
 * so a missing or malformed translation renders nothing instead of crashing.
 */
export function useOfficial() {
  const { t, i18n } = useTranslation("official");
  const lang: Lang = toLang(i18n.resolvedLanguage ?? i18n.language);

  const list = useCallback(
    <T,>(key: string): T[] => {
      const value: unknown = t(key, { returnObjects: true });
      return Array.isArray(value) ? (value as T[]) : [];
    },
    [t],
  );

  return { t, i18n, lang, list };
}
