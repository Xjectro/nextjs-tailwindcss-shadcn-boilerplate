/**
 * Root Layout
 */

import { NavigationEvents } from '@/components/layout/navigation-events';
import { ClientProviders } from '@/components/providers/client-provider';
import { ServerProviders } from '@/components/providers/server-providers';
import { Layout } from '@/components/ui/react/design-system';
import { routing } from '@/i18n/routing';
import '@/styles/globals.css';
import { getLocale, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

/**
 * Generate static params for all supported locales
 * This enables static generation at build time for all locales
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Localized layout component
 * Validates locale and provides i18n context to all child components
 */
export default async function RootLayout({ children }: Props) {
  // Await params as required by Next.js 15
  const locale = await getLocale();

  // Validate that the incoming locale is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering for this locale
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
