// ─── SEO utilities ────────────────────────────────────────────────────────
//
//  Modular SEO toolkit for Next.js App Router + next-intl.
//
//  Quick-start:
//
//    Root layout  → export const generateMetadata = createRootMetadata();
//    Static page  → export const generateMetadata = createPageMetadata('about', { pathname: '/about' });
//    Dynamic page → export async function generateMetadata({ params }) {
//                     const post = await getPost((await params).slug);
//                     return buildMetadata({ title: post.title, ... });
//                   }
//    JSON-LD      → const seo = await getPageSeoData('home');
//                   <JsonLdScript data={jsonLd.website(seo)} />
//
// ──────────────────────────────────────────────────────────────────────────

// Types
export type {
  BuildMetadataInput,
  OgImage,
  PageMetadataOptions,
  RootMetadataOptions,
  SeoData,
} from './types';

// Metadata builders
export {
  buildMetadata,
  createPageMetadata,
  createRootMetadata,
  getPageSeoData,
} from './metadata';

// JSON-LD
export { JsonLdScript, jsonLd } from './json-ld';
