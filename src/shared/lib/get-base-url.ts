/**
 * Dynamic base URL resolution for multi-environment deployment support.
 *
 * Detects the app's base URL by checking platform-specific env vars
 * in priority order: Vercel → Netlify → Railway → custom → fallback.
 */
export async function getBaseUrl(): Promise<string> {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    if (process.env.NETLIFY && process.env.URL) {
        return process.env.URL;
    }

    if (process.env.RAILWAY_STATIC_URL) {
        return `https://${process.env.RAILWAY_STATIC_URL}`;
    }

    if (process.env.NEXT_PUBLIC_URL) {
        return process.env.NEXT_PUBLIC_URL;
    }

    return process.env.NODE_ENV === 'production'
        ? 'https://your-domain.com'
        : 'http://localhost:3000';
}
