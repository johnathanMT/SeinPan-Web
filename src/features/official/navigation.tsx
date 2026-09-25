import { createContext, useContext } from "react";
import type { TabId } from "./content";

export interface NavigationContextValue {
  active: TabId;
  navigate: (id: TabId) => void;
}

export const NavigationContext = createContext<NavigationContextValue>({
  active: "home",
  navigate: () => {
    /* default: no provider mounted */
  },
});

export function useNavigation(): NavigationContextValue {
  return useContext(NavigationContext);
}

/** Real href for a tab, so links work with middle-click / long-press / copy. */
export function tabHref(id: TabId): string {
  if (id !== "home") return `#${id}`;
  const { pathname, search } = window.location;
  return `${pathname}${search}`;
}
