import type { MouseEvent } from "react";
import { useOfficial } from "../hooks/useOfficial";

/**
 * Keyboard users can jump past the header. Focus is moved in code rather
 * than through the URL hash, which the tab router owns.
 */
export function SkipLink({ targetId }: { targetId: string }) {
  const { t } = useOfficial();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    target?.focus();
    target?.scrollIntoView({ block: "start" });
  };
  return (
    <a
      href={`#${targetId}`}
      onClick={onClick}
      className="sr-only min-h-12 rounded-xl bg-theme-color-3 px-4 py-3 text-sm font-bold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:inline-flex focus:items-center"
    >
      {t("nav.skipToContent")}
    </a>
  );
}
