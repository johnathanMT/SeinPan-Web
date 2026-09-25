import { useCallback, useEffect, useId, useState, type Ref } from "react";
import { Menu, Moon, Phone, Sun, Tv, Wrench, X } from "lucide-react";
import { LINKS, NAV_TABS, type TabId } from "../content";
import { useOfficial } from "../hooks/useOfficial";
import { useNavigation } from "../navigation";
import { useTheme } from "../theme";
import { NavLink } from "../ui/NavLink";
import { CTA, HEADER_ICON_BTN } from "../ui/styles";
import { LangToggle } from "./LangToggle";

/**
 * Fixed header. Width budget at 360px: brand (flexible, truncates) +
 * call + language + menu (3 × 44px). Theme toggle moves into the menu on
 * phones. Solid background: the old 95%-opaque backdrop blur cost a full
 * re-blur on every scroll frame for no visible difference.
 */
export function Navbar({ ref }: { ref?: Ref<HTMLElement> }) {
  const [open, setOpen] = useState(false);
  const { t } = useOfficial();
  const { active } = useNavigation();
  const { isDark, toggleTheme } = useTheme();
  const menuId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setOpen(false);
  }, [active]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const tabCls = (id: TabId) =>
    active === id ? "bg-theme-color-2 text-theme-color-4 shadow-sm" : "text-white hover:bg-white/10";

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 shadow-md shadow-theme-color-4/10">
      <div className="hidden bg-theme-color-4 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs tracking-[0.04em]">
          <span className="truncate text-theme-color-2/90">{t("nav.utility")}</span>
          <a
            href={LINKS.tel}
            className="tap-48 inline-flex shrink-0 items-center gap-1.5 font-semibold text-theme-color-2 transition hover:text-white hover:underline hover:underline-offset-4"
          >
            <Phone size={12} aria-hidden="true" />
            {t("phone")}
          </a>
        </div>
      </div>

      <div className="bg-theme-color-1">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <NavLink to="home" onNavigate={close} className="group flex min-h-11 min-w-0 items-center gap-3 rounded-xl">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-theme-color-3 shadow-md shadow-theme-color-4/20 transition group-hover:scale-105">
              <Tv size={18} className="text-white" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-left leading-none">
              <span className="block truncate text-sm font-extrabold leading-snug tracking-wide text-theme-color-2">{t("nav.brand")}</span>
              <span className="hidden text-xs uppercase leading-snug tracking-[0.18em] text-white/80 xl:block">{t("nav.tagline")}</span>
            </span>
          </NavLink>

          <nav aria-label={t("nav.primary")} className="hidden items-center gap-1 rounded-2xl bg-black/10 p-1 xl:flex">
            {NAV_TABS.map(({ id }) => (
              <NavLink
                key={id}
                to={id}
                markCurrent
                className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-4 text-sm font-medium leading-snug transition-colors duration-200 ${tabCls(id)}`}
              >
                {t(`nav.${id}`)}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a href={LINKS.tel} className={`${HEADER_ICON_BTN} sm:hidden`} aria-label={t("nav.call", { phone: t("phone") })}>
              <Phone size={18} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              aria-label={t("nav.toggleTheme")}
              className={`${HEADER_ICON_BTN} hidden sm:grid`}
            >
              {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>

            <LangToggle />

            <NavLink
              to="inquiry"
              className="hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-theme-color-3 px-4 text-sm font-bold leading-snug text-white shadow-md shadow-theme-color-4/20 transition hover:scale-105 hover:opacity-90 xl:inline-flex"
            >
              <Wrench size={14} aria-hidden="true" />
              {t("nav.bookRepair")}
            </NavLink>

            <button
              type="button"
              className={`${HEADER_ICON_BTN} xl:hidden`}
              onClick={() => setOpen((v) => !v)}
              aria-label={t("nav.toggleMenu")}
              aria-expanded={open}
              aria-controls={menuId}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open && (
          <div id={menuId} className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-theme-color-2/15 px-4 pb-4 pt-2 xl:hidden">
            <nav aria-label={t("nav.primary")}>
              <ul className="space-y-1">
                {NAV_TABS.map(({ id, Icon }) => (
                  <li key={id}>
                    <NavLink
                      to={id}
                      markCurrent
                      onNavigate={close}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium transition ${tabCls(id)}`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {t(`nav.${id}`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              className="mt-3 flex min-h-12 w-full items-center gap-3 rounded-xl border border-theme-color-2/30 px-4 text-sm font-semibold text-theme-color-2 transition hover:bg-white/10 sm:hidden"
            >
              {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
              {t("nav.themeLabel")}
            </button>
            <a
              href={LINKS.tel}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-theme-color-2/30 px-4 text-sm font-semibold text-theme-color-2 transition hover:bg-white/10 hover:text-white"
            >
              <Phone size={16} aria-hidden="true" />
              {t("phone")}
            </a>
            <NavLink to="inquiry" onNavigate={close} className={`${CTA} mt-3 w-full`}>
              <Wrench size={16} aria-hidden="true" />
              {t("nav.bookARepair")}
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
