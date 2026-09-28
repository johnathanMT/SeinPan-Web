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
| Dependency audit blocks deploys on high-severity issues; Dependabot opens weekly patches | `.github/workflows/deploy.yml`, `.github/dependabot.yml` |
| Least-privilege CI (`contents: read`; Pages write only in the deploy job) | `.github/workflows/deploy.yml` |
| Every GitHub Action pinned to a full commit SHA; deploy fails if `dist` contains `.DS_Store`, source maps or `.env` files | `.github/workflows/deploy.yml` |
| HTTP security headers on every response, one source test-locked to `vercel.json` | `security/headers.ts`, `vercel.json` |
| No iframes, forms or API calls: `frame-src`, `media-src`, `worker-src` and `object-src` are all `'none'` | `security/headers.ts` |

The public shop page collects **no personal data**: inquiries go to Messenger, Viber or a phone call.

## Environment variables

Every `VITE_*` variable is compiled into the JavaScript that every visitor downloads. **They are public by design.**
Never put API keys, tokens, passwords or connection strings in them — secrets belong only on the server.
`.env*` files are git-ignored (except `.env.example`).

## Hosting and response headers (Vercel)

The site is served by **Vercel** (`www.seinpanelectronic.com`; the bare domain redirects there). Every push to
`main` deploys automatically. Security headers come from `vercel.json`, which `security/headers.test.ts` keeps
identical to `security/headers.ts`, so change headers there and copy the output into `vercel.json`:

| Header | Why |
| --- | --- |
| `Content-Security-Policy` | Only this site's own scripts, styles and fonts; images also from the shop's Cloudinary account; no iframes, plugins or workers; `frame-ancestors 'none'` |
| `X-Frame-Options: DENY` | Clickjacking protection for older browsers |
| `Strict-Transport-Security: max-age=63072000` | HTTPS only for two years. Add `includeSubDomains` (then `preload`) only once every subdomain serves HTTPS |
| `X-Content-Type-Options: nosniff` | No MIME sniffing |
| `Referrer-Policy`, `Permissions-Policy` | No full-URL referrers; camera, microphone, location, payment, USB and topics disabled |
| `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` | Isolates the window; other sites can't embed the site's files |
| `X-Robots-Tag: noai, noimageai` | AI-training opt-out on every response, images included |

Hashed build files under `/assets/` are cached for a year (`immutable`); HTML is always revalidated.
The `<meta>` CSP in `index.html` and the frame-busting in `public/boot.js` stay as a fallback wherever the page is
served without these headers (e.g. a local preview). Do not add `Cross-Origin-Embedder-Policy`: it would require the
Cloudinary photo to opt in with CORP/CORS headers, or it stops loading.

Verify after a deploy:

```
curl -sI https://www.seinpanelectronic.com/ | grep -iE "content-security|x-frame|strict-transport|x-content-type"
```
Then check the site with https://securityheaders.com and https://observatory.mozilla.org.

## Bots, scrapers and AI crawlers

`robots.txt` and the `noai` tags only stop crawlers that choose to obey them. Enforcement happens in the
**Vercel dashboard → Project → Firewall**:

1. **Bot Protection** (managed ruleset): *Challenge* non-browser traffic.
2. **AI Bots** (managed ruleset): *Deny* known AI crawlers regardless of `robots.txt`.
3. **Custom rule**: rate-limit one IP, e.g. more than 100 requests per 60 s → Deny (rate limiting may need a paid
   plan).
4. **Attack Challenge Mode**: turn on only during an active attack.
5. When the inquiry API exists, protect the form with a CAPTCHA such as **Cloudflare Turnstile** (verify the token
   server-side), plus a hidden honeypot field and a minimum fill time. Allow its origin in `script-src` and
   `frame-src` in `security/headers.ts` at that point.

## Vulnerability disclosure

`/.well-known/security.txt` (RFC 9116) lists the contact channels below. Renew its `Expires` date every year.

## Requirements for the inquiry API (.NET 8, when it is built)

Inquiries currently go to Messenger, Viber or a phone call; the site has no form. When a form and API are added,
add the API's https origin to `connect-src` in `security/headers.ts`, validate on the client for UX only, and
remember **the API is the security boundary.** It must:

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

app.UseForwardedHeaders();   // behind a proxy/CDN: configure KnownProxies so RemoteIpAddress is the visitor's IP
app.UseHsts();
app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.MapControllers();
```

## Reporting a vulnerability

Please message the shop's Facebook page (https://www.facebook.com/seinpanelectronic) or call 09423858609
instead of opening a public issue.
