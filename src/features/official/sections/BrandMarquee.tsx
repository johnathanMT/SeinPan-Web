import { useState, type ComponentType } from "react";
import { Pause, Play } from "lucide-react";
import { keepWords } from "../../../shared/lib/text";
import { BRAND_LOGOS } from "../decor/BrandLogos";
import { useOfficial } from "../hooks/useOfficial";
import { useTheme } from "../theme";

interface Brand {
  id: string;
  Logo: ComponentType;
}

// The second row starts halfway through the list so the rows never line up.
const HALF = Math.ceil(BRAND_LOGOS.length / 2);
const ROW_B: readonly Brand[] = [...BRAND_LOGOS.slice(HALF), ...BRAND_LOGOS.slice(0, HALF)];

/** White card: every logo keeps its true brand colours on cream and maroon alike. */
function LogoCard({ Logo }: { Logo: ComponentType }) {
  return (
    <div className="flex h-20 w-40 items-center justify-center rounded-2xl bg-white px-6 shadow-[0_10px_24px_-12px_rgba(104,44,44,0.35)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-12px_rgba(104,44,44,0.45)] sm:h-24 sm:w-52 sm:px-8">
      <div className="h-10 w-full sm:h-12">
        <Logo />
      </div>
    </div>
  );
}

interface RowProps {
  brands: readonly Brand[];
  reverse?: boolean;
  paused: boolean;
  /** The second row repeats the same brands, so assistive tech skips it. */
  decorative?: boolean;
}

/**
 * One seamless loop: the list is rendered twice and slides by exactly half its
 * width (compositor-only transform; will-change keeps the strip pre-rastered so
 * nothing repaints while it moves). Spacing is padding on each item, not flex
 * gap, so both halves are identical and the wrap-around never jumps.
 */
function MarqueeRow({ brands, reverse = false, paused, decorative = false }: RowProps) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className="overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <ul
        className={`flex w-max motion-safe:animate-marquee-brands motion-safe:will-change-transform group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${paused ? "[animation-play-state:paused]" : ""}`}
      >
        {[...brands, ...brands].map(({ id, Logo }, i) => {
          const copy = i >= brands.length;
          return (
            <li key={`${id}-${i}`} aria-hidden={copy || undefined} className={`shrink-0 px-2.5 sm:px-3.5 ${copy ? "motion-reduce:hidden" : ""}`}>
              <LogoCard Logo={Logo} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Brands we repair, in their original colours on white cards, in two rows
 * scrolling in opposite directions. Pure CSS keyframes: no JavaScript runs
 * while it moves. WCAG 2.2.2: a visible pause control (hover also pauses);
 * reduced-motion users get a static, wrapped grid of one set.
 */
export function BrandMarquee() {
  const { t } = useOfficial();
  const { isDark } = useTheme();
  const [paused, setPaused] = useState(false);
  const muted = isDark ? "text-theme-color-2/80" : "text-theme-color-4/80";

  return (
    <section
      aria-label={t("brandsLabel")}
      className={`cv-auto relative overflow-hidden border-y py-14 sm:py-16 ${isDark ? "border-theme-color-2/10 bg-theme-color-1/40" : "border-theme-color-4/10 bg-theme-color-1/[0.08]"}`}
    >
      <div className="mb-6 flex items-center justify-center gap-3 px-4 sm:mb-8">
        <span aria-hidden="true" className="hidden h-0.5 w-10 rounded-full bg-theme-color-3 sm:block" />
        <p className={`text-center text-sm font-bold tracking-[0.16em] sm:text-base ${isDark ? "text-theme-color-2" : "text-theme-color-4"}`}>
          {t("brandsLabel")}
        </p>
        <span aria-hidden="true" className="hidden h-0.5 w-10 rounded-full bg-theme-color-3 sm:block" />
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={t(paused ? "brandsPlay" : "brandsPause")}
          className={`tap-48 grid h-9 w-9 shrink-0 place-items-center rounded-full border motion-reduce:hidden ${
            isDark ? "border-theme-color-2/25 text-theme-color-2" : "border-theme-color-4/20 text-theme-color-4"
          }`}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>

      <div className="group/marquee">
        <MarqueeRow brands={BRAND_LOGOS} paused={paused} />
        <div className="motion-reduce:hidden">
          <MarqueeRow brands={ROW_B} reverse paused={paused} decorative />
        </div>
      </div>

      <p className={`mx-auto mt-7 max-w-3xl px-6 text-center text-xs leading-relaxed ${muted}`}>{keepWords(t("brandsDisclaimer"))}</p>
    </section>
  );
}
