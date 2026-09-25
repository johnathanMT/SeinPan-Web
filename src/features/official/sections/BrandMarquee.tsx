import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { BRAND_LOGOS } from "../decor/BrandLogos";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";

/**
 * Brands we repair. Seamless CSS marquee (compositor-only transform).
 * WCAG 2.2.2: moving content lasting >5s gets a visible pause control;
 * hover also pauses it, and reduced-motion users see a static row.
 */
export function BrandMarquee() {
  const { t } = useOfficial();
  const { isDark } = useTheme();
  const [paused, setPaused] = useState(false);
  const row = [...BRAND_LOGOS, ...BRAND_LOGOS];
  const muted = isDark ? "text-theme-color-2/80" : "text-theme-color-4/80";

  return (
    <section
      aria-label={t("brandsLabel")}
      className={`cv-auto relative border-y py-12 ${isDark ? "border-theme-color-2/10 bg-theme-color-1/40" : "border-theme-color-4/10 bg-theme-color-1/[0.08]"}`}
    >
      <div className="mb-6 flex items-center justify-center gap-3 px-4">
        <p className={`text-center text-xs font-semibold tracking-[0.2em] ${muted}`}>{t("brandsLabel")}</p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={t(paused ? "brandsPlay" : "brandsPause")}
          className={`tap-48 grid h-8 w-8 shrink-0 place-items-center rounded-full border motion-reduce:hidden ${
            isDark ? "border-theme-color-2/25 text-theme-color-2" : "border-theme-color-4/20 text-theme-color-4"
          }`}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
      <div className="group/marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul
          className={`flex w-max items-center gap-12 motion-safe:animate-marquee group-hover/marquee:[animation-play-state:paused] sm:gap-16 ${
            paused ? "[animation-play-state:paused]" : ""
          }`}
        >
          {row.map(({ id, Logo }, i) => (
            <li key={`${id}-${i}`} aria-hidden={i >= BRAND_LOGOS.length || undefined} className="inline-flex h-10 items-center">
              <Logo />
            </li>
          ))}
        </ul>
      </div>
      <p className={`mx-auto mt-7 max-w-3xl px-6 text-center text-xs leading-relaxed ${muted}`}>{keepWords(t("brandsDisclaimer"))}</p>
    </section>
  );
}
