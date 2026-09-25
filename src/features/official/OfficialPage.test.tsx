import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import axe from "axe-core";
import i18n from "../../shared/i18n";
import OfficialPage from "./OfficialPage";
import { TAB_IDS, type TabId } from "./content";

const missingKeys: string[] = [];
let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  missingKeys.length = 0;
  i18n.options.saveMissing = true;
  i18n.on("missingKey", (_lngs: readonly string[], ns: string, key: string) => {
    missingKeys.push(`${ns}:${key}`);
  });
  consoleError = vi.spyOn(console, "error");
});

afterEach(() => {
  i18n.off("missingKey");
  window.history.replaceState(null, "", "/");
});

async function renderTab(tab: TabId, lang: "my" | "en") {
  await act(async () => {
    await i18n.changeLanguage(lang);
  });
  window.history.replaceState(null, "", tab === "home" ? "/" : `/#${tab}`);
  const view = render(<OfficialPage />);
  // Lazy tabs resolve through Suspense; the page always ends in the footer.
  await screen.findAllByRole("contentinfo");
  if (tab !== "home") await screen.findByRole("heading", { level: 2 });
  await act(async () => {
    await Promise.resolve();
  });
  return view;
}

async function axeViolations(container: HTMLElement): Promise<string[]> {
  const results = await axe.run(container, {
    // jsdom has no layout or rendering: contrast is verified separately (docs/AUDIT.md).
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map((v) => `${v.id} (${v.impact ?? "?"}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
}

describe.each(["my", "en"] as const)("official site (%s)", (lang) => {
  it.each(TAB_IDS)("renders the %s tab without errors, missing translations or a11y violations", async (tab) => {
    const { container } = await renderTab(tab, lang);

    expect(document.documentElement.lang).toBe(lang);
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getByRole("main")).toBeTruthy();
    if (tab === "home") expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();

    expect(missingKeys).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("navigation", () => {
  it("uses real links for every tab so they work without JavaScript routing", async () => {
    await renderTab("home", "en");
    const bottomNav = screen.getByRole("navigation", { name: "Quick navigation" });
    const hrefs = [...bottomNav.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/", "#services", "#about", "#inquiry", "#contact"]);
  });

  it("marks the current tab for assistive technology", async () => {
    await renderTab("contact", "en");
    const bottomNav = screen.getByRole("navigation", { name: "Quick navigation" });
    const current = bottomNav.querySelector('[aria-current="page"]');
    expect(current?.getAttribute("href")).toBe("#contact");
  });

  it("opens external links without window.opener", async () => {
    await renderTab("inquiry", "en");
    for (const link of document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')) {
      expect(link.rel).toContain("noopener");
      expect(link.rel).toContain("noreferrer");
    }
  });
});
