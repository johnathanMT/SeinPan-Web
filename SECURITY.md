# Security

## What the site does today

| Control | Where |
| --- | --- |
| Content-Security-Policy: `'self'` only for scripts, styles, fonts and connections; no inline scripts; `object-src 'none'` | `vite.config.ts` (injected as `<meta>` at build) |
| Clickjacking protection (frame-busting, because `frame-ancestors` is ignored in `<meta>`) | `public/boot.js` |
| No third-party requests on the public site (fonts are self-hosted) | `src/styles/fonts.css` |
| `rel="noopener noreferrer"` on every external link | `features/official/content.ts` (`EXTERNAL`) |
| Referrer policy `strict-origin-when-cross-origin` | `index.html` |
| Input normalisation, control/bidi-character stripping, length caps, validation | `src/shared/lib/security/sanitize.ts` |
| API calls: https only in production, no cookies, no referrer, timeout | `src/shared/lib/security/endpoint.ts`, hub `ContactForm.tsx` |
| Bot friction on forms: honeypot + minimum fill time | hub `ContactForm.tsx` |
| Dependency audit blocks deploys on high-severity issues; Dependabot opens weekly patches | `.github/workflows/deploy.yml`, `.github/dependabot.yml` |
| Least-privilege CI (`contents: read`; Pages write only in the deploy job) | `.github/workflows/deploy.yml` |

The public shop page collects **no personal data**: inquiries go to Messenger, Viber or a phone call.

## Environment variables

Every `VITE_*` variable is compiled into the JavaScript that every visitor downloads. **They are public by design.**
Never put API keys, tokens, passwords or connection strings in them — secrets belong only on the server.
`.env*` files are git-ignored (except `.env.example`).

## HTTP security headers (needs an edge in front of GitHub Pages)

GitHub Pages cannot set custom response headers. The `<meta>` CSP and `boot.js` cover what a page can do by itself;
the headers below need a CDN in front of the site. Cloudflare's free plan works: proxy the domain, then add a
**Transform Rule → Modify Response Header** for `seinpanelectronic.com`:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

Also enable **Always Use HTTPS**. Add `; preload` to HSTS only once every subdomain serves HTTPS.
Do not add `Cross-Origin-Embedder-Policy`: it would break the Google Maps embed on /hub.

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
