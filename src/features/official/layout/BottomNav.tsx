import { NAV_TABS } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useNavigation } from "../navigation";
import { NavLink } from "../ui/NavLink";

/** Phone tab bar. Solid background (no backdrop blur), safe-area aware. */
export function BottomNav() {
  const { t } = useOfficial();
  const { active } = useNavigation();
  return (
    <nav
      aria-label={t("nav.quick")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-theme-color-2/15 bg-theme-color-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(104,44,44,0.12)] md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV_TABS.map(({ id, Icon }) => {
          const on = active === id;
          return (
            <li key={id}>
              <NavLink
                to={id}
                markCurrent
                className={`relative flex min-h-14 w-full flex-col items-center justify-center gap-1 px-0.5 py-2 text-center text-[11px] font-semibold transition-colors ${
                  on ? "text-theme-gold" : "text-white/80"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 top-0 h-0.5 rounded-full bg-theme-gold transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
                />
                <Icon size={18} aria-hidden="true" />
                <span className="max-w-full break-words">{t(`nav.${id}`)}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
