import { ArrowLeft, ChevronRight } from "lucide-react";
import { useOfficial } from "../hooks/useOfficial";
import { useNavigation } from "../navigation";
import { useTheme } from "../theme";
import { NavLink } from "../ui/NavLink";

/** Sticky "back to home" bar with a breadcrumb, shown on inner tabs. */
export function BackBar({ top }: { top: number }) {
  const { t } = useOfficial();
  const { isDark, tokens } = useTheme();
  const { active } = useNavigation();
  return (
    <div
      style={{ top }}
      className={`sticky z-40 border-b shadow-sm ${isDark ? "border-theme-color-2/10 bg-theme-color-4" : "border-theme-color-4/10 bg-theme-color-2"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
        <NavLink
          to="home"
          className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-theme-color-1 px-4 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:opacity-90"
        >
          <ArrowLeft size={16} className="shrink-0 transition group-hover:-translate-x-0.5" aria-hidden="true" />
          {t("nav.backHome")}
        </NavLink>
        <nav aria-label={t("nav.breadcrumb")} className={`hidden text-xs sm:block ${tokens.muted}`}>
          <ol className="flex items-center gap-1.5">
            <li>
              <NavLink to="home" className="inline-flex min-h-11 items-center hover:underline hover:underline-offset-4">
                {t("nav.home")}
              </NavLink>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={12} />
            </li>
            <li>
              <span aria-current="page" className={`font-semibold ${tokens.h}`}>
                {t(`nav.${active}`)}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
