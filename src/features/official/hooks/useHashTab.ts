import { useCallback, useEffect, useRef, useState } from "react";
import { isTabId, type TabId } from "../content";
import { prefersReducedMotion } from "../../../shared/hooks/usePrefersReducedMotion";

function readTab(): TabId {
  const id = window.location.hash.slice(1);
  return isTabId(id) ? id : "home";
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/**
 * Hash-based tabs. Each tab gets its own history entry so the phone / browser
 * back button returns to the previous tab instead of leaving the site.
 */
export function useHashTab(): [TabId, (id: TabId) => void] {
  const [active, setActive] = useState<TabId>(readTab);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const sync = () => setActive(readTab());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    scrollToTop();
  }, [active]);

  const navigate = useCallback((id: TabId) => {
    if (id === activeRef.current) {
      scrollToTop();
      return;
    }
    const { pathname, search } = window.location;
    window.history.pushState({ tab: id }, "", id === "home" ? `${pathname}${search}` : `#${id}`);
    setActive(id);
  }, []);

  return [active, navigate];
}
