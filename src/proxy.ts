/**
 * Middleware for Internationalization
 *
 * This middleware handles:
 * - Locale detection from Accept-Language header
 * - Locale-based routing and redirects
 * - Cookie-based locale persistence
 *
 * @see https://next-intl-docs.vercel.app/docs/routing/middleware
 */

import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

/**
 * Create and export the internationalization middleware
 *
 * This middleware will:
 * - Detect user's preferred locale
 * - Redirect to appropriate locale path
 * - Handle locale switching
 * - Preserve locale preference in cookies
 */
export default createMiddleware(routing);

/**
 * Middleware configuration
 *
 * Matcher configuration tells Next.js which routes should be processed by this middleware:
 * - Include all routes that need i18n handling
 * - Exclude Next.js internal paths (_next)
 * - Exclude API routes (optional, depends on your needs)
 * - Exclude static files and images
 */
export const config = {
  // Match all pathnames except for:
  // - API routes (if you want to exclude them)
  // - Static files (images, icons, etc.)
  // - Next.js internal files
  matcher: [
    // Match all pathnames
    '/',

    // Match all pathnames within supported locales
    '/(tr|en)/:path*',

    // Match all other pathnames except those starting with:
    // - _next (Next.js internals)
    // - api (API routes - optional exclusion)
    // - Static file extensions
    '/((?!_next|api|.*\\.[\\w]+$).*)',
  ],
};
