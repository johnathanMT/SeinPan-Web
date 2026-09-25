import type { MouseEvent, ReactNode } from "react";
import type { TabId } from "../content";
import { tabHref, useNavigation } from "../navigation";

interface NavLinkProps {
  to: TabId;
  className?: string;
  children: ReactNode;
  /** Runs after navigation (e.g. close a menu). */
  onNavigate?: () => void;
  /** Mark as current page when active (primary navs). */
  markCurrent?: boolean;
  "aria-label"?: string;
}

/**
 * A real link for in-page tabs: keyboard, middle-click, long-press "open in
 * new tab" and copy-link all work, while a normal click stays in the SPA.
 */
export function NavLink({ to, className, children, onNavigate, markCurrent = false, ...rest }: NavLinkProps) {
  const { active, navigate } = useNavigation();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return; // let the browser open a new tab / window
    }
    event.preventDefault();
    navigate(to);
    onNavigate?.();
  };
  return (
    <a
      href={tabHref(to)}
      onClick={onClick}
      aria-current={markCurrent && active === to ? "page" : undefined}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
