import type { Metadata } from 'next';

/**
 * JSON-LD types
 */
export type JsonLdType = 'BlogPosting' | 'Article' | 'Product' | 'FAQPage';

export interface JsonLdOptions {
  type?: JsonLdType;
  headline?: string;
  description?: string;
  author?: string | string[];
  datePublished?: string;
  dateModified?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SeoOptions extends Partial<Metadata> {
  jsonLd?: JsonLdOptions;
  url?: string; // fallback for OpenGraph
}

/**
 * Generate Metadata for Next.js 16 App Router with SEO support
 * @param options - SEO and metadata options
 * @returns Metadata object compatible with Next.js
 */
export function generateMetadata(options: SeoOptions): Metadata {
  const baseUrl = options.url || process.env.NEXT_PUBLIC_URL || '';

  // OpenGraph defaults
  const openGraphDefaults = {
    title: options.title || '',
    description: options.description || '',
    url: options.openGraph?.url || baseUrl,
    images: options.openGraph?.images || [],
  };

  // Twitter defaults
  const twitterDefaults = {
    site: options.twitter?.site || '',
    creator: options.twitter?.creator || '',
  };

  // JSON-LD script content
  const jsonLd = options.jsonLd
    ? {
        'script:ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': options.jsonLd.type || 'BlogPosting',
          headline: options.jsonLd.headline || options.title || '',
          description: options.jsonLd.description || options.description || '',
          author: options.jsonLd.author || 'Unknown',
          datePublished: options.jsonLd.datePublished,
          dateModified: options.jsonLd.dateModified,
          ...options.jsonLd,
        }),
      }
    : undefined;

  return {
    title: options.title,
    description: options.description,
    openGraph: openGraphDefaults,
    twitter: twitterDefaults,
    other: jsonLd,
  };
}
