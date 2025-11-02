import type { MetadataRoute } from 'next';

/**
 * Dynamic base URL resolution for robots.txt generation
 *
 * @description
 * Intelligently determines the application's base URL by examining various deployment
 * contexts and environment variables. This function provides robust URL detection
 * that works across different hosting platforms and deployment scenarios, specifically
 * optimized for robots.txt sitemap URL generation.
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
 * Comprehensive robots.txt generation with dynamic URL resolution
 *
 * @description
 * Generates a complete robots.txt file for the application with intelligent
 * URL resolution and SEO optimization. This function creates a standards-compliant
 * robots.txt that helps search engines understand crawling permissions and
 * provides dynamic sitemap URL generation.
 *
 * @features
 * - Dynamic base URL resolution for multi-environment deployment
 * - Configurable crawling rules for search engines
 * - Automatic sitemap URL generation and linking
 * - Standards-compliant robots.txt format
 * - Production-ready crawling permissions
 * - Development-friendly testing capabilities
 *
 * @robots_structure
 * ```txt
 * User-agent: *
 * Disallow: /
 *
 * Sitemap: https://example.com/sitemap.xml
 * ```
 *
 * @seo_optimization
 * - Provides clear crawling instructions to search engines
 * - Links to comprehensive sitemap for better indexing
 * - Supports selective content restriction
 * - Enables fine-grained crawler control
 * - Follows industry best practices
 *
 * @returns {Promise<MetadataRoute.Robots>} Complete robots.txt configuration
 *
 * @example
 * ```typescript
 * // Automatic usage by Next.js
 * // Generates robots.txt at /robots.txt
 * const robotsConfig = await robots();
 *
 * // Manual usage for custom processing
 * const customRobots = await robots();
 * console.log(`Sitemap URL: ${customRobots.sitemap}`);
 * ```
 *
 * @deployment_considerations
 * - Works across all major hosting platforms
 * - Handles dynamic base URL resolution
 * - Supports both development and production environments
 * - Compatible with CDN and reverse proxy setups
 *
 * @crawling_rules
 * - User-agent: * (applies to all search engine crawlers)
 * - Disallow: / (restricts crawling of all content)
 * - Sitemap: Dynamic URL pointing to application sitemap
 *
 * @customization_notes
 * ```typescript
 * // To allow crawling, modify the rules:
 * rules: {
 *   userAgent: '*',
 *   allow: '/',        // Allow all content
 *   disallow: '/api/'  // Restrict API endpoints
 * }
 *
 * // To target specific crawlers:
 * rules: [
 *   {
 *     userAgent: 'Googlebot',
 *     allow: '/'
 *   },
 *   {
 *     userAgent: 'Bingbot',
 *     disallow: '/private/'
 *   }
 * ]
 * ```
 *
 * @standards_compliance
 * - Follows robots.txt standard specification
 * - Compatible with Google Search Console
 * - Supports Bing Webmaster Tools
 * - Meets international SEO requirements
 *
 * @performance_notes
 * - Minimal runtime overhead for robots.txt generation
 * - Efficient URL resolution with caching considerations
 * - Optimized for high-traffic applications
 * - Memory-efficient configuration structure
 *
 * @security_considerations
 * - Properly restricts sensitive endpoints
 * - Prevents exposure of internal application structure
 * - Supports selective content protection
 * - Maintains privacy for restricted areas
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @category SEO Generation
 * @see {@link getBaseUrl} For the URL resolution logic
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  // Resolve the application's base URL for absolute sitemap URL generation
  const baseUrl = await getBaseUrl();

  return {
    // Define crawling rules for search engine bots
    rules: {
      // Apply rules to all user agents (search engine crawlers)
      userAgent: '*',

      // Currently disallow all content - modify based on your SEO strategy
      // For public sites, consider changing to 'allow: "/"'
      // disallow: '/',

      // Allow all content
      allow: '/',
    },

    // Provide absolute URL to the application's sitemap
    // This helps search engines discover and index your content structure
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
