/**
 * Single source of truth for the site's browser security policy.
 *
 *  - metaCsp():     the <meta http-equiv> CSP injected at build (vite.config.ts)
 *  - edgeHeaders(): the full response-header set for the Cloudflare
 *                   Transform Rule documented in SECURITY.md
 *
 * GitHub Pages cannot send headers, so the page carries what a <meta> tag can
 * enforce and the edge adds the rest. headers.test.ts fails if SECURITY.md
 * drifts from what this file generates.
 *
 * Every font is self-hosted, so no third-party origin is allowed for scripts,
 * styles or fonts. The only third-party image source is the shop's own
 * Cloudinary account, scoped by path so other accounts stay blocked.
 */
export const CLOUDINARY_IMAGES = "https://res.cloudinary.com/dhlhzmmtt/";

type Env = Readonly<Record<string, string | undefined>>;

function connectSources(env: Env): string[] {
  const sources = ["'self'"];
  if (env.VITE_API_URL) {
    try {
      const api = new URL(env.VITE_API_URL);
      if (api.protocol === "https:") sources.push(api.origin);
    } catch {
      /* invalid URL: connect-src stays 'self' */
    }
  }
  return sources;
}

function cspDirectives(env: Env): string[] {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "font-src 'self'",
    `img-src 'self' data: ${CLOUDINARY_IMAGES}`,
    `connect-src ${connectSources(env).join(" ")}`,
    // Google Maps embed on the legacy /hub page only.
    "frame-src https://www.google.com",
    "media-src 'none'",
    "object-src 'none'",
    "worker-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ];
}

/** CSP for the <meta> tag. frame-ancestors is ignored there (boot.js guards framing instead). */
export function metaCsp(env: Env = {}): string {
  return cspDirectives(env).join("; ");
}

/** Response headers the Cloudflare edge adds in front of GitHub Pages. */
export function edgeHeaders(env: Env = {}): readonly (readonly [name: string, value: string])[] {
  return [
    ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
    ["X-Content-Type-Options", "nosniff"],
    ["X-Frame-Options", "DENY"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"],
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["Cross-Origin-Resource-Policy", "same-site"],
    ["X-Robots-Tag", "noai, noimageai"],
    ["Content-Security-Policy", [...cspDirectives(env), "frame-ancestors 'none'"].join("; ")],
  ];
}
