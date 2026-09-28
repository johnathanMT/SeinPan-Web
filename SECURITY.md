# Security

## What the site does today

| Control | Where |
| --- | --- |
| Content-Security-Policy: `'self'` only for scripts, styles, fonts and connections; no inline scripts; `object-src 'none'` | `vite.config.ts` (injected as `<meta>` at build) |
| Clickjacking protection (frame-busting, because `frame-ancestors` is ignored in `<meta>`) | `public/boot.js` |
| No third-party requests on the public site except the technician photo from the shop's own Cloudinary account (CSP-scoped to `res.cloudinary.com/dhlhzmmtt/`, sent with no referrer) | `src/styles/fonts.css`, `ui/TechPhoto.tsx` |
| AI-crawler opt-out (`robots.txt`, `noai` meta) and a disclosure contact (`/.well-known/security.txt`) | `public/` , `index.html` |
| SPA route restore accepts only same-site paths | `public/boot.js` |
| `rel="noopener noreferrer"` on every external link | `features/official/content.ts` (`EXTERNAL`) |
| Referrer policy `strict-origin-when-cross-origin` | `index.html` |
| Input normalisation, control/bidi-character stripping, length caps, validation | `src/shared/lib/security/sanitize.ts` |
| API calls: https only in production, no cookies, no referrer, timeout | `src/shared/lib/security/endpoint.ts`, hub `ContactForm.tsx` |
| Bot friction on forms: honeypot + minimum fill time | hub `ContactForm.tsx` |
| Dependency audit blocks deploys on high-severity issues; Dependabot opens weekly patches | `.github/workflows/deploy.yml`, `.github/dependabot.yml` |
| Least-privilege CI (`contents: read`; Pages write only in the deploy job) | `.github/workflows/deploy.yml` |
| Every GitHub Action pinned to a full commit SHA; deploy fails if `dist` contains `.DS_Store`, source maps or `.env` files | `.github/workflows/deploy.yml` |
| One source for the CSP and edge headers, test-locked against this document | `security/headers.ts`, `security/headers.test.ts` |
| Google Maps iframe sandboxed, strict referrer | hub `LocationSection.jsx` |

The public shop page collects **no personal data**: inquiries go to Messenger, Viber or a phone call.

## Environment variables

Every `VITE_*` variable is compiled into the JavaScript that every visitor downloads. **They are public by design.**
Never put API keys, tokens, passwords or connection strings in them — secrets belong only on the server.
`.env*` files are git-ignored (except `.env.example`).

## Cloudflare in front of GitHub Pages

GitHub Pages cannot set custom response headers. The `<meta>` CSP and `boot.js` cover what a page can do by itself;
everything else is added by Cloudflare (free plan). The site needs no code change to be proxied: it has no inline
scripts or styles, no server state, and every asset URL is root-relative.

### 1. Turn the proxy on without breaking HTTPS

1. In GitHub → **Settings → Pages**, confirm the custom domain shows a valid certificate and **Enforce HTTPS** is on
   *before* proxying (GitHub renews its certificate over plain DNS, so issue it first).
2. Add the domain to Cloudflare, keep the GitHub Pages `A`/`AAAA`/`CNAME` records, and switch them to **Proxied**.
3. **SSL/TLS → Overview: Full (strict)**. Never use *Flexible*: it would serve the site over plain HTTP to GitHub.
4. **SSL/TLS → Edge Certificates:** Always Use HTTPS **On**, Minimum TLS **1.2**, TLS 1.3 **On**, Automatic HTTPS Rewrites **On**.

### 2. Turn off features that inject scripts (the CSP would block them)

- **Speed → Optimization:** Rocket Loader **Off**.
- **Scrape Shield:** Email Address Obfuscation **Off** (the site shows no email address anyway).
- **Analytics → Web Analytics:** do not enable *automatic* injection.
- Challenge and block pages are served by Cloudflare itself and are unaffected. Scripts under `/cdn-cgi/` are
  same-origin, so they already pass `script-src 'self'`.

### 3. Security headers

**Rules → Transform Rules → Modify Response Header**, for all requests to `seinpanelectronic.com`, *set* each header
below. `security/headers.ts` generates this list and `security/headers.test.ts` fails if this block drifts from it:

<!-- edge-headers:start -->
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
X-Robots-Tag: noai, noimageai
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data: https://res.cloudinary.com/dhlhzmmtt/; connect-src 'self'; frame-src https://www.google.com; media-src 'none'; object-src 'none'; worker-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; upgrade-insecure-requests; frame-ancestors 'none'
```
<!-- edge-headers:end -->

Add `; preload` to HSTS only once every subdomain serves HTTPS.
Do not add `Cross-Origin-Embedder-Policy`: it would break the Google Maps embed on /hub.
If `VITE_API_URL` is set, add its https origin to `connect-src` here too (the build adds it to the `<meta>` CSP automatically).

### 4. Verify

```
curl -sI https://seinpanelectronic.com/ | grep -iE "strict-transport|content-security|x-frame|x-content-type|server: cloudflare"
```
Then check the site with https://securityheaders.com and https://observatory.mozilla.org.

## Bots, scrapers and AI crawlers

`robots.txt` and `<meta name="robots" content="noai, noimageai">` only stop crawlers that choose to obey them.
Real enforcement happens at the edge. With the domain proxied through Cloudflare (free plan):

1. **Security → Bots → Bot Fight Mode: On** — challenges known automated traffic.
2. **Security → Bots → Block AI Scrapers and Crawlers: On** — blocks verified AI crawlers regardless of `robots.txt`.
3. **Security → WAF → Rate limiting rule** — e.g. more than 60 requests / 10 s from one IP to `seinpanelectronic.com/*` → Block for 1 minute.
4. **Security → WAF → Custom rule** — challenge requests with an empty `User-Agent`, or `cf.client.bot` false and a known scraper UA (`python-requests`, `curl`, `Go-http-client`, `Scrapy`).
5. **Security → Settings → Security level: Medium**, and **Browser Integrity Check: On**.
6. When the inquiry API exists, protect the form with **Cloudflare Turnstile** (verify the token server-side), in addition to the honeypot and minimum fill time.
   Allow `https://challenges.cloudflare.com` in `script-src` and `frame-src` in `vite.config.ts` at that point.

## Vulnerability disclosure

`/.well-known/security.txt` (RFC 9116) lists the contact channels below. Renew its `Expires` date every year.

## Requirements for the inquiry API (.NET 8, when it is built)

Client-side validation is a convenience; **the API is the security boundary.** It must:

1. **Validate again** with the same limits (`name` ≤ 80, `email` ≤ 254, `phone` ≤ 20, `message` ≤ 2000) and reject unknown fields.
2. **Never build SQL from strings.** EF Core LINQ and `FromSqlInterpolated` are parameterised; never use `FromSqlRaw` with concatenation.
3. **Encode on output.** Razor and React escape by default; never render inquiry text as raw HTML in the admin dashboard.
4. **CORS allow-list** only `https://seinpanelectronic.com`.
5. **Rate-limit** the endpoint (e.g. 5 requests / 10 min per IP) and cap the request body size.
6. Use HTTPS + HSTS, and don't log message bodies or other personal data.

```csharp
// DTO: validation attributes on the record's parameters (ASP.NET Core reads them there).
public sealed record InquiryDto(
    [Required, StringLength(80)] string Name,
    [Required, EmailAddress, StringLength(254)] string Email,
    [StringLength(20), RegularExpression(@"^\+?\d{6,15}$")] string? Phone,
    [Required, StringLength(2000)] string Message);

[ApiController]                              // rejects invalid models with 400 automatically
[Route("api/inquiries")]
[EnableCors("site")]
[EnableRateLimiting("inquiries")]
public sealed class InquiryController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(16_384)]
    public async Task<IActionResult> Create(InquiryDto dto, CancellationToken ct)
    {
        db.Inquiries.Add(new Inquiry
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Phone = dto.Phone,
            Message = dto.Message.Trim(),
        });
        await db.SaveChangesAsync(ct);       // EF Core parameterises every value: no SQL injection
        return Accepted();
    }
}

// Program.cs
builder.Services.AddCors(o => o.AddPolicy("site", p => p
    .WithOrigins("https://seinpanelectronic.com")
    .WithMethods("POST")
    .WithHeaders("Content-Type", "Accept")));

builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("inquiries", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",   // per client IP
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10) }));
});

app.UseForwardedHeaders();   // behind Cloudflare: configure KnownProxies so RemoteIpAddress is the visitor's IP
app.UseHsts();
app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.MapControllers();
```

## Reporting a vulnerability

Please message the shop's Facebook page (https://www.facebook.com/seinpanelectronic) or call 09423858609
instead of opening a public issue.
