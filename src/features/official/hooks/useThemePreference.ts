import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "../../../shared/lib/storage";

const STORAGE_KEY = "seinpan_theme";

/** Light/dark choice, persisted across visits. The shop default is light. */
export function useThemePreference(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(() => readStorage(STORAGE_KEY) === "dark");

  useEffect(() => {
    // Native form controls and scrollbars follow the chosen scheme.
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      writeStorage(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  return [isDark, toggle];
}
