/**
 * Resolves the inquiry endpoint from VITE_API_URL.
 *
 * Returns null (form disabled, shows the fallback message) when the base is
 * missing, malformed, uses a non-http(s) scheme, or is plain http in a
 * production build: personal data must never be sent unencrypted.
 */
export function resolveApiEndpoint(
  base: string | undefined,
  path: string,
  { production, origin }: { production: boolean; origin: string },
): URL | null {
  try {
    const url = new URL(path, base ? new URL(base, origin) : origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (production && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}
