import type { Metadata } from 'next';

// ─── OpenGraph Image ──────────────────────────────────────────────────────

export interface OgImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

// ─── Metadata Builder Options ─────────────────────────────────────────────

/** Options for the root layout metadata (applied site-wide). */
export interface RootMetadataOptions {
  /** Twitter @handle — used for twitter:site & twitter:creator */
  twitterHandle?: string;
  /** Default OG image used across the whole site */
  ogImage?: string | OgImage;
  /** Search-engine verification meta tags (Google, Yandex, etc.) */
  verification?: Metadata['verification'];
}

/** Options shared by both static & dynamic page metadata. */
export interface PageMetadataOptions {
  /** Route pathname relative to locale — e.g. '/about'. Defaults to '/' */
  pathname?: string;
  /** OpenGraph content type */
  ogType?: 'website' | 'article' | 'profile';
  /** OG / Twitter card image override for this page */
  image?: string | OgImage;
  /** Extra Metadata fields merged at the end */
  extra?: Partial<Metadata>;
}

/** Explicit data passed to `buildMetadata` for dynamic pages. */
export interface BuildMetadataInput extends PageMetadataOptions {
  title: string | { absolute: string };
  description: string;
  keywords?: string;
}

// ─── SEO Data (used by JSON-LD builders) ──────────────────────────────────

/** Resolved page SEO context — fed into JSON-LD schema builders. */
export interface SeoData {
  locale: string;
  baseUrl: string;
  url: string;
  title: string;
  description: string;
  site_name: string;
  keywords?: string;
}
