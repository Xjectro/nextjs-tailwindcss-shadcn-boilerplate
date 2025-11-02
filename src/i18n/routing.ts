/**
 * Internationalization Routing Configuration
 *
 * This module defines the routing configuration for next-intl, specifying
 * supported locales and the default locale for the application.
 *
 * This configuration is used by:
 * - Middleware for locale detection and routing
 * - Navigation components for locale-aware links
 * - Type safety for locale-related operations
 *
 * @see https://next-intl-docs.vercel.app/docs/routing
 */

import { defineRouting } from 'next-intl/routing';

/**
 * Routing configuration for internationalization
 *
 * Locales:
 * - 'en': English (default)
 * - 'tr': Turkish
 *
 * To add more locales:
 * 1. Add locale code to `locales` array
 * 2. Create corresponding message file in `/messages/{locale}.json`
 * 3. Update TypeScript types if using type safety
 */
export const routing = defineRouting({
  /**
   * List of all supported locales
   * Order matters: first locale is used as fallback in some cases
   */
  locales: ['en', 'tr'],

  /**
   * Default locale used when:
   * - No locale is specified in the URL
   * - User's preferred locale is not supported
   * - Locale detection fails
   */
  defaultLocale: 'en',

  /**
   * Locale prefix strategy
   * - 'always': Always show locale in URL (e.g., /en/about, /tr/about)
   * - 'as-needed': Hide default locale, show others (e.g., /about, /tr/about)
   * - 'never': Never show locale in URL (not recommended for SEO)
   *
   * We use 'as-needed' for better UX:
   * - Default locale (en) URLs are cleaner: /about instead of /en/about
   * - Non-default locales are explicit: /tr/about
   * - Good for SEO and user experience
   */
  localePrefix: 'as-needed',
});

/**
 * Type helper for locale values
 * Extracts the union type from the locales array for type safety
 */
export type Locale = (typeof routing.locales)[number];
