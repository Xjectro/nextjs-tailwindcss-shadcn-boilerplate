/**
 * Server Providers
 * This file contains all server-side providers that can run on the server.
 * These providers handle server-side features like internationalization.
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

type ServerProvidersProps = {
  children: React.ReactNode;
  locale: string;
};

/**
 * Combined Server Providers
 * Combines all server-side providers into a single component
 * Add new server providers here as needed
 */
export async function ServerProviders({
  children,
  locale,
}: ServerProvidersProps) {
  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
