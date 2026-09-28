/**
 * Single source of truth for the site's browser security policy.
 *
 *  - metaCsp():     the <meta http-equiv> CSP injected at build (vite.config.ts),
 *                   a fallback wherever the page is served without headers
 *  - edgeHeaders(): the response headers Vercel sends for every path
 *                   (vercel.json; headers.test.ts fails if the two drift)
 *
 * Every font is self-hosted, so no third-party origin is allowed for scripts,
 * styles or fonts. The only third-party image source is the shop's own
 * Cloudinary account, scoped by path so other accounts stay blocked.
 */
const CLOUDINARY_IMAGES = "https://res.cloudinary.com/dhlhzmmtt/";

function cspDirectives(): string[] {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "font-src 'self'",
    `img-src 'self' data: ${CLOUDINARY_IMAGES}`,
    "connect-src 'self'",
    "frame-src 'none'",
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
export function metaCsp(): string {
  return cspDirectives().join("; ");
}

/** Response headers for every path, served by Vercel from vercel.json. */
export function edgeHeaders(): readonly (readonly [name: string, value: string])[] {
  return [
    // Add includeSubDomains (and later preload) only once every subdomain serves HTTPS.
    ["Strict-Transport-Security", "max-age=63072000"],
    ["X-Content-Type-Options", "nosniff"],
    ["X-Frame-Options", "DENY"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"],
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["Cross-Origin-Resource-Policy", "same-site"],
    ["X-Robots-Tag", "noai, noimageai"],
    ["Content-Security-Policy", [...cspDirectives(), "frame-ancestors 'none'"].join("; ")],
  ];
}
