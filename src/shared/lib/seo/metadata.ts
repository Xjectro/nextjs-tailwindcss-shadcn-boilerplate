import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { getBaseUrl } from '@/shared/lib/get-base-url';

import {
  alternateOgLocales,
  hrefLangs,
  localizedUrl,
  normalizeImage,
  ogLocale,
} from './helpers';
import type {
  BuildMetadataInput,
  PageMetadataOptions,
  RootMetadataOptions,
  SeoData,
} from './types';

// ─── i18n message helpers ─────────────────────────────────────────────────

interface MetadataMessages {
  metadata: {
    root: {
      siteName: string;
      titleTemplate: string;
      defaultTitle: string;
      defaultDescription: string;
    };
    [pageKey: string]: Record<string, string>;
  };
}

function getMetadataMessages(messages: unknown): MetadataMessages['metadata'] {
  return (messages as MetadataMessages).metadata;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  1) Root Layout Metadata
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  Usage in src/app/layout.tsx:
//
//    export const generateMetadata = createRootMetadata();
//
// ─────────────────────────────────────────────────────────────────────────

export function createRootMetadata(
  options: RootMetadataOptions = {},
): () => Promise<Metadata> {
  return async () => {
    const baseUrl = await getBaseUrl();
    const locale = await getLocale();
    const messages = await getMessages();
    const root = getMetadataMessages(messages).root;
    const images = normalizeImage(options.ogImage);

    return {
      metadataBase: new URL(baseUrl),

      title: { default: root.defaultTitle, template: root.titleTemplate },
      description: root.defaultDescription,
      applicationName: root.siteName,
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
        alternateLocale: alternateOgLocales(locale),
        siteName: root.siteName,
        title: { default: root.defaultTitle, template: root.titleTemplate },
        description: root.defaultDescription,
        url: baseUrl,
        ...(images && { images }),
      },

      twitter: {
        card: 'summary_large_image',
        title: { default: root.defaultTitle, template: root.titleTemplate },
        description: root.defaultDescription,
        ...(options.twitterHandle && {
          site: options.twitterHandle,
          creator: options.twitterHandle,
        }),
        ...(images && { images: images.map((i) => i.url) }),
      },

      alternates: {
        canonical: localizedUrl(baseUrl, locale, ''),
        languages: hrefLangs(baseUrl, ''),
      },

      icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },

      ...(options.verification && { verification: options.verification }),
    };
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  2) Static Page Metadata
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  Reads title / description / keywords from messages.metadata[pageKey].
//
//  Usage:
//
//    export const generateMetadata = createPageMetadata('home');
//    export const generateMetadata = createPageMetadata('about', { pathname: '/about' });
//
// ─────────────────────────────────────────────────────────────────────────

export function createPageMetadata(
  pageKey: string,
  options: PageMetadataOptions = {},
): () => Promise<Metadata> {
  return async () => {
    const messages = await getMessages();
    const meta = getMetadataMessages(messages);
    const page = meta[pageKey] ?? {};

    return buildMetadata({
      title: page.title ?? meta.root.defaultTitle,
      description: page.description ?? meta.root.defaultDescription,
      keywords: page.keywords,
      ...options,
    });
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  3) Dynamic Page Metadata
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  For pages where metadata comes from runtime data (CMS, DB, etc.).
//
//  Usage:
//
//    export async function generateMetadata({ params }: Props) {
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
// ─────────────────────────────────────────────────────────────────────────

export async function buildMetadata(
  data: BuildMetadataInput,
): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const root = getMetadataMessages(messages).root;
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
      title: data.title,
      description: data.description,
      url,
      type: data.ogType ?? 'website',
      locale: ogLocale(locale),
      alternateLocale: alternateOgLocales(locale),
      siteName: root.siteName,
      ...(images && { images }),
    },

    twitter: {
      card: 'summary_large_image',
      title: data.title,
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SEO Data Helper (for JSON-LD)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  Resolves all SEO context needed for JSON-LD builders.
//
//  Usage:
//    const seo = await getPageSeoData('home');
//    <JsonLdScript data={jsonLd.website(seo)} />
//
// ─────────────────────────────────────────────────────────────────────────

export async function getPageSeoData(
  pageKey: string,
  pathname = '',
): Promise<SeoData> {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const meta = getMetadataMessages(messages);
  const page = meta[pageKey] ?? {};
  const baseUrl = await getBaseUrl();
  const url = localizedUrl(baseUrl, locale, pathname);

  return {
    locale,
    baseUrl,
    url,
    title: page.title ?? meta.root.defaultTitle,
    description: page.description ?? meta.root.defaultDescription,
    siteName: meta.root.siteName,
    keywords: page.keywords,
  };
}
