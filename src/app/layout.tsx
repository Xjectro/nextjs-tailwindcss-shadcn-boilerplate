/**
 * Root Layout Component
 *
 * This is the root layout that wraps all pages in the application.
 * It provides the basic HTML structure and global providers.
 *
 * Note: The actual content rendering happens in the locale-specific layout
 * at /app/[locale]/layout.tsx which handles internationalization.
 */

import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: routing.locales.reduce(
      (acc, locale) => {
        acc[locale] = `/${locale}`;
        return acc;
      },
      {} as Record<string, string>,
    ),
  },
};

/**
 * Root Layout Component
 *
 * This layout only provides the children prop and metadata.
 * The actual HTML structure and providers are handled in the locale-specific layout.
 *
 * @param children - The page content to render
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
