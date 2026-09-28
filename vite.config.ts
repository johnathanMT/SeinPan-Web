/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { metaCsp } from "./security/headers.ts";

/**
 * Content-Security-Policy.
 *
 * Vercel sends the full policy as a header (vercel.json). The same directives
 * also ship as a <meta http-equiv> tag as a fallback wherever the page is
 * served without headers (build only — the dev server needs inline scripts
 * for React Fast Refresh). Both come from security/headers.ts.
 */
function contentSecurityPolicy(): Plugin {
  return {
    name: "sp:content-security-policy",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: metaCsp() },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

/**
 * Preload the Burmese display font. Without this the browser only discovers
 * the font after the JavaScript has rendered the page, which delays the hero
 * heading (the LCP element) on slow mobile networks.
 */
function preloadCriticalFonts(patterns: RegExp[]): Plugin {
  return {
    name: "sp:preload-critical-fonts",
    apply: "build",
    enforce: "post",
    transformIndexHtml(_html, ctx) {
      const bundle = ctx.bundle;
      if (!bundle) return [];
      return Object.keys(bundle)
        .filter((file) => patterns.some((re) => re.test(file)))
        .map((file) => ({
          tag: "link",
          attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${file}`, crossorigin: "" },
          injectTo: "head" as const,
        }));
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    contentSecurityPolicy(),
    preloadCriticalFonts([/noto-sans-myanmar-myanmar-wght-normal-[\w-]+\.woff2$/]),
  ],
  server: { port: 5173, open: true },
  build: {
    // Oxc minifies JS (drops `debugger` and legal comments by default);
    // Lightning CSS minifies CSS.
    sourcemap: false,
    target: "es2020",
    assetsInlineLimit: 0,
    rolldownOptions: {
      // Strip debug logging from production; console.warn/error stay.
      treeshake: { manualPureFunctions: ["console.log", "console.info", "console.debug", "console.trace"] },
      output: {
        // Long-lived vendor chunks: app deploys don't invalidate them.
        codeSplitting: {
          groups: [
            { name: "vendor-react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "vendor-i18n", test: /node_modules[\\/](i18next|react-i18next|html-parse-stringify|void-elements)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    restoreMocks: true,
  },
});
