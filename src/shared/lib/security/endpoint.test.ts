import { describe, expect, it } from "vitest";
import { resolveApiEndpoint } from "./endpoint";

const origin = "https://seinpanelectronic.com";

describe("resolveApiEndpoint", () => {
  it("uses the configured https API in production", () => {
    expect(resolveApiEndpoint("https://api.example.com", "/api/inquiries", { production: true, origin })?.href).toBe(
      "https://api.example.com/api/inquiries",
    );
  });

  it("falls back to same-origin when no API is configured", () => {
    expect(resolveApiEndpoint(undefined, "/api/inquiries", { production: true, origin })?.href).toBe(`${origin}/api/inquiries`);
  });

  it("refuses plain http in production but allows it in development", () => {
    expect(resolveApiEndpoint("http://api.example.com", "/x", { production: true, origin })).toBeNull();
    expect(resolveApiEndpoint("http://localhost:5000", "/x", { production: false, origin })?.href).toBe("http://localhost:5000/x");
  });

  it("refuses non-http schemes and embedded credentials", () => {
    expect(resolveApiEndpoint("javascript:alert(1)", "/x", { production: true, origin })).toBeNull();
    expect(resolveApiEndpoint("https://user:pass@api.example.com", "/x", { production: true, origin })).toBeNull();
  });
});
