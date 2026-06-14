// src/hooks/useT.js
// Thin convenience wrapper: load a feature namespace + always fall back to common.
// Usage: const { t } = useT("home"); t("insights.title"); t("cta.explore");
import { useTranslation } from "react-i18next";

export function useT(ns = "common") {
  return useTranslation([ns, "common"]);
}

export default useT;
