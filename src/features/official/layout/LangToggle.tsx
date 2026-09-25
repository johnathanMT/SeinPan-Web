import type { Lang } from "../../../shared/lib/text";
import { useOfficial } from "../hooks/useOfficial";

const LANGS: readonly Lang[] = ["my", "en"];

/**
 * Phones get a single 44px button that switches to the other language
 * (the two-button control no longer fits beside the menu at 360px).
 * Wider screens get the segmented control.
 */
export function LangToggle() {
  const { t, i18n, lang } = useOfficial();
  const other: Lang = lang === "my" ? "en" : "my";
  const change = (code: Lang) => {
    void i18n.changeLanguage(code);
  };

  return (
    <>
      <button
        type="button"
        lang={other}
        onClick={() => change(other)}
        aria-label={`${t(`lang.${other}`)} — ${t("nav.switchLanguage")}`}
        className="tap-48 inline-flex h-11 shrink-0 items-center rounded-xl border border-theme-color-2/25 px-3 text-xs font-bold text-white transition hover:bg-white/10 sm:hidden"
      >
        {t(`lang.${other}`)}
      </button>

      <div role="group" aria-label={t("nav.switchLanguage")} className="hidden shrink-0 rounded-xl border border-theme-color-2/25 text-xs font-bold sm:flex">
        {LANGS.map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => change(code)}
            aria-pressed={lang === code}
            className={`inline-flex h-11 items-center px-3 transition first:rounded-l-[11px] last:rounded-r-[11px] ${
              lang === code ? "bg-theme-color-3 text-white" : "text-white/80 hover:text-white"
            }`}
          >
            {t(`lang.${code}`)}
          </button>
        ))}
      </div>
    </>
  );
}
