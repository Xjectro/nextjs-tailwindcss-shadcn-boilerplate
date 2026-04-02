import type { SeoData } from './types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  JSON-LD Structured Data Builders
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const jsonLd = {
  /** WebSite schema — use on the home page. */
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

  /** WebPage schema — use on inner/static pages. */
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

  /** Article / BlogPosting schema. */
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

  /** BreadcrumbList schema. */
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

  /** Organization schema. */
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

  /** FAQPage schema. */
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

  /** Product schema. */
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
        availability: data.availability ?? 'https://schema.org/InStock',
      },
    };
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  JSON-LD React Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  Usage:
//    <JsonLdScript data={jsonLd.website(seo)} />
//

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
