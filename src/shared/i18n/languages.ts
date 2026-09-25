import type { Lang } from "../lib/text";

export interface LanguageMeta {
  code: Lang;
  label: string;
  native: string;
  dir: "ltr" | "rtl";
}

// Burmese first: it is the default for first-time visitors.
export const SUPPORTED: readonly LanguageMeta[] = [
  { code: "my", label: "Myanmar", native: "မြန်မာ", dir: "ltr" },
  { code: "en", label: "English", native: "English", dir: "ltr" },
];

export const DEFAULT_LANG: Lang = "my";

export function toLang(value: string | undefined): Lang {
  return (value ?? "").split("-")[0] === "en" ? "en" : "my";
}
