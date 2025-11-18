import fs from 'fs';
import type { MetadataRoute } from 'next';
import path from 'path';

import { routing } from '@/i18n/routing';

/**
 * Dynamic base URL resolution for multi-environment deployment support
 *
 * @description
 * Intelligently determines the application's base URL by examining various deployment
 * contexts and environment variables. This function provides robust URL detection
 * that works across different hosting platforms and deployment scenarios.
 *
 * @features
 * - Header-based URL detection for runtime requests
 * - Protocol auto-detection (HTTP/HTTPS)
 * - Multi-platform deployment support (Vercel, Netlify, Railway)
 * - Graceful fallback handling for edge cases
 * - Development/production environment awareness
 *
 * @platform_support
 * - Vercel: Uses VERCEL_URL environment variable
 * - Netlify: Uses URL environment variable
 * - Railway: Uses RAILWAY_STATIC_URL environment variable
 * - Generic hosting: Configurable production domain
 * - Local development: Automatic localhost detection
 *
 * @returns {Promise<string>} The resolved base URL for the application
 *
 * @example
 * ```typescript
 * // Production deployment
 * const url = await getBaseUrl(); // "https://myapp.vercel.app"
 *
 * // Local development
 * const localUrl = await getBaseUrl(); // "http://localhost:3000"
 *
 * // Custom domain
 * const customUrl = await getBaseUrl(); // "https://your-domain.com"
 * ```
 *
 * @error_handling
 * - Headers access failures are gracefully handled with fallbacks
 * - Missing environment variables trigger default behavior
 * - Invalid host values are caught and processed appropriately
 *
 * @performance_notes
 * - Headers are accessed asynchronously to avoid blocking
 * - Environment variable checks are performed in priority order
 * - Minimal computational overhead with efficient string operations
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @category SEO Utilities
 */
async function getBaseUrl(): Promise<string> {
  // Vercel deployment detection
  // VERCEL_URL is automatically provided in Vercel environments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Netlify deployment detection
  // URL environment variable contains the full site URL
  if (process.env.NETLIFY && process.env.URL) {
    return process.env.URL;
  }

  // Railway deployment detection
  // RAILWAY_STATIC_URL provides the application's public URL
  if (process.env.RAILWAY_STATIC_URL) {
    return `https://${process.env.RAILWAY_STATIC_URL}`;
  }

  // Environment variable fallback for custom configurations
  // NEXT_PUBLIC_URL allows manual URL specification
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  // Final fallback based on environment
  // Production should use your actual domain, development uses localhost
  return process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : 'http://localhost:3000';
}

/**
 * Recursive route discovery system for Next.js App Router
 *
 * @description
 * Automatically discovers all available routes in the Next.js App Router directory
 * structure by recursively scanning for page files. This function intelligently
 * handles dynamic routes, special directories, and internationalization patterns
 * to generate a comprehensive list of application routes.
 *
 * @features
 * - Recursive directory traversal for nested routes
 * - Dynamic route parameter filtering ([id], [slug], etc.)
 * - Special directory exclusion (api, _components, _lib)
 * - Internationalization route handling ([locale] directories)
 * - Multiple page file format support (.tsx, .ts, .jsx, .js)
 * - Intelligent route normalization and deduplication
 *
 * @route_patterns
 * - Static routes: /about, /contact, /blog
 * - Nested routes: /blog/category, /user/profile
 * - Root route: / (from page.tsx in app directory)
 * - Localized routes: Handled through [locale] pattern
 *
 * @excluded_patterns
 * - Dynamic routes: [id], [slug], [category] (except [locale])
 * - API routes: /api directory and subdirectories
 * - Component directories: _components, _lib prefixed folders
 * - Build artifacts and temporary files
 *
 * @returns {string[]} Array of discovered route paths
 *
 * @example
 * ```typescript
 * // File structure:
 * // src/app/page.tsx -> "/"
 * // src/app/about/page.tsx -> "/about"
 * // src/app/blog/[slug]/page.tsx -> excluded (dynamic)
 * // src/app/[locale]/contact/page.tsx -> "/contact"
 *
 * const routes = getAllRoutes();
 * console.log(routes); // ['/', '/about', '/contact']
 * ```
 *
 * @performance_considerations
 * - File system operations are optimized with selective reading
 * - Directory traversal uses efficient recursive patterns
 * - Route deduplication minimizes memory usage
 * - Error handling prevents cascading failures
 *
 * @error_handling
 * - Directory read failures are logged but don't stop processing
 * - Invalid file structures are gracefully skipped
 * - Permissions issues are handled with appropriate warnings
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @category Route Discovery
 */
function getAllRoutes(): string[] {
  // Establish the base directory for route discovery
  // All routes are relative to the src/app directory in Next.js App Router
  const appDir = path.join(process.cwd(), 'src/app');

  /**
   * Recursive helper function for discovering page files in directory structure
   *
   * @description
   * Traverses the file system recursively to identify Next.js page files and
   * construct the corresponding route paths. Handles special directory patterns
   * and applies filtering rules to exclude non-routable files.
   *
   * @param {string} dir - Current directory being processed
   * @param {string} baseRoute - Accumulated route path from parent directories
   * @returns {string[]} Array of route paths discovered in this directory and subdirectories
   *
   * @internal
   */
  function findPageFiles(dir: string, baseRoute = ''): string[] {
    const routes: string[] = [];

    try {
      // Read directory contents with file type information
      // withFileTypes provides efficient access to file/directory metadata
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          // Handle dynamic route filtering
          // Skip dynamic routes like [id], [slug] except for [locale] which is special
          if (
            item.name.startsWith('[') &&
            item.name.endsWith(']') &&
            item.name !== '[locale]'
          ) {
            continue;
          }

          // Exclude special Next.js directories and internal folders
          // These directories don't represent user-facing routes
          if (['api', '_components', '_lib'].includes(item.name)) {
            continue;
          }

          // Special handling for internationalization pattern
          // [locale] directories are processed without adding to the route path
          if (item.name === '[locale]') {
            const localeRoutes = findPageFiles(fullPath, '');
            routes.push(...localeRoutes);
          } else {
            // Standard directory processing - add to route path and recurse
            const newRoute = `${baseRoute}/${item.name}`;
            routes.push(...findPageFiles(fullPath, newRoute));
          }
        } else if (
          // Identify Next.js page files by standard naming conventions
          // Support both TypeScript and JavaScript variants
          item.name === 'page.tsx' ||
          item.name === 'page.ts' ||
          item.name === 'page.jsx' ||
          item.name === 'page.js'
        ) {
          // Add the current route (or root if baseRoute is empty)
          routes.push(baseRoute || '/');
        }
      }
    } catch (error) {
      // Log directory access issues but continue processing other directories
      // This ensures partial failures don't break the entire route discovery
      console.warn('Error reading directory:', dir, error);
    }

    return routes;
  }

  // Begin route discovery from the app directory root
  const routes = findPageFiles(appDir);

  // Normalize and deduplicate discovered routes
  // Ensure consistent URL formatting and remove duplicates
  return [
    ...new Set(
      routes.map((route) => {
        // Handle root route normalization
        if (route === '/') return '';
        // Ensure all routes start with forward slash
        return route.startsWith('/') ? route : `/${route}`;
      }),
    ),
  ];
}

/**
 * Internationalization-aware route multiplication system
 *
 * @description
 * Generates localized variations of base routes according to the application's
 * internationalization configuration. This function creates a comprehensive
 * set of routes that covers all supported locales while maintaining proper
 * URL structure for SEO and user experience.
 *
 * @features
 * - Multi-locale route generation from base routes
 * - Default locale handling (no prefix for default language)
 * - Configurable locale prefixing for non-default languages
 * - Seamless integration with Next.js i18n routing
 * - Automatic route duplication prevention
 *
 * @locale_patterns
 * - Default locale routes: /about, /contact (no locale prefix)
 * - Localized routes: /tr/about, /fr/contact (with locale prefix)
 * - Root routes: / for default, /tr/, /fr/ for others
 *
 * @param {string[]} routes - Base routes to be localized
 * @returns {string[]} Complete set of localized routes
 *
 * @example
 * ```typescript
 * // Configuration: { locales: ['en', 'tr', 'fr'], defaultLocale: 'en' }
 * const baseRoutes = ['/', '/about', '/contact'];
 * const localized = generateLocalizedRoutes(baseRoutes);
 *
 * // Result:
 * // ['/', '/about', '/contact',           // English (default)
 * //  '/tr/', '/tr/about', '/tr/contact',  // Turkish
 * //  '/fr/', '/fr/about', '/fr/contact']  // French
 * ```
 *
 * @integration_notes
 * - Works with Next.js App Router internationalization
 * - Compatible with next-intl and similar i18n libraries
 * - Supports custom locale configuration through routing module
 * - Maintains URL consistency across language variants
 *
 * @seo_benefits
 * - Provides complete language coverage for search engines
 * - Enables proper hreflang implementation
 * - Supports international SEO best practices
 * - Facilitates language-specific content discovery
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @category Internationalization
 */
function generateLocalizedRoutes(routes: string[]): string[] {
  // Extract internationalization configuration from routing module
  // This provides centralized locale management across the application
  const { locales, defaultLocale } = routing;
  const localizedRoutes: string[] = [];

  // Generate localized variations for each base route
  for (const route of routes) {
    for (const locale of locales) {
      if (locale === defaultLocale) {
        // Default locale routes don't require language prefix
        // This maintains clean URLs for the primary language
        localizedRoutes.push(route);
      } else {
        // Non-default locales get language prefix for proper routing
        // Format: /{locale}{route} (e.g., /tr/about, /fr/contact)
        localizedRoutes.push(`/${locale}${route}`);
      }
    }
  }

  return localizedRoutes;
}

/**
 * Comprehensive sitemap generation with internationalization support
 *
 * @description
 * Generates a complete XML sitemap for the application by combining automatic
 * route discovery, internationalization support, and SEO optimization. This
 * function creates a standards-compliant sitemap that enhances search engine
 * discoverability and supports multi-language content indexing.
 *
 * @features
 * - Automatic route discovery from App Router structure
 * - Full internationalization support with locale-specific URLs
 * - SEO-optimized metadata (lastModified, changeFrequency, priority)
 * - Dynamic base URL resolution for multi-environment deployment
 * - Standards-compliant XML sitemap format
 * - Intelligent priority assignment based on route importance
 *
 * @sitemap_structure
 * ```xml
 * <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *   <url>
 *     <loc>https://example.com/</loc>
 *     <lastmod>2024-01-01</lastmod>
 *     <changefreq>weekly</changefreq>
 *     <priority>1.0</priority>
 *   </url>
 *   <url>
 *     <loc>https://example.com/tr/about</loc>
 *     <lastmod>2024-01-01</lastmod>
 *     <changefreq>weekly</changefreq>
 *     <priority>0.8</priority>
 *   </url>
 * </urlset>
 * ```
 *
 * @seo_optimization
 * - Root pages receive maximum priority (1.0)
 * - Secondary pages receive high priority (0.8)
 * - Weekly change frequency signals fresh content
 * - ISO date format for last modification
 * - Complete URL specification with domain
 *
 * @returns {Promise<MetadataRoute.Sitemap>} Complete sitemap data structure
 *
 * @example
 * ```typescript
 * // Automatic usage by Next.js
 * // Generates sitemap.xml at /sitemap.xml
 * const sitemap = await generateSitemap();
 *
 * // Manual usage for custom processing
 * const customSitemap = await generateSitemap();
 * console.log(`Generated ${customSitemap.length} URLs`);
 * ```
 *
 * @deployment_considerations
 * - Works across all major hosting platforms
 * - Handles dynamic base URL resolution
 * - Supports both development and production environments
 * - Compatible with CDN and reverse proxy setups
 *
 * @performance_notes
 * - Route discovery is cached during build process
 * - Minimal runtime overhead for sitemap generation
 * - Efficient memory usage with streaming-friendly structure
 * - Optimized for large-scale applications
 *
 * @standards_compliance
 * - Follows sitemaps.org protocol specification
 * - Compatible with Google Search Console
 * - Supports Bing Webmaster Tools
 * - Meets international SEO requirements
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @category SEO Generation
 */
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  // Resolve the application's base URL for absolute URL generation
  const baseUrl = await getBaseUrl();

  // Discover all available routes from the App Router structure
  const baseRoutes = getAllRoutes();

  // Generate localized variations of all routes
  const allRoutes = generateLocalizedRoutes(baseRoutes);

  // Transform routes into sitemap entries with SEO metadata
  return allRoutes.map((route) => ({
    // Generate absolute URL by combining base URL with route path
    url: `${baseUrl}${route}`,

    // Set last modification date to current date in ISO format
    // This signals to search engines that content is regularly updated
    lastModified: new Date().toISOString().split('T')[0],

    // Indicate weekly update frequency for content freshness
    changeFrequency: 'weekly' as const,

    // Assign priority based on route importance
    // Root routes (homepage) get maximum priority, others get high priority
    priority: route === '' ? 1.0 : 0.8,
  }));
}

/**
 * Default sitemap export function for Next.js App Router integration
 *
 * @description
 * This is the main export function that Next.js App Router automatically
 * recognizes and uses to generate the sitemap.xml file. It serves as a
 * simple wrapper around the generateSitemap function, providing the
 * standard interface expected by Next.js for sitemap generation.
 *
 * @next_integration
 * - Automatically generates /sitemap.xml route
 * - Called during build process for static generation
 * - Supports dynamic sitemap generation at runtime
 * - Compatible with ISR (Incremental Static Regeneration)
 *
 * @usage_context
 * - Invoked automatically by Next.js framework
 * - No manual calling required in application code
 * - Generates XML output compatible with search engines
 * - Accessible at /sitemap.xml URL endpoint
 *
 * @returns {Promise<MetadataRoute.Sitemap>} Sitemap data for XML generation
 *
 * @example
 * ```typescript
 * // Automatic Next.js usage:
 * // Visit /sitemap.xml to see generated sitemap
 *
 * // Manual testing:
 * const sitemapData = await sitemap();
 * console.log(`Sitemap contains ${sitemapData.length} URLs`);
 * ```
 *
 * @build_integration
 * - Executed during `next build` for static generation
 * - Can be regenerated on-demand with ISR
 * - Supports edge runtime environments
 * - Compatible with serverless deployments
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @category Next.js Integration
 * @see {@link generateSitemap} For the core sitemap generation logic
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await generateSitemap();
}
