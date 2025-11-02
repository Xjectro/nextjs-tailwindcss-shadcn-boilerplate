import type { Metadata } from 'next';

import { mergeOpenGraph } from '@/utils/meta/open-graph';

export const generateMeta = async (doc: {
  meta: {
    title?: string;
    description?: string;
  };
  slug?: string | string[];
}): Promise<Metadata> => {
  const title = doc?.meta?.title
    ? `${doc?.meta?.title} · ${process.env.NEXT_PUBLIC_APP_TITLE}`
    : process.env.NEXT_PUBLIC_APP_TITLE;

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  };
};
