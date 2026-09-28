import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { edgeHeaders, metaCsp } from "./headers";

const START = "<!-- edge-headers:start -->";
const END = "<!-- edge-headers:end -->";

function documentedHeaders(): string {
  const doc = readFileSync(resolve(process.cwd(), "SECURITY.md"), "utf8");
  const block = doc.slice(doc.indexOf(START) + START.length, doc.indexOf(END));
  return block.replace(/```/g, "").trim();
}

describe("security headers", () => {
  it("SECURITY.md lists exactly the headers the edge must send", () => {
    const expected = edgeHeaders()
      .map(([name, value]) => `${name}: ${value}`)
      .join("\n");
    expect(documentedHeaders()).toBe(expected);
  });

  it("forbids inline script, plugins and foreign framing", () => {
    const csp = new Map(edgeHeaders()).get("Content-Security-Policy") ?? "";
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toMatch(/'unsafe-inline'|'unsafe-eval'/);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("allows an https API origin only", () => {
    expect(metaCsp({ VITE_API_URL: "https://api.example.com/v1" })).toContain("connect-src 'self' https://api.example.com;");
    expect(metaCsp({ VITE_API_URL: "http://api.example.com" })).toContain("connect-src 'self';");
    expect(metaCsp({ VITE_API_URL: "not a url" })).toContain("connect-src 'self';");
  });
});
