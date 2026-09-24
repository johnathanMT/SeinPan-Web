import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain (seinpanelectronic.com) is served from the site root.
// A project-site base like "/SeinPan-Web/" makes the browser request
// /SeinPan-Web/assets/*, which 404s and leaves a blank page.

function buildCsp(env) {
  const connect = ["'self'"];
  if (env.VITE_API_URL) {
    try {
      connect.push(new URL(env.VITE_API_URL).origin);
    } catch {
      /* invalid URL: leave connect-src at 'self' */
    }
  }

  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    `connect-src ${connect.join(" ")}`,
    // Google Maps embed on /hub.
    "frame-src https://www.google.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// GitHub Pages cannot send custom response headers, so the CSP ships as a
// <meta> tag. Build-only: the dev server relies on inline scripts (React
// Fast Refresh) that this policy would block.
function contentSecurityPolicy(env) {
  return {
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: buildCsp(env) },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isProd = mode === "production";

  return {
    base: "/",
    plugins: [react(), contentSecurityPolicy(env)],
    server: { port: 5173, open: true },
    build: {
      sourcemap: false,
      minify: "esbuild",
      cssMinify: "esbuild",
      target: "es2020",
    },
    esbuild: isProd
      ? {
          drop: ["debugger"],
          // Removed as dead code; console.warn / console.error stay for real failures.
          pure: ["console.log", "console.info", "console.debug", "console.trace"],
        }
      : undefined,
  };
});
