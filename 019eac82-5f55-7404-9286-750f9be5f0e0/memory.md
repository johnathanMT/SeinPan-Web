**Purpose & context**

Ko Myo Thant is building a complete business website for **Sein Pan Electronic Service**, a TV repair shop (LED, LCD, Plasma) located in North Okkalapa, Yangon, Myanmar, established in 1989 by founder U Win Naing. The project repository is `johnathanMT/sein-pan-electronic-web-` on GitHub. The immediate goal is a polished, live public-facing site; the longer-term goal is a fully functional inquiry system backed by a C# .NET 8 Web API.

A consistent constraint throughout: Ko Myo Thant works **entirely from a mobile phone**, which drives all technical decisions — preferring Claude to execute operations directly rather than manual copy-paste workflows.

---

**Current state**

The frontend is live at `https://johnathanmt.github.io/sein-pan-electronic-web-/` via GitHub Pages. The deployed file is a fully self-contained `index.html` at the repository root — no build step required — using CDN-delivered React 18, Tailwind CSS, Babel standalone, and Lucide Icons.

The site has five tabbed sections:
- **Home** — hero with heritage branding
- **Services** — LED/LCD/Plasma/General repair cards
- **About** — founder timeline for U Win Naing (1989 to present)
- **Inquiry** — validated form with success modal (currently frontend-only)
- **Contact** — stylised map UI, business hours, address history

Design system: deep navy (`#0D1B2A`) with amber-gold (`#C9A84C`); recurring "circuit-trace diamond divider" as a branded decorative element.

A `frontend/SeinPanApp.jsx` also exists in the repo from an earlier phase.

---

**On the horizon**

The agreed next phase is a **C# .NET 8 Web API backend** using Clean Architecture (Domain, Application, Infrastructure, API layers) with an `InquiryController` connected to MySQL via Entity Framework Core — to make the inquiry form functional end-to-end.

---

**Tools & resources**

- **GitHub REST API** (Contents API) — used to commit files directly from the chat terminal via Python `urllib`, bypassing mobile copy-paste limitations
- **GitHub Pages** — live hosting, already enabled on `main` branch at root path
- **CDN stack** — React 18, Tailwind CSS, Babel standalone, Lucide Icons (no build toolchain needed)
- **Planned backend stack** — C# .NET 8, Clean Architecture, Entity Framework Core, MySQL

---

**Key learnings & principles**

Critical GitHub API patterns established during this project:
- Always perform a `GET` to the contents endpoint before a `PUT` to retrieve the current `sha` — omitting `sha` on an existing file returns HTTP 422
- Base64-encode file content with `base64.b64encode(f.read()).decode('utf-8')` (read in binary mode)
- Always set a `User-Agent` header explicitly — GitHub returns 403 without it
- HTTP 409 on `POST /repos/{owner}/pages` means Pages is already configured, not an error
- GitHub PATs should be revoked immediately after use; a revoked token causes 401 on subsequent requests