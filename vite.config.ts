/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { metaCsp } from "./security/headers";

/**
 * Content-Security-Policy.
 *
 * GitHub Pages cannot send custom response headers, so the policy ships as a
 * <meta http-equiv> tag (build only — the dev server needs inline scripts for
 * React Fast Refresh). The directives live in security/headers.ts, which also
 * generates the edge headers documented in SECURITY.md.
 */
function contentSecurityPolicy(env: Record<string, string>): Plugin {
  return {
    name: "sp:content-security-policy",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: metaCsp(env) },
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isProd = mode === "production";

  return {
    base: "/",
    plugins: [
      react(),
      contentSecurityPolicy(env),
      preloadCriticalFonts([/noto-sans-myanmar-myanmar-wght-normal-[\w-]+\.woff2$/]),
    ],
    server: { port: 5173, open: true },
    build: {
      sourcemap: false,
      minify: "esbuild",
      cssMinify: "esbuild",
      target: "es2020",
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          // Long-lived vendor chunks: app deploys don't invalidate them.
          manualChunks(id) {
            if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "vendor-react";
            if (/node_modules[\\/](i18next|react-i18next|html-parse-stringify|void-elements)[\\/]/.test(id)) return "vendor-i18n";
            return undefined;
          },
        },
      },
    },
    esbuild: isProd
      ? {
          drop: ["debugger"],
          pure: ["console.log", "console.info", "console.debug", "console.trace"],
          legalComments: "none",
        }
      : undefined,
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: false,
      restoreMocks: true,
    },
  };
});
