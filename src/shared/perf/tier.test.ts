import { describe, expect, it } from "vitest";
import { detectPerformanceTier } from "./tier";

function fakeWindow({ media = [] as string[], deviceMemory = 8, cores = 8, saveData = false, effectiveType = "4g" } = {}): Window {
  return {
    matchMedia: (query: string) => ({ matches: media.includes(query) }),
    navigator: { deviceMemory, hardwareConcurrency: cores, connection: { saveData, effectiveType } },
  } as unknown as Window;
}

describe("detectPerformanceTier", () => {
  it("gives capable desktops the full experience", () => {
    expect(detectPerformanceTier(fakeWindow())).toBe("full");
  });

  it.each([
    ["reduced motion", { media: ["(prefers-reduced-motion: reduce)"] }],
    ["Save-Data", { saveData: true }],
    ["2G", { effectiveType: "slow-2g" }],
    ["low memory", { deviceMemory: 2 }],
    ["few cores", { cores: 4 }],
    ["touch phone", { media: ["(pointer: coarse)", "(max-width: 767px)"] }],
  ])("uses the lite tier for %s", (_label, opts) => {
    expect(detectPerformanceTier(fakeWindow(opts))).toBe("lite");
  });
});
