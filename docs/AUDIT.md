# Audit — International Premium Commercial Standard (September 2026)

**Scope:** full codebase, plus measurements of the live site (https://seinpanelectronic.com) at
360, 390, 1024 and 1280px in Burmese and English. Contrast was computed with the WCAG 2.1 formula;
bundle sizes are gzip -9 of the production build.

> The brief described a Next.js/TypeScript codebase. It is a **Vite + React 19** single-page app
> (JavaScript, before this work) served statically from GitHub Pages, so each Next.js-specific request
> was implemented with its Vite/static-hosting equivalent.

## 1 · Security

| Finding (before) | Severity | Fix |
| --- | --- | --- |
| `react-router` 7.17 had 5 advisories incl. open redirect & XSS (GHSA-wrjc-x8rr-h8h6, GHSA-h8fp-f39c-q6mh) | High | Upgraded to 7.18.4 **and** removed the router from the public site entirely (now only in the legacy /hub chunk). `npm audit`: 0 vulnerabilities (prod + dev) |
| Build tooling advisories (postcss, browserslist, nanoid, vitest) | Moderate/High (dev) | Patched; vitest 3 → 5 |
| CSP allowed Google Fonts origins (render-blocking third-party CSS) | Low | Fonts self-hosted; CSP now `'self'` only for script/style/font/connect; added `worker-src 'none'`, `media-src 'none'` |
| Contact form (/hub) sent raw input, accepted `http:` endpoints, no timeout | Medium | `sanitize.ts`: NFC, control + bidi-override stripping, grapheme-safe length caps, name/email/phone validation, link-spam check; https-only endpoint policy; `credentials: "omit"`, no referrer, 15 s timeout; honeypot + minimum fill time |
| CI deployed without any checks; `pages: write` + `id-token: write` granted to every job | Medium | CI gates: audit, typecheck, lint (incl. a11y), locale parity, tests; per-job least privilege; Dependabot |
| Secrets exposure | — | None found: no `.env` ever committed, no tokens in any commit. `VITE_*` policy documented |
| Response headers (HSTS, XFO, nosniff, frame-ancestors) | Platform limit | GitHub Pages can't send them. `<meta>` CSP + frame-busting in place; exact Cloudflare rules in `SECURITY.md` |
| SQL injection | — | No database in this repo. API requirements (EF Core parameterisation, `[ApiController]` validation, CORS, rate limiting) in `SECURITY.md` |

## 2 · Mobile performance

| Before | After |
| --- | --- |
| One 596 KB JS bundle (179 KB gz) for every page | Homepage **358 KB / 109 KB gz** (−39%). Inner tabs, circuit decor and legacy pages are lazy chunks, prefetched when idle |
| framer-motion on the homepage; ~20 infinite JS animations, 14 of them on `display:none` elements | **No animation library on the homepage.** CSS keyframes on the compositor; decorative loops stop on low-end devices |
| Scroll parallax via a JS scroll listener + 5 SVG pulses redrawing a triple drop-shadow filter every frame | CSS scroll-driven animations (off the main thread; static where unsupported); pulse glow drawn with plain strokes |
| `backdrop-blur-xl` on the fixed header and tab bar (95% opaque, so invisible) re-blurred on every scroll frame | Solid backgrounds, visually identical |
| Technician photo: 288 KB JPEG at 1027 px | AVIF/WebP/JPEG at 360/540/720 w, cropped to the displayed 4:5 frame: **15–40 KB** on phones; `width`/`height` set; lazy |
| 5 Google font families (2 unused: JetBrains Mono, Noto Sans JP) from 2 third-party origins | 3 self-hosted variable fonts (unicode-range subsets); Burmese font preloaded |
| Header offset measured after paint → 30 px page jump on phones (CLS) | Measured before paint |
| All off-screen sections laid out at load | `content-visibility: auto` on below-the-fold sections |
| — | **Adaptive "lite" tier** (`<html data-perf>`): phones, ≤4 GB RAM, ≤4 cores, Save-Data, 2G and reduced motion get static decor |

Largest Contentful Paint: the hero heading is plain text visible from the first frame (its entrance is
a CSS animation, not JS-gated), and its Burmese font is preloaded.

## 3 · UI/UX & accessibility (WCAG 2.1 AA)

Measured on the live site before the changes, at 360px:

| Finding | After |
| --- | --- |
| **Header 444 px wide: menu button off-screen on every phone < 444 px** (incl. iPhone 12–15); page scrolled sideways | Phone header: brand · call · language · menu (3 × 44 px); theme toggle moved into the menu. Root `overflow-x: clip` + source fix for the technician-card glow |
| 25 of 39 tap targets < 44 px; 15 below the 24 px WCAG minimum (TV power button 65×17 px) | All controls ≥ 44 px, most 48 px (`min-h-12`, `tap-48` hit-area utility) |
| 41 text elements failed contrast; primary CTA (white on `#AE7057`) **4.00:1** | `theme-color-3` → **`#A2664E` (4.62:1)**; `theme-color-3-ink #7E4F3D` for small accent text; gold accents in dark mode; body/muted opacity raised; Messenger/Viber/Facebook buttons darkened to ≥ 4.6:1 |
| 32 text elements < 12 px (down to 9 px) | 12 px minimum for real text; exceptions are decorative TV-panel lettering (hidden from screen readers) and 11 px tab-bar labels (platform convention) |
| No skip link, no visible focus style, unlabeled navs, English-only aria-labels, TV power label | Skip link; two-tone focus ring visible on cream, teal and maroon; labelled navs; `aria-current`, `aria-expanded`, `aria-controls`; all labels translated |
| Brand marquee moved forever with no pause (WCAG 2.2.2); duplicate logos read twice | Pause button; duplicates hidden from assistive tech |
| Tabs were `<button>`s | Real links (`href="#services"`): long-press/new-tab/copy work; focus moves to the new content; page title per tab |
| Reduced motion partly respected | Every loop and reveal is `motion-safe`; smooth scroll respects the setting; global fallback |

Automated: axe-core (jsdom) reports **0 violations on all 5 tabs × 2 languages**; the harness is proven to catch
injected violations. `eslint-plugin-jsx-a11y` runs in CI.

## 4 · Architecture

- 1,847-line `SeinPanOfficialPage.jsx` split into ~35 focused TypeScript modules under `features/official/`
  (hooks, layout, sections, ui, decor), with **strict** TypeScript (`noUncheckedIndexedAccess`, no unused code, no `any`).
- Prop drilling of `isDark` / `setActive` through every component replaced by `ThemeContext` and `NavigationContext`.
- Repeated button/link class strings centralised in `ui/styles.ts`; icons paired to translations in `content.ts`.
- Removed dead code: `SeinPanOfficialWebsite.jsx` (980 lines, never imported), Japanese locale files, `useT`,
  unused English copies inside the old data arrays, unused keyframes, `i18next-browser-languagedetector`.
- Legacy `/hub` + `/immersive` quarantined in `features/hub/` as one lazy chunk with their own translations.
- Quality gates: `npm run verify` (typecheck, lint, locale parity, 52 tests, build) — enforced in CI.

## Open recommendations

1. **Put Cloudflare (free) in front of GitHub Pages** and add the headers in `SECURITY.md`. This is the only way to get
   HSTS, `X-Content-Type-Options` and `frame-ancestors` on this host.
2. **Replace the technician photo** with a real photo of U Win Naing. The current one carries an AI-generator watermark
   and an "EXPERT ELECTRONICS" shirt logo, which undermines trust on a heritage business site.
3. Decide whether `/hub` and `/immersive` should stay public: they contain placeholder data (e.g. a sample customer
   "Emily Carter", placeholder phone numbers) and are not linked from the site.
4. Re-run the live audit (same script, same widths) after deploying, and spot-check on a real low-end Android phone.
5. Later: Trusted Types (`require-trusted-types-for 'script'`) once it can be tested in a real browser.
