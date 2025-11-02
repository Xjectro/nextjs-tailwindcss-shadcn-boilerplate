'use client';

import { useEffect, useState } from 'react';

/**
 * Mobile breakpoint threshold in pixels
 *
 * @description
 * Defines the maximum screen width (in pixels) below which a device is considered mobile.
 * This value aligns with common responsive design patterns and CSS frameworks.
 *
 * @constant {number} MOBILE_BREAKPOINT - 1024px threshold
 *
 * @rationale
 * - 1024px is a widely accepted breakpoint between tablet and desktop
 * - Matches common CSS framework breakpoints (Bootstrap, Tailwind)
 * - Provides consistent behavior across the application
 * - Can be easily modified for different design requirements
 *
 * @note
 * Consider extracting this to a global constants file for enterprise applications
 * to maintain consistency across different components and modules
 */
const MOBILE_BREAKPOINT = 1024;

/**
 * Custom React hook for detecting mobile devices based on screen width
 *
 * @description
 * A responsive design utility hook that determines whether the current viewport
 * should be considered a mobile device. Uses the native matchMedia API for
 * efficient media query monitoring with automatic cleanup and cross-browser support.
 *
 * @features
 * - Real-time responsive state tracking
 * - Automatic event listener management
 * - Cross-browser compatibility (legacy and modern)
 * - SSR-safe implementation with 'use client' directive
 * - Performance optimized with native browser APIs
 * - No unnecessary re-renders
 *
 * @use_cases
 * - Conditional rendering for mobile vs desktop layouts
 * - Responsive navigation menu toggling
 * - Mobile-specific feature implementations
 * - Touch vs mouse interaction handling
 * - Performance optimization for mobile devices
 * - Analytics and user experience tracking
 *
 * @returns {boolean} isMobile - True if viewport width is below mobile breakpoint
 *
 * @example
 * ```typescript
 * import { useIsMobile } from '@/hooks/use-mobile';
 *
 * function ResponsiveNavigation() {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <nav>
 *       {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *     </nav>
 *   );
 * }
 *
 * // Advanced usage with conditional hooks
 * function AdaptiveComponent() {
 *   const isMobile = useIsMobile();
 *   const mobileData = useMobileOptimizedData(isMobile);
 *
 *   return (
 *     <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *       {isMobile ? <TouchInterface /> : <MouseInterface />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @performance
 * - Uses native matchMedia API for optimal performance
 * - Single event listener per hook instance
 * - Automatic cleanup prevents memory leaks
 * - No polling or continuous monitoring overhead
 *
 * @browser_support
 * - Modern browsers: matchMedia with addEventListener/removeEventListener
 * - Legacy browsers: fallback to addListener/removeListener
 * - IE 10+ support with graceful degradation
 *
 * @ssr_considerations
 * - Marked with 'use client' for Next.js compatibility
 * - Initial state safely defaults to false (non-mobile)
 * - Hydration-safe implementation
 *
 * @accessibility
 * - Respects user's device preferences
 * - Works with browser zoom functionality
 * - Compatible with assistive technologies
 *
 * @testing
 * - Can be mocked by window.matchMedia
 * - Supports unit testing with jsdom
 * - Integration testing with viewport manipulation
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @version 1.0.0
 * @category Responsive Design Hooks
 * @tags mobile, responsive, viewport, breakpoint, media-query
 */
export function useIsMobile(): boolean {
  // State to track current mobile status
  // Initialized as false to provide a safe default for SSR
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Create media query using the defined mobile breakpoint
     *
     * @note Using (MOBILE_BREAKPOINT - 1) to ensure exact boundary behavior:
     * - 1023px and below = mobile (true)
     * - 1024px and above = desktop (false)
     */
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    /**
     * Event handler for media query changes
     *
     * @param {MediaQueryListEvent | MediaQueryList} event - Media query event object
     *
     * @description
     * Handles both initial evaluation and subsequent changes to the media query.
     * The function signature accommodates both modern (MediaQueryListEvent) and
     * legacy (MediaQueryList) browser implementations.
     *
     * @performance
     * Direct state update without additional processing for optimal performance
     */
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      // Update mobile state based on media query match result
      setIsMobile(event.matches);
    };

    // Initial evaluation of the media query
    // This ensures the state is correct on component mount
    handleChange(mediaQuery);

    /**
     * Add event listener with cross-browser compatibility
     *
     * @modern_browsers Use addEventListener (preferred method)
     * @legacy_browsers Fall back to addListener for older browser support
     *
     * @rationale
     * - addEventListener is the modern standard with better TypeScript support
     * - addListener provides backward compatibility for older browsers
     * - Both methods achieve the same functionality with different APIs
     */
    if (mediaQuery.addEventListener) {
      // Modern browsers: use the standard addEventListener method
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy browsers: use the deprecated but still functional addListener
      mediaQuery.addListener(handleChange);
    }

    /**
     * Cleanup function to prevent memory leaks
     *
     * @description
     * Removes the event listener when the component unmounts or dependencies change.
     * Uses the same cross-browser compatibility pattern as the listener addition.
     *
     * @importance CRITICAL
     * - Prevents memory leaks in single-page applications
     * - Ensures proper cleanup during component lifecycle
     * - Maintains application performance over time
     *
     * @browser_support
     * Mirrors the addEventListener/addListener pattern for consistency
     */
    return () => {
      if (mediaQuery.removeEventListener) {
        // Modern browsers: remove listener using standard method
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Legacy browsers: remove listener using deprecated method
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []); // Empty dependency array: effect runs once on mount and cleanup on unmount

  // Return current mobile detection state
  return isMobile;
}
