/**
 * Localized Layout
 */

import { ClientProviders } from '@/components/providers/client-provider';
import { ServerProviders } from '@/components/providers/server-providers';
import { Layout } from '@/components/ui/react/design-system';
import { routing } from '@/i18n/routing';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js TailwindCSS ShadCN Boilerplate',
  description:
    'A boilerplate project using Next.js, TailwindCSS, and ShadCN UI components with i18n support.',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
export default async function LocaleLayout({ children, params }: Props) {
  // Await params as required by Next.js 15
  const { locale } = await params;

  // Validate that the incoming locale is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  return (
    <Layout lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServerProviders locale={locale}>
          <ClientProviders>{children}</ClientProviders>
        </ServerProviders>
      </body>
    </Layout>
  );
}
