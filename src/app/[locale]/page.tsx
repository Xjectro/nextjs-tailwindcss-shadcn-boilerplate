import {
  createPageMetadata,
  getPageSeoData,
  jsonLd,
  JsonLdScript,
} from '@/shared/lib/seo';
import { Fragment } from 'react';

// Auto-reads title/description/keywords from messages.metadata.home
export const generateMetadata = createPageMetadata('home');

export default async function HomePage() {
  const seo = await getPageSeoData('home');

  return (
    <Fragment>
      <JsonLdScript data={jsonLd.website(seo)} />
      test
    </Fragment>
  );
}
