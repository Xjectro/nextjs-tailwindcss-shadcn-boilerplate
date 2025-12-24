/**
 * Request-Scoped Internationalization Configuration
 *
 * This module provides request-scoped i18n configuration for Server Components
 * and Server Actions in Next.js. It loads the appropriate messages based on
 * the requested locale.
 *
 * Key features:
 * - Automatic locale detection from URL
 * - Dynamic message loading for optimal performance
 * - Consistent time zone handling
 * - Type-safe configuration
 *
 * @see https://next-intl-docs.vercel.app/docs/usage/configuration
 */

import { logger } from '@/services/logger/logger.service';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

/**
 * Request configuration for next-intl
 *
 * This function is called once per request and provides:
 * - Locale validation
 * - Message loading
 * - Time zone configuration
 * - Format configuration
 *
 * The configuration is cached per request and reused across all
 * Server Components in that request.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (from URL or detection)
  // In Next.js 15+, requestLocale needs to be awaited
  let locale = await requestLocale;

  // Validate that the incoming locale is valid
  // If not, use the default locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load messages for the requested locale
  // Messages are loaded dynamically to reduce bundle size
  // Only the messages for the current locale are loaded
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    // If message file doesn't exist, return 404
    // This should never happen in production if properly configured
    notFound();
  }

  return {
    // The resolved locale for this request
    locale,

    // Messages for the current locale
    messages,

    /**
     * Time zone for date/time formatting
     * Options:
     * 1. Use server's time zone: Intl.DateTimeFormat().resolvedOptions().timeZone
     * 2. Use user's time zone from database/cookie
     * 3. Use fixed time zone for consistency
     *
     * We use the server's time zone for simplicity
     * Can be overridden per-component if needed
     */
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    /**
     * Global formats for dates, times, and numbers
     * These can be referenced by name in format functions
     *
     * @example
     * format.dateTime(date, 'short')
     * format.number(value, 'currency')
     */
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
        time: {
          hour: 'numeric',
          minute: 'numeric',
        },
        dateTime: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        },
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'USD', // Can be overridden per-use
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      },
    },

    /**
     * Default translation values
     * These values are available in all translation keys
     *
     * @example
     * In messages: "Welcome {username}!"
     * Usage: t('welcome') // Uses default username
     */
    defaultTranslationValues: {
      // Common HTML elements
      b: (chunks: unknown) => `<strong>${chunks}</strong>`,
      br: () => '<br />',
      appName: 'Leornia',

      // You can add app-specific defaults here
    },

    /**
     * Error handling for missing translations
     * In development, this logs missing keys
     * In production, returns a fallback string
     */
    onError:
      process.env.NODE_ENV === 'development'
        ? (error) => logger.error('i18n error:', error)
        : undefined,

    /**
     * Fallback for missing message keys
     * Returns a placeholder string in development
     */
    getMessageFallback:
      process.env.NODE_ENV === 'development'
        ? ({ namespace, key }) => `${namespace}.${key} (missing)`
        : undefined,
  };
});
