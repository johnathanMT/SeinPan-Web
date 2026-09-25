# Sein Pan Electronic — Official Website

LED, LCD & Plasma TV repair in Yangon, since 1989. Live at **https://seinpanelectronic.com**.

Vite · React 19 · TypeScript (strict) · Tailwind CSS · i18next (Burmese default, English) · GitHub Pages

## Quick start

```bash
npm install          # after cloning, or after pulling dependency changes
npm run dev          # http://localhost:5173
npm run verify       # everything CI runs: types, lint, translations, tests, build
```

| Script | What it does |
| --- | --- |
| `npm run typecheck` | Strict TypeScript (`noUncheckedIndexedAccess`, no unused code) |
| `npm run lint` | ESLint: type-aware rules, React hooks, **jsx-a11y** accessibility |
| `npm run check:locales` | Burmese and English translations have identical keys; every `t("…")` key exists |
| `npm test` | Unit tests + full-page render in both languages with **axe-core** |
| `npm run build` | Production build into `dist/` |

## Project structure

```
src/
  main.tsx                 entry: i18n, styles, performance tier, render
  app/App.tsx              path switch: shop (/) vs legacy layouts (/hub, /immersive)
  features/
    official/              the public site (TypeScript)
      OfficialPage.tsx     root: theme + navigation contexts, lazy tabs
      content.ts           ids, icons, links (all visible text lives in locales/)
      theme.tsx            colour tokens (WCAG AA verified) + ThemeContext
      navigation.tsx       hash-tab NavigationContext + real hrefs
      hooks/  layout/  sections/  ui/  decor/
    hub/                   legacy /hub + /immersive layouts (lazy chunk, JS)
  shared/
    i18n/                  i18next setup, language store, supported languages
    lib/security/          input sanitisation + API endpoint policy (+ tests)
    lib/text.tsx           Burmese line-breaking + numerals
    hooks/                 shared IntersectionObserver, reduced motion, idle prefetch
    perf/tier.ts           adaptive "lite" mode for low-end phones
  locales/{my,en}/*.json   all copy
  styles/                  Tailwind entry, self-hosted fonts, per-language fonts
  assets/images/           responsive AVIF/WebP/JPEG
```

### Conventions
- **Text:** never hard-code copy. Add it to both `src/locales/my/*.json` and `src/locales/en/*.json`; CI fails if they drift.
- **Colours:** use the theme tokens (`useTheme().tokens`) or `theme-*` Tailwind colours. `theme-color-3` is AA-safe for white text and large headings; use `theme-color-3-ink` for small accent text on light backgrounds.
- **Motion:** CSS only on the public site. Loops use `motion-safe:` and the `perf-loop` class (stopped on low-end devices); scroll reveals use `<Reveal>` / `<RevealGroup>`.
- **Touch targets:** interactive elements are at least 44–48px (`min-h-12`, `h-11` + `tap-48`).
- **Links between tabs:** use `<NavLink to="services">`, a real link with an `href`.

## Toolchain compatibility

Some major versions are intentionally held back (also encoded as Dependabot `ignore` rules):

| Package | Held at | Why |
| --- | --- | --- |
| `typescript` | `~6.0.x` | `typescript-eslint` (type-aware linting) supports TypeScript `<6.1`. TypeScript 7 (native compiler) breaks `npm ci`. |
| `eslint`, `@eslint/js` | `9.x` | `eslint-plugin-jsx-a11y` supports ESLint `<=9`. |
| `@types/node` | `22.x` | Matches the Node 22 used in CI. |

When those plugins publish support for the newer versions, remove the matching rule in `.github/dependabot.yml` and upgrade.

## Deployment

Every push to `main` runs the full verification in GitHub Actions and deploys `dist/` to GitHub Pages only if it all passes.
One-time setting: **Settings → Pages → Source: GitHub Actions**.

## Security

See [SECURITY.md](SECURITY.md). Short version: `VITE_*` variables are public; never put secrets in them.
