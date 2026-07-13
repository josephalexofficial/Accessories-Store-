/**
 * Resolve the public site origin for Auth.js redirects.
 * Prevents a mistaken AUTH_URL=http://localhost:3000 on Vercel
 * from sending production users to localhost.
 */
export function getAuthBaseUrl(fallbackBaseUrl?: string): string {
  const fromEnv = (process.env.AUTH_URL || process.env.NEXTAUTH_URL || "")
    .trim()
    .replace(/\/$/, "");

  const looksLocal = (value: string) =>
    /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, "")}`
    : "";
  const vercelDeployment = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
    : "";

  // On Vercel production, never trust a localhost AUTH_URL.
  if (process.env.VERCEL && looksLocal(fromEnv)) {
    return (vercelProduction || vercelDeployment || fallbackBaseUrl || fromEnv).replace(
      /\/$/,
      ""
    );
  }

  if (fromEnv && !looksLocal(fromEnv)) {
    return fromEnv;
  }

  if (process.env.VERCEL) {
    return (vercelProduction || vercelDeployment || fallbackBaseUrl || "").replace(
      /\/$/,
      ""
    );
  }

  if (fromEnv) return fromEnv;
  return (fallbackBaseUrl || "http://localhost:3000").replace(/\/$/, "");
}

export function resolveAuthRedirect(url: string, fallbackBaseUrl: string): string {
  const baseUrl = getAuthBaseUrl(fallbackBaseUrl);

  // Relative path — stay on the correct host
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  try {
    const parsed = new URL(url);
    const isLocalHost =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

    if (isLocalHost && process.env.VERCEL) {
      return `${baseUrl}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    // Same-origin absolute URL
    if (parsed.origin === baseUrl) {
      return url;
    }
  } catch {
    /* fall through */
  }

  return baseUrl;
}
