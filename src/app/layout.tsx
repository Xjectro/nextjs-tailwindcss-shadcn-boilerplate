import { routing } from '@/i18n/routing';
import { NavigationEvents } from '@/shared/layout/navigation-events';
import { createRootMetadata } from '@/shared/lib/seo';
import { ClientProviders } from '@/shared/providers/client-provider';
import { ServerProviders } from '@/shared/providers/server-providers';
import { Layout } from '@/shared/ui/react/design-system';
import '@/styles/globals.css';
import { getLocale, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

// Site-wide default metadata — all pages inherit these via title.template etc.
export const generateMetadata = createRootMetadata({
  // twitterHandle: '@yourhandle',
  // ogImage: '/og-default.png',
  // verification: { google: '...', yandex: '...' },
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <Layout lang={locale} suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <ServerProviders locale={locale}>
          <ClientProviders>
            <NavigationEvents />
            {children}
          </ClientProviders>
        </ServerProviders>
      </body>
    </Layout>
  );
}
