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
 * List of supported languages with metadata for SEO and UI purposes.
 * Each language includes:
 * - code: The locale code used in URLs and locale detection (e.g., 'en')
 * - ogLocale: The corresponding OpenGraph locale for SEO (e.g., 'en_US')
 * - name: The human-readable name of the language (e.g., 'English')
 *
 * This structure allows us to easily manage locales and their associated
 * metadata in one place, improving maintainability and consistency across
 * the application.
 */
export const languages = [
  {
    code: 'en',
    ogLocale: 'en_US',
    name: 'English',
  },
  {
    code: 'tr',
    ogLocale: 'tr_TR',
    name: 'Türkçe',
  },
];

/**
 * Routing configuration for next-intl, defining supported locales and default locale.
 * The `defineRouting` function from next-intl is used to create a routing configuration
 * object that can be consumed by the middleware and other parts of the application.
 *
 * The `localePrefix` strategy is set to 'as-needed' to provide cleaner URLs for the default locale
 * while still supporting explicit locale prefixes for non-default locales, which is beneficial for SEO.
 */
export const routing = defineRouting({
  /**
   * List of all supported locales
   * Order matters: first locale is used as fallback in some cases
   */
  locales: languages.map((lang) => lang.code),

  /**
   * Default locale used when:
   * - No locale is specified in the URL
   * - User's preferred locale is not supported
   * - Locale detection fails
   */
  defaultLocale: languages[0].code,

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
