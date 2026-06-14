# Sein Pan Electronic — Technical Blueprint & Development Playbook

**Author:** Senior Software Engineering Architect
**Project:** Official Commercial Website — Sein Pan Electronic (electronics retail, est. 1989)
**Theme:** "Electronic Circuit" — PCB Green + Copper Gold/Bronze
**Status:** Architecture & Implementation Reference (v1.0)

> **Note on stack direction:** Your project workspace currently references a C# .NET 8 + MySQL build. This blueprint follows the *new* direction in your brief — a **headless / JAMstack architecture** (Next.js + Headless CMS + Supabase). The two are not mutually exclusive: you can keep .NET as a future internal-tools/ERP API while the public storefront runs on the faster, SEO-optimized stack below. Where it matters, I flag the migration path.

---

## 1. Conceptual Blueprint & UI/UX Strategy

### 1.1 Layout Architecture

The storefront is composed of five primary structural zones. Each is a server component by default (Next.js App Router) for SEO and fast first paint, with islands of interactivity hydrated only where needed.

**Header (sticky, translucent on scroll)**
- Left: logo + "Since 1989" trust badge.
- Center: primary nav triggering the Mega Menu.
- Right: search (instant, debounced), inquiry/cart icon, language toggle (English / Myanmar — important for your market).
- Behavior: shrinks on scroll, switches from transparent-over-hero to solid PCB-green with a thin gold bottom border (the "copper trace" accent line).

**Mega Menu (category-driven)**
- Triggered on hover (desktop) / tap (mobile).
- Three-column structure: Category tree → Sub-categories → Featured/Promo card with a product image.
- Categories mirror the catalog IA (Section 1.3): e.g. *Components → Resistors / Capacitors / Semiconductors*, *Tools & Equipment*, *Boards & Modules*, *Cables & Connectors*.
- Render the menu data from the CMS so the shop owner can re-order categories without a deploy.

**Hero Section (with circuit animation)**
- Full-viewport, layered:
  1. Base gradient (deep PCB green → near-black).
  2. Animated SVG "circuit trace" layer — thin gold paths with traveling-pulse dots (`stroke-dasharray` + `requestAnimationFrame`, or a lightweight Lottie file). Keep it GPU-friendly and respect `prefers-reduced-motion`.
  3. Foreground: headline ("Powering Myanmar's Makers Since 1989"), sub-copy, dual CTA (*Browse Catalog* / *Request a Repair / Quote*).
- Performance rule: the animation must never block LCP. Render the headline as static HTML; lazy-mount the animated layer after hydration.

**Product Catalog (the commercial core)**
- Two-pane layout: left filter rail (collapsible drawer on mobile), right product grid.
- Card anatomy: image, name, SKU, key spec chips (e.g. "16V · 100µF"), stock badge, price (or "Request Price"), quick-view button.
- Grid uses skeleton loaders during filter/pagination transitions.

**Footer**
- Four columns: Company (history, branches, contact), Catalog (top categories), Support (inquiry form link, datasheets, FAQ), Legal (privacy, terms).
- A final "copper trace" divider + copyright. Include the 1989 establishment line as a brand-trust signal.

### 1.2 Color-Code Strategy (Tailwind CSS)

Define semantic tokens, not raw hex scattered through components. Add this to `tailwind.config.ts`:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // PCB / Electronic Green — primary brand
        pcb: {
          50:  "#eafff3",
          100: "#c9f7dd",
          200: "#94edbd",
          300: "#57db96",
          400: "#22c06f",
          500: "#0f9d58", // base brand green
          600: "#0a7d46",
          700: "#0a6238", // PCB solder-mask green
          800: "#0b4e2e",
          900: "#0a3d25",
          950: "#022014", // near-black board base
        },
        // Copper / Gold-Bronze — accent (traces, highlights, CTAs)
        copper: {
          50:  "#fdf8ed",
          100: "#f7ebc9",
          200: "#eed28f",
          300: "#e4b75a",
          400: "#d99f33",
          500: "#c8862a", // base copper/bronze
          600: "#a86a20",
          700: "#855020",
          800: "#6e4120",
          900: "#5d381f",
        },
      },
      fontFamily: {
        // technical/legible pairing; ship via next/font
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"], // SKUs & specs
      },
      boxShadow: {
        trace: "0 0 0 1px rgba(200,134,42,0.35), 0 8px 30px rgba(2,32,20,0.45)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
} satisfies Config;
```

**Usage conventions (enforce in code review):**

| Token | Role | Example |
|---|---|---|
| `bg-pcb-950` | Page/board base background | App shell, hero base |
| `bg-pcb-700` | Surfaces, header (solid state) | Header, cards on dark |
| `text-copper-400` | Accent text, active nav, links | Headlines highlight |
| `border-copper-500/40` | "Copper trace" divider lines | Section dividers |
| `bg-copper-500 text-pcb-950` | Primary CTA | "Request a Quote" button |
| `ring-copper-400` | Focus states (accessibility) | Inputs, buttons |

**Accessibility guardrail:** copper-on-green can fail WCAG contrast. Always verify combinations (aim for ≥ 4.5:1 body text). Use `copper-300/400` text on `pcb-900/950` surfaces — not copper on mid-green. Bake a contrast check into your Storybook or a CI a11y test (axe-core).

**Dark mode:** the brand *is* dark by default. If you offer a light mode, invert to a "white silkscreen PCB" look — light gray surfaces, `pcb-700` text, copper accents retained.

### 1.3 Information Architecture & Catalog Filtering

Electronics retail lives or dies on **faceted search**. Model the catalog as Category → Sub-category → Product, with products carrying typed **attributes** that power filters.

**Taxonomy (top level):**
- Components (passive, active, electromechanical)
- Boards & Modules (MCU boards, sensors, breakout modules)
- Tools & Test Equipment (soldering, multimeters, oscilloscopes)
- Power (supplies, batteries, adapters)
- Cables, Connectors & Hardware
- Repair & Spare Parts (ties to the legacy repair business)

**Faceted filters (the differentiator):** unlike fashion retail, electronics filters must be *parametric*. Support:
- **Universal facets:** Category, Brand/Manufacturer, Price range, Availability/Stock, In-stock-only toggle.
- **Parametric facets (per category):** e.g. for capacitors — Capacitance, Voltage rating, Tolerance, Package/Footprint, Mounting (SMD/THT). For tools — power, range, channels.
- **Behavior:** multi-select within a facet (OR), AND across facets. Reflect state in the URL query string (`?cat=capacitors&voltage=16V,25V&inStock=1`) so results are shareable, SEO-indexable, and back-button-friendly.

**Search strategy:** for a catalog under ~10–20k SKUs, Postgres full-text search + trigram (`pg_trgm`) on Supabase is sufficient and free. Beyond that, or for typo-tolerant instant search, layer in **Typesense** or **Meilisearch** (self-hostable, cheaper than Algolia). Index name, SKU, brand, and spec keywords.

---

## 2. Enterprise Tech Stack Recommendation

### 2.1 Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)** | Server components + ISR give SEO-grade HTML and sub-second loads — critical for a commercial catalog that must rank on Google. Built-in image optimization, route handlers for API, edge-ready. |
| **Styling** | **Tailwind CSS** + shadcn/ui | Token-driven theming (Section 1.2), tiny runtime, consistent design system. shadcn for accessible primitives (dialog, combobox for filters). |
| **Headless CMS** | **Sanity.io** (recommended) or Strapi | Lets the shop owner edit products, categories, banners, and the history page without a developer. Sanity's GROQ + real-time + Portable Text is excellent for structured product data; generous free tier; hosted (no server to run). **Strapi** if you prefer self-hosted/open-source and SQL-backed content. |
| **Database** | **Supabase (Postgres)** | Transactional store for inquiries, orders, stock, users. Postgres = real relational integrity for SKUs and parametric attributes. Includes Auth, Row-Level Security, storage, and edge functions out of the box. |
| **Auth** | Supabase Auth (admin) | Email+password / magic link for the admin panel; RLS enforces who reads/writes. |
| **Search** | Postgres FTS → Meilisearch/Typesense at scale | Cost-effective, typo-tolerant. |
| **Hosting** | **Vercel** (frontend) + Supabase cloud (DB) | Zero-config Next.js deploys, preview URLs per PR, global CDN, edge middleware for security headers/rate limiting. |
| **Email/Notifications** | Resend or SendGrid | Inquiry confirmations + admin alerts. |

### 2.2 Why This Architecture (the rationale)

**Separation of content vs. transactional data is the key architectural decision.** Use the CMS (Sanity) for *editorial and catalog content* the owner manages — product descriptions, images, categories, the company history, promo banners. Use Supabase Postgres for *transactional and operational data* — repair inquiries, quote requests, stock counts, audit logs, admin accounts. This gives you:

- **Owner autonomy:** non-technical staff update the catalog daily without touching code or risking the database.
- **Performance:** Next.js builds/ISR-renders catalog pages from CMS data and serves them from the CDN — fast and cheap, because most catalog traffic is read-only.
- **Integrity & security:** inquiries and stock live in a real RDBMS with constraints, transactions, and Row-Level Security — not in a CMS.
- **Scalability path:** if you later add full e-commerce checkout, Postgres already holds your order model; you bolt on a payment provider (Stripe / local gateway) without re-platforming.

**Data flow (read path):**
`Sanity (product content)` → build/ISR → `Next.js (CDN-cached pages)` → user. Live stock/price overlays fetched client- or server-side from `Supabase`.

**Data flow (write path):**
`User inquiry form` → Next.js Route Handler (validate + sanitize + rate-limit) → `Supabase` insert → `Resend` email to admin + user.

---

## 3. Professional Workflow & DevOps

### 3.1 Monorepo Structure

Use a **Turborepo + pnpm workspaces** monorepo so the storefront, future admin app, and shared packages live together with cached builds.

```
sein-pan-electronic/
├─ apps/
│  ├─ web/                 # Next.js storefront (public)
│  │  ├─ src/app/          # App Router routes
│  │  ├─ src/components/   # UI (server + client islands)
│  │  ├─ src/lib/          # data fetchers (sanity, supabase clients)
│  │  └─ src/middleware.ts # security headers, rate limiting
│  ├─ admin/               # (optional) internal dashboard
│  └─ studio/              # Sanity Studio (CMS editing UI)
├─ packages/
│  ├─ ui/                  # shared design system (Tailwind + shadcn)
│  ├─ config/              # eslint, tsconfig, tailwind preset
│  ├─ schemas/             # Sanity schema + Zod validation schemas
│  └─ db/                  # Supabase types, SQL migrations, RLS policies
├─ turbo.json
├─ pnpm-workspace.yaml
└─ package.json
```

**Why a monorepo:** one source of truth for the design system and data types; the Zod schemas in `packages/schemas` validate both the form input (client) and the API insert (server), eliminating drift. Turborepo caches unchanged builds so CI stays fast.

### 3.2 Development Process (step-by-step)

1. **Scaffold.** `pnpm create turbo`; add `apps/web` (Next.js + Tailwind), `apps/studio` (Sanity), shared `packages/*`.
2. **Model content.** Define Sanity schemas (Product, Category, Brand, Page) in `packages/schemas`. Define Supabase tables + RLS in `packages/db` migrations.
3. **Design system first.** Build tokens (Section 1.2) and core components in `packages/ui` with Storybook + axe a11y checks.
4. **Build read path.** Catalog, category, and product pages with ISR. Wire faceted filters to URL state.
5. **Build write path.** Inquiry/quote form → validated Route Handler → Supabase → email.
6. **Admin.** Sanity Studio for catalog; a small protected Next.js admin (or Supabase dashboard) for inquiries/stock.
7. **Harden.** Apply Section 4 security layers before launch.
8. **QA.** Lighthouse (perf/SEO/a11y ≥ 90), Playwright E2E on critical flows (search, filter, submit inquiry).

### 3.3 Branching & CI/CD

- **Git flow:** `main` (production) ← `develop` ← feature branches. Every PR gets a **Vercel Preview Deployment** + Supabase preview branch.
- **CI (GitHub Actions):** on PR run `turbo lint typecheck test build` + Playwright + Lighthouse CI. Block merge on failure.
- **CD:** merge to `main` → Vercel production deploy. Supabase migrations run via `supabase db push` in a guarded deploy step (never auto-destructive).
- **Environments:** `Development` (local + Supabase local), `Preview` (per-PR), `Production`. Secrets in Vercel/GitHub env vars — never committed.

### 3.4 Deployment Strategy

- **Frontend → Vercel:** automatic per-branch, ISR for catalog (revalidate on CMS webhook so owner edits go live in seconds without a full rebuild).
- **CMS → Sanity hosted** (or self-host Studio on Vercel). Configure a **webhook**: Sanity publish → Vercel revalidation endpoint → page re-renders.
- **Database → Supabase cloud:** enable daily backups (PITR on paid tier), connection pooling (PgBouncer) for serverless functions, and separate `anon` vs `service_role` keys.
- **Observability:** Vercel Analytics + Sentry (errors) + Supabase logs. Set uptime monitoring (e.g. Better Stack) on the homepage and inquiry endpoint.

---

## 4. Security Hardening

Treat the public site as hostile-facing. Layer defenses; never rely on a single control.

### 4.1 Security Headers (CSP, HSTS, etc.)

Set globally in `apps/web/src/middleware.ts` (runs at the edge on every request):

```ts
// middleware.ts (excerpt)
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const csp = [
    "default-src 'self'",
    "img-src 'self' https://cdn.sanity.io data: blob:",
    "script-src 'self' 'unsafe-inline'", // tighten with nonces in prod
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://*.supabase.co https://*.sanity.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}
```

Prefer **nonce-based CSP** over `'unsafe-inline'` for scripts in production (Next.js supports this via middleware-generated nonces). Verify with [securityheaders.com] after deploy — target an A grade.

### 4.2 Rate Limiting

Protect form endpoints and search from abuse/DoS. Use **Upstash Redis + `@upstash/ratelimit`** in the inquiry Route Handler and edge middleware:

```ts
// Sliding window: 5 inquiry submissions per IP per 10 min
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
});

const { success } = await limiter.limit(`inquiry:${ip}`);
if (!success) return new Response("Too many requests", { status: 429 });
```

Add a **honeypot field + time-trap** and (optionally) **Cloudflare Turnstile / hCaptcha** on the inquiry form to stop bots without harming UX.

### 4.3 Protected Admin Panel

- **Auth:** Supabase Auth; admin routes gated by middleware that checks the session JWT and a `role = 'admin'` claim.
- **Authorization:** enforce at the data layer with **Row-Level Security** — even if the UI is bypassed, the DB refuses unauthorized reads/writes.
- **Defense in depth:** admin app on a separate route group with its own stricter CSP; short session lifetimes; MFA for admin accounts; audit-log every mutating action (who, what, when).
- **Never** expose the `service_role` key to the browser — server-side only.

```sql
-- Example RLS: only admins can read inquiries
alter table inquiries enable row level security;
create policy "admins read inquiries"
  on inquiries for select
  using ( auth.jwt() ->> 'role' = 'admin' );
```

### 4.4 Input Sanitization (XSS / SQL Injection)

- **SQL injection:** use the Supabase client / parameterized queries exclusively — **never** build SQL by string concatenation. The query builder parameterizes for you.
- **Validation:** validate *every* input with **Zod** on the server (the same schema you use client-side). Reject unexpected fields, enforce types, lengths, and formats (e.g. phone, email).
- **XSS:** React escapes by default — never use `dangerouslySetInnerHTML` with user content. For any rich text (e.g. CMS Portable Text), render through a sanitizer; if HTML is unavoidable, run it through **DOMPurify**.
- **File uploads (datasheets/images):** validate MIME + magic bytes + size; store in Supabase Storage with restricted policies; serve via signed URLs, never executable paths.
- **Output encoding & headers:** combine with the CSP above so even an injected script won't execute.

```ts
// Zod schema reused on client + server
import { z } from "zod";
export const InquirySchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^[0-9+\-\s]{6,20}$/),
  email: z.string().email().optional(),
  productSku: z.string().max(40).optional(),
  message: z.string().min(5).max(2000),
});
```

---

## 5. Prototype Phase — Product Data Modeling

Model products with a **hybrid schema**: a strict relational core (SKU, price, stock — integrity-critical) plus a **flexible attribute layer** (JSONB) for the wildly varying parametric specs of electronic parts. This avoids both a 200-column table and a rigid model that can't describe a new component type.

### 5.1 Sanity Schema (editorial content the owner manages)

```ts
// packages/schemas/product.ts
export default {
  name: "product",
  type: "document",
  fields: [
    { name: "name", type: "string", validation: r => r.required() },
    { name: "slug", type: "slug", options: { source: "name" } },
    { name: "sku", type: "string", validation: r => r.required() }, // unique
    { name: "brand", type: "reference", to: [{ type: "brand" }] },
    { name: "category", type: "reference", to: [{ type: "category" }] },
    { name: "shortDescription", type: "text" },
    { name: "description", type: "array", of: [{ type: "block" }] }, // Portable Text
    { name: "images", type: "array", of: [{ type: "image" }] },
    { name: "datasheets", type: "array", of: [{ type: "file" }] },     // PDF datasheet links
    { name: "datasheetUrls", type: "array", of: [{ type: "url" }] },   // external datasheet links
    {
      name: "specs",                  // parametric attributes
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "key", type: "string" },    // e.g. "Voltage Rating"
          { name: "value", type: "string" },  // e.g. "16V"
          { name: "unit", type: "string" },   // e.g. "V"
        ],
      }],
    },
    { name: "featured", type: "boolean" },
  ],
};
```

### 5.2 Supabase / Postgres Schema (transactional & operational data)

```sql
-- Brands & categories (mirror CMS by slug for joins)
create table brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references categories(id)
);

-- Product operational record (price/stock live here, not in CMS)
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  price_mmk numeric(12,2),            -- nullable => "Request Price"
  stock_qty integer not null default 0,
  is_active boolean not null default true,
  -- flexible parametric specs for faceted filtering
  attributes jsonb not null default '{}'::jsonb,
  search_vector tsvector,             -- full-text search
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index the JSONB + FTS for fast filtering/search
create index idx_products_attributes on products using gin (attributes);
create index idx_products_search on products using gin (search_vector);
create index idx_products_category on products (category_id);

-- Repair / quote inquiries (the lead-capture core)
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  product_sku text,                   -- references products.sku (soft link)
  message text not null,
  status text not null default 'new', -- new | contacted | resolved
  source_ip inet,
  created_at timestamptz default now()
);
```

**Why JSONB for `attributes`:** a capacitor needs *capacitance, voltage, tolerance, ESR*; a multimeter needs *range, accuracy, channels*. Storing these as `{"voltage":"16V","capacitance":"100uF","tolerance":"20%"}` in a GIN-indexed JSONB column lets you add new parametric facets with zero schema migrations, while the relational columns (SKU, price, stock) keep integrity where it counts. Query example:

```sql
-- Faceted filter: 16V capacitors, in stock
select sku, name, price_mmk
from products
where category_id = $1
  and attributes->>'voltage' = '16V'
  and stock_qty > 0
order by name;
```

### 5.3 Datasheet / PDF Handling

- Store PDFs in **Supabase Storage** (or Sanity assets) with a `datasheets` bucket; reference by URL on the product.
- For large/official datasheets, prefer **external URL references** (manufacturer-hosted) to save storage and bandwidth.
- Serve via signed URLs; validate file type on upload (Section 4.4).

### 5.4 Prototype Milestone Checklist

1. Define the 5–6 top categories and 3–4 sample products per category (real SKUs).
2. Stand up Sanity Studio + Supabase tables; seed sample data.
3. Build one fully working vertical slice: **category page → faceted filter → product detail (with datasheet) → inquiry form → DB record → admin sees it.**
4. Validate the JSONB facet model against your two most different product types (a passive component and a tool). If filtering both feels clean, the model holds.

---

## Quick-Start Command Reference

```bash
# 1. Monorepo
pnpm create turbo@latest sein-pan-electronic
cd sein-pan-electronic

# 2. Storefront
pnpm dlx create-next-app@latest apps/web --ts --tailwind --app --src-dir

# 3. CMS
pnpm create sanity@latest -- --template clean --output-path apps/studio

# 4. Database client
pnpm add @supabase/supabase-js zod
pnpm add @upstash/ratelimit @upstash/redis   # rate limiting
pnpm add isomorphic-dompurify                # XSS sanitization

# 5. Run
pnpm turbo dev
```

---

*End of blueprint v1.0. Recommended next action: build the single vertical slice in Section 5.4 before expanding the catalog — it validates the data model, the security path, and the theme system in one pass.*
