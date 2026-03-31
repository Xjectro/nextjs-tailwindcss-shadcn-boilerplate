import type { Metadata } from 'next';

import { routing, type Locale } from '@/i18n/routing';
import { getBaseUrl } from '@/shared/lib/get-base-url';
import { getLocale, getMessages } from 'next-intl/server';

// ─── Types ────────────────────────────────────────────────────────────────

export interface OgImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface PageSeoOptions {
  /** Route pathname — e.g. '/about'. Defaults to '/' */
  pathname?: string;
  /** OpenGraph content type */
  ogType?: 'website' | 'article' | 'profile';
  /** OG / Twitter card image */
  image?: string | OgImage;
  /** Additional Metadata fields to merge */
  extra?: Partial<Metadata>;
}

export interface RootSeoOptions {
  /** Twitter @handle (applies to twitter:site and twitter:creator) */
  twitterHandle?: string;
  /** Default OG image for the whole site */
  ogImage?: string | OgImage;
  /** Search engine verification meta tags */
  verification?: Metadata['verification'];
}

/** Context returned by getPageSeoData — fed into jsonLd builders */
export interface SeoData {
  locale: string;
  baseUrl: string;
  url: string;
  title: string;
  description: string;
  siteName: string;
  keywords?: string;
}

// ─── Internal Helpers ─────────────────────────────────────────────────────

const OG_LOCALE_MAP: Record<string, string> = { en: 'en_US', tr: 'tr_TR' };

function ogLocale(locale: string) {
  return OG_LOCALE_MAP[locale] ?? locale;
}

function altOgLocales(current: string) {
  return routing.locales.filter((l) => l !== current).map(ogLocale);
}

function hrefLangs(baseUrl: string, pathname: string) {
  const map: Record<string, string> = {};
  for (const l of routing.locales) {
    map[l] =
      l === routing.defaultLocale
        ? `${baseUrl}${pathname}`
        : `${baseUrl}/${l}${pathname}`;
  }
  map['x-default'] = `${baseUrl}${pathname}`;
  return map;
}

function localizedUrl(baseUrl: string, locale: string, pathname: string) {
  return locale === routing.defaultLocale
    ? `${baseUrl}${pathname}`
    : `${baseUrl}/${locale}${pathname}`;
}

function normalizeImage(image?: string | OgImage) {
  if (!image) return undefined;
  return typeof image === 'string' ? [{ url: image }] : [image];
}

// ─── 1) Root Layout SEO ──────────────────────────────────────────────────
//
//  Usage in src/app/layout.tsx:
//    export const generateMetadata = createRootSeo();
//
// ──────────────────────────────────────────────────────────────────────────

export function createRootSeo(
  options: RootSeoOptions = {},
): () => Promise<Metadata> {
  return async () => {
    const baseUrl = await getBaseUrl();
    const locale = await getLocale();
    const messages = (await getMessages()) as Record<
      string,
      Record<string, Record<string, string>>
    >;
    const meta = messages.metadata.root;
    const images = normalizeImage(options.ogImage);

    return {
      metadataBase: new URL(baseUrl),
      title: { default: meta.defaultTitle, template: meta.titleTemplate },
      description: meta.defaultDescription,
      applicationName: meta.siteName,
      generator: 'Next.js',
      referrer: 'origin-when-cross-origin',

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      openGraph: {
        type: 'website',
        locale: ogLocale(locale),
        alternateLocale: altOgLocales(locale),
        siteName: meta.siteName,
        title: { default: meta.defaultTitle, template: meta.titleTemplate },
        description: meta.defaultDescription,
        url: baseUrl,
        ...(images && { images }),
      },

      twitter: {
        card: 'summary_large_image',
        title: { default: meta.defaultTitle, template: meta.titleTemplate },
        description: meta.defaultDescription,
        ...(options.twitterHandle && {
          site: options.twitterHandle,
          creator: options.twitterHandle,
        }),
        ...(images && { images: images.map((i) => i.url) }),
      },

      alternates: {
        canonical: baseUrl,
        languages: hrefLangs(baseUrl, ''),
      },

      icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },

      ...(options.verification && { verification: options.verification }),
    };
  };
}

// ─── 2) Static Page SEO ──────────────────────────────────────────────────
//
//  Auto-reads title / description / keywords from i18n messages[pageKey].
//
//  Usage:
//    export const generateMetadata = createPageSeo('about', { pathname: '/about' });
//
// ──────────────────────────────────────────────────────────────────────────

export function createPageSeo(
  pageKey: string,
  options: PageSeoOptions = {},
): () => Promise<Metadata> {
  return async () => {
    const messages = (await getMessages()) as Record<
      string,
      Record<string, string>
    >;
    const page = messages[pageKey] ?? {};

    return buildMetadata({
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      ...options,
    });
  };
}

// ─── 3) Dynamic Page SEO ─────────────────────────────────────────────────
//
//  For pages with runtime data (e.g. blog posts fetched from a CMS).
//
//  Usage:
//    export async function generateMetadata({ params }) {
//      const post = await getPost((await params).slug);
//      return buildMetadata({
//        title: post.title,
//        description: post.excerpt,
//        pathname: `/blog/${post.slug}`,
//        ogType: 'article',
//        image: post.coverImage,
//      });
//    }
//
// ──────────────────────────────────────────────────────────────────────────

export async function buildMetadata(data: {
  title: string;
  description: string;
  pathname?: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'profile';
  image?: string | OgImage;
  extra?: Partial<Metadata>;
}): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const messages = (await getMessages()) as Record<
    string,
    Record<string, string>
  >;
  const meta = messages.metadata;
  const baseUrl = await getBaseUrl();
  const pathname = data.pathname ?? '';
  const url = localizedUrl(baseUrl, locale, pathname);
  const images = normalizeImage(data.image);

  const metadata: Metadata = {
    title: data.title,
    description: data.description,
    ...(data.keywords && {
      keywords: data.keywords.split(',').map((k) => k.trim()),
    }),

    openGraph: {
      title: `${data.title} | ${meta.siteName}`,
      description: data.description,
      url,
      type: data.ogType ?? 'website',
      locale: ogLocale(locale),
      alternateLocale: altOgLocales(locale),
      siteName: meta.siteName,
      ...(images && { images }),
    },

    twitter: {
      card: 'summary_large_image',
      title: `${data.title} | ${meta.siteName}`,
      description: data.description,
      ...(images && { images: images.map((i) => i.url) }),
    },

    alternates: {
      canonical: url,
      languages: hrefLangs(baseUrl, pathname),
    },
  };

  return data.extra ? { ...metadata, ...data.extra } : metadata;
}

// ─── SEO Data Helper (for JSON-LD) ───────────────────────────────────────
//
//  Usage in server components:
//    const seo = await getPageSeoData('home');
//    <JsonLdScript data={jsonLd.website(seo)} />
//
// ──────────────────────────────────────────────────────────────────────────

export async function getPageSeoData(
  pageKey: string,
  pathname = '',
): Promise<SeoData> {
  const locale = (await getLocale()) as Locale;
  const messages = (await getMessages()) as Record<
    string,
    Record<string, string>
  >;
  const page = messages["metadata.pageKey"] ?? {};
  const meta = messages.metadata;
  const baseUrl = await getBaseUrl();
  const url = localizedUrl(baseUrl, locale, pathname);

  return {
    locale,
    baseUrl,
    url,
    title: page.title ?? meta.defaultTitle,
    description: page.description ?? meta.defaultDescription,
    siteName: meta.siteName,
    keywords: page.keywords,
  };
}

// ─── JSON-LD Structured Data Builders ─────────────────────────────────────

export const jsonLd = {
  /** WebSite schema — use on home page */
  website(data: SeoData & { searchUrl?: string }) {
    return {
      '@context': 'https://schema.org' as const,
      '@type': 'WebSite' as const,
      name: data.siteName,
      url: data.url,
      description: data.description,
      inLanguage: data.locale,
      ...(data.searchUrl && {
        potentialAction: {
          '@type': 'SearchAction',
          target: `${data.searchUrl}{search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }),
    };
  },

  /** WebPage schema — use on inner pages */
  webpage(data: SeoData) {
    return {
      '@context': 'https://schema.org' as const,
      '@type': 'WebPage' as const,
      name: data.title,
      url: data.url,
      description: data.description,
      inLanguage: data.locale,
      isPartOf: {
        '@type': 'WebSite' as const,
        name: data.siteName,
        url: data.baseUrl,
      },
    };
  },

  /** Article / BlogPosting schema */
  article(
    data: SeoData & {
      datePublished: string;
      dateModified?: string;
      author: string | string[];
      image?: string;
    },
  ) {
    const authors = Array.isArray(data.author)
      ? data.author.map((a) => ({ '@type': 'Person' as const, name: a }))
      : { '@type': 'Person' as const, name: data.author };

    return {
      '@context': 'https://schema.org' as const,
      '@type': 'Article' as const,
      headline: data.title,
      description: data.description,
      url: data.url,
      inLanguage: data.locale,
      datePublished: data.datePublished,
      dateModified: data.dateModified ?? data.datePublished,
      author: authors,
      ...(data.image && { image: data.image }),
      publisher: {
        '@type': 'Organization' as const,
        name: data.siteName,
        url: data.baseUrl,
      },
    };
  },

  /** BreadcrumbList schema */
  breadcrumb(items: { name: string; url: string }[]) {
    return {
      '@context': 'https://schema.org' as const,
      '@type': 'BreadcrumbList' as const,
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem' as const,
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
  },

  /** Organization schema */
  organization(data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
  }) {
    return {
      '@context': 'https://schema.org' as const,
      '@type': 'Organization' as const,
      name: data.name,
      url: data.url,
      ...(data.logo && { logo: data.logo }),
      ...(data.description && { description: data.description }),
    };
  },

  /** FAQPage schema */
  faq(questions: { question: string; answer: string }[]) {
    return {
      '@context': 'https://schema.org' as const,
      '@type': 'FAQPage' as const,
      mainEntity: questions.map((q) => ({
        '@type': 'Question' as const,
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: q.answer,
        },
      })),
    };
  },

  /** Product schema */
  product(
    data: SeoData & {
      price: string;
      currency: string;
      availability?: string;
      brand?: string;
      image?: string;
      ratingValue?: number;
      reviewCount?: number;
    },
  ) {
    return {
      '@context': 'https://schema.org' as const,
      '@type': 'Product' as const,
      name: data.title,
      description: data.description,
      url: data.url,
      ...(data.brand && {
        brand: { '@type': 'Brand' as const, name: data.brand },
      }),
      ...(data.image && { image: data.image }),
      ...(data.ratingValue && {
        aggregateRating: {
          '@type': 'AggregateRating' as const,
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount ?? 0,
        },
      }),
      offers: {
        '@type': 'Offer' as const,
        price: data.price,
        priceCurrency: data.currency,
        availability:
          data.availability ?? 'https://schema.org/InStock',
      },
    };
  },
};

// ─── JSON-LD React Component ──────────────────────────────────────────────
//
//  Usage:
//    <JsonLdScript data={jsonLd.website(seo)} />
//
// ──────────────────────────────────────────────────────────────────────────

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
