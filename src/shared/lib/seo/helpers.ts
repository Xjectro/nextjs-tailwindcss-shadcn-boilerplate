import { languages, routing } from '@/i18n/routing';

import type { OgImage } from './types';

// ─── OG Locale ────────────────────────────────────────────────────────────

/** Convert an app locale ('en') to an OpenGraph locale ('en_US') using the languages config. */
export function ogLocale(locale: string): string {
  return languages.find((l) => l.code === locale)?.ogLocale ?? locale;
}

/** Return OG locales for every locale *except* the current one. */
export function alternateOgLocales(current: string): string[] {
  return languages.filter((l) => l.code !== current).map((l) => l.ogLocale);
}

// ─── URL Builders ─────────────────────────────────────────────────────────

/** Build the full URL for a given locale + pathname. */
export function localizedUrl(
  baseUrl: string,
  locale: string,
  pathname: string,
): string {
  return locale === routing.defaultLocale
    ? `${baseUrl}${pathname}`
    : `${baseUrl}/${locale}${pathname}`;
}

/**
 * Build an hreflang map for every configured locale + x-default.
 * Used in `alternates.languages` and sitemap generation.
 */
export function hrefLangs(
  baseUrl: string,
  pathname: string,
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const locale of routing.locales) {
    map[locale] = localizedUrl(baseUrl, locale, pathname);
  }

  map['x-default'] = `${baseUrl}${pathname}`;
  return map;
}

// ─── Image Normalizer ─────────────────────────────────────────────────────

/** Normalize a string or OgImage into the array format Next.js expects. */
export function normalizeImage(
  image?: string | OgImage,
): OgImage[] | undefined {
  if (!image) return undefined;
  return typeof image === 'string' ? [{ url: image }] : [image];
}
