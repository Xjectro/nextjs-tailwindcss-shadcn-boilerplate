import { useEffect, useState, type RefObject } from 'react';

/**
 * Custom React hook for detecting when an element enters or leaves the viewport
 * using the Intersection Observer API. This hook is optimized for performance
 * and provides a clean abstraction for viewport visibility detection.
 *
 * @description
 * This hook leverages the Intersection Observer API to efficiently track when
 * a DOM element becomes visible in the viewport. It's particularly useful for:
 * - Lazy loading images or components
 * - Triggering animations when elements come into view
 * - Analytics tracking for content visibility
 * - Infinite scroll implementations
 * - Performance optimization by deferring non-critical content loading
 *
 * @param {RefObject<HTMLDivElement | null>} element - React ref object pointing to the target DOM element
 * @param {string} rootMargin - CSS margin string that defines the root's margin for intersection calculations
 *                             Examples: "0px", "10px 20px", "-10px 0px 10px 0px"
 *
 * @returns {boolean} isVisible - Boolean indicating whether the element is currently intersecting with the viewport
 *
 * @example
 * ```typescript
 * import { useRef } from 'react';
 * import { useIntersection } from '@/hooks/use-in-view';
 *
 * function LazyComponent() {
 *   const elementRef = useRef<HTMLDivElement>(null);
 *   const isVisible = useIntersection(elementRef, '0px');
 *
 *   return (
 *     <div ref={elementRef}>
 *       {isVisible ? <ExpensiveComponent /> : <Skeleton />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @performance
 * - Uses native Intersection Observer API for optimal performance
 * - Automatically cleans up observers on component unmount
 * - Minimal re-renders with useState for visibility state
 *
 * @browser_support
 * - Modern browsers with Intersection Observer support
 * - For legacy browser support, consider adding a polyfill
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @version 1.0.0
 */
export function useIntersection(
  element: RefObject<HTMLDivElement | null>,
  rootMargin: string,
): boolean {
  // State to track the visibility status of the target element
  const [isVisible, setState] = useState<boolean>(false);

  useEffect(() => {
    // Early return if the element reference is not available
    // This prevents errors and unnecessary observer creation
    if (!element.current) {
      return;
    }

    // Cache the current element reference to avoid stale closures
    // in the cleanup function
    const el = element.current;

    /**
     * Create Intersection Observer instance with callback and options
     *
     * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
     * The callback receives an array, but we only observe one element,
     * so we can safely destructure the first entry
     */
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state based on intersection status
        // entry.isIntersecting is true when the element is visible
        setState(entry.isIntersecting);
      },
      {
        // Configuration object for the observer
        rootMargin, // Margin around the root viewport for triggering intersection
        // Additional options can be added here:
        // root: null, // Use viewport as root (default)
        // threshold: 0, // Trigger when any part of element is visible (default)
      },
    );

    // Start observing the target element
    observer.observe(el);

    /**
     * Cleanup function to unobserve the element when:
     * - Component unmounts
     * - Element reference changes
     * - rootMargin changes
     *
     * This prevents memory leaks and ensures proper cleanup
     */
    return () => observer.unobserve(el);
  }, [element, rootMargin]); // Dependencies: re-run effect when these values change

  // Return the current visibility state
  return isVisible;
}
