import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { edgeHeaders, metaCsp } from "./headers";

interface VercelConfig {
  headers: { source: string; headers: { key: string; value: string }[] }[];
}

function vercelGlobalHeaders(): [string, string][] {
  const config = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")) as VercelConfig;
  const global = config.headers.find((rule) => rule.source === "/(.*)");
  return (global?.headers ?? []).map(({ key, value }) => [key, value]);
}

describe("security headers", () => {
  it("vercel.json sends exactly the headers this module defines", () => {
    expect(vercelGlobalHeaders()).toEqual(edgeHeaders().map(([name, value]) => [name, value]));
  });

  it("forbids inline script, plugins and foreign framing", () => {
    const csp = new Map(edgeHeaders()).get("Content-Security-Policy") ?? "";
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toMatch(/'unsafe-inline'|'unsafe-eval'/);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("<meta> CSP matches the edge CSP minus header-only directives", () => {
    const edge = new Map(edgeHeaders()).get("Content-Security-Policy");
    expect(`${metaCsp()}; frame-ancestors 'none'`).toBe(edge);
  });

});
