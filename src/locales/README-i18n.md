# i18n integration — Sein Pan Electronic

Scaffolded files (all under `src/`):

```
src/
├─ i18n.js                         # i18next config (import once in main.jsx)
├─ hooks/useT.js                   # convenience hook: useT("home")
├─ components/
│  ├─ i18n/LanguageSwitcher.jsx    # hub + immersive switcher
│  └─ bento/BentoCard.jsx          # i18n-aware, backward-compatible
├─ styles/i18n-fonts.css           # per-language font switching
└─ locales/
   ├─ en/{common,home,catalog}.json
   ├─ my/{common,home,catalog}.json   # Burmese (Unicode)
   └─ ja/{common,home,catalog}.json   # Japanese
```

## 3 steps to wire it up

### 1. Import i18n once, at app entry
```jsx
// src/main.jsx
import "./i18n";        // BEFORE rendering <App/>
import "./index.css";
```

### 2. Load fonts + the font CSS
Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+Myanmar:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
```
Add to the top of `src/index.css`:
```css
@import "./styles/i18n-fonts.css";
```
And make Tailwind's `font-sans` follow the language (`tailwind.config.ts`):
```ts
theme: { extend: { fontFamily: { sans: ["var(--font-app)", "system-ui", "sans-serif"] } } }
```

### 3. Drop the switcher in
```jsx
import LanguageSwitcher from "./components/i18n/LanguageSwitcher";
<LanguageSwitcher variant="hub" />        // header
<LanguageSwitcher variant="immersive" />  // full-screen pages
```

## Using translations in components
```jsx
import { useT } from "./hooks/useT";
const { t } = useT("home");
t("insights.title");   // from home.json
t("cta.explore");      // falls back to common.json
```

`BentoCard` now accepts a `tKey`:
```jsx
<BentoCard tKey="insights.cards.analytics" highlight href="#" />
// still works the old way too:
<BentoCard title="Conversion tracking" body="..." href="#" />
```

## Peer dependencies
Already installed: `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
The components also use (install if not present):
```bash
npm install framer-motion clsx
```

## Persistence
Language is saved to `localStorage` under key `sp_lang` (cookie fallback). On
return visits it restores automatically — no extra code. Switching language also
updates `<html lang>` and `data-lang`, which swaps the font.
