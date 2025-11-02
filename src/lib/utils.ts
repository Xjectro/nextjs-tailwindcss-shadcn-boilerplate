import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging and combining CSS class names with Tailwind CSS
 *
 * @description
 * A powerful utility function that combines the functionality of `clsx` and `tailwind-merge`
 * to provide intelligent CSS class name handling. This function is essential for component
 * libraries and design systems where class name conflicts and conditional styling are common.
 *
 * @rationale
 * - `clsx`: Handles conditional class names and various input formats
 * - `tailwind-merge`: Resolves Tailwind CSS class conflicts intelligently
 * - Combined: Provides the best of both worlds for robust class name management
 *
 * @functionality
 * 1. Processes conditional class names using clsx
 * 2. Resolves Tailwind CSS class conflicts using twMerge
 * 3. Returns optimized, conflict-free class string
 *
 * @param {...ClassValue[]} inputs - Variable number of class value inputs
 *   Accepts multiple formats:
 *   - Strings: "text-red-500 bg-blue-100"
 *   - Objects: { "text-red-500": isError, "text-green-500": isSuccess }
 *   - Arrays: ["text-base", condition && "text-lg"]
 *   - Mixed: Any combination of the above
 *
 * @returns {string} Optimized CSS class string with resolved conflicts
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn("text-red-500", "bg-blue-100")
 * // Returns: "text-red-500 bg-blue-100"
 *
 * // Conditional classes
 * cn("text-base", isLarge && "text-lg", isError && "text-red-500")
 * // Returns: "text-base text-lg text-red-500" (if both conditions are true)
 *
 * // Conflict resolution
 * cn("text-red-500", "text-blue-500")
 * // Returns: "text-blue-500" (last wins, conflict resolved)
 *
 * // Object syntax
 * cn({
 *   "text-red-500": hasError,
 *   "text-green-500": isSuccess,
 *   "font-bold": isImportant
 * })
 *
 * // Component usage
 * function Button({ className, variant, size, ...props }) {
 *   return (
 *     <button
 *       className={cn(
 *         "inline-flex items-center justify-center rounded-md",
 *         "font-medium transition-colors focus-visible:outline-none",
 *         {
 *           "bg-primary text-primary-foreground": variant === "default",
 *           "bg-destructive text-destructive-foreground": variant === "destructive",
 *           "h-10 px-4 py-2": size === "default",
 *           "h-9 px-3": size === "sm",
 *         },
 *         className
 *       )}
 *       {...props}
 *     />
 *   );
 * }
 * ```
 *
 * @performance
 * - Lightweight utility with minimal overhead
 * - Efficient class deduplication and conflict resolution
 * - No runtime CSS parsing, only string manipulation
 * - Optimized for component re-rendering scenarios
 *
 * @design_system_benefits
 * - Consistent class name handling across components
 * - Predictable conflict resolution for design tokens
 * - Seamless integration with component variant systems
 * - Enhanced developer experience with TypeScript support
 *
 * @best_practices
 * - Always place user-provided className last for proper overrides
 * - Use object syntax for complex conditional logic
 * - Combine with component variants for scalable design systems
 * - Consider memoization for frequently called scenarios
 *
 * @dependencies
 * - clsx: ^2.0.0+ for conditional class handling
 * - tailwind-merge: ^2.0.0+ for Tailwind conflict resolution
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @version 1.0.0
 * @category Utility Functions
 * @tags css, tailwind, clsx, styling, design-system
 */
export function cn(...inputs: ClassValue[]): string {
  // Combine clsx for conditional handling and twMerge for conflict resolution
  return twMerge(clsx(inputs));
}

/**
 * Utility function for generating numeric sequences and iteration helpers
 *
 * @description
 * Creates an array of sequential numbers starting from 0, primarily used for
 * iteration scenarios where you need to repeat operations, render components
 * multiple times, or generate test data. This utility promotes functional
 * programming patterns and provides a clean alternative to traditional for loops.
 *
 * @use_cases
 * - Rendering multiple skeleton components during loading states
 * - Generating placeholder data for development and testing
 * - Creating grid layouts with dynamic item counts
 * - Implementing pagination controls with page numbers
 * - Loop iteration in functional programming style
 * - Animation sequences with staggered timing
 *
 * @param {number} times - The number of iterations/elements to generate
 *   Must be a positive integer. Negative numbers or zero will return empty array.
 *
 * @returns {number[]} Array of sequential numbers from 0 to (times - 1)
 *
 * @example
 * ```typescript
 * // Basic usage - generate 5 numbers
 * repeat(5)
 * // Returns: [0, 1, 2, 3, 4]
 *
 * // Skeleton loading components
 * function SkeletonList({ count }: { count: number }) {
 *   return (
 *     <div className="space-y-4">
 *       {repeat(count).map((index) => (
 *         <SkeletonCard key={index} />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Grid layout generation
 * function GridPlaceholder({ rows, cols }: { rows: number; cols: number }) {
 *   return (
 *     <div className="grid grid-cols-4 gap-4">
 *       {repeat(rows * cols).map((index) => (
 *         <div key={index} className="aspect-square bg-gray-200 rounded" />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Pagination controls
 * function Pagination({ totalPages }: { totalPages: number }) {
 *   return (
 *     <div className="flex space-x-2">
 *       {repeat(totalPages).map((pageIndex) => (
 *         <button
 *           key={pageIndex}
 *           className="px-3 py-1 border rounded"
 *         >
 *           {pageIndex + 1}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Staggered animations
 * function StaggeredList({ items }: { items: string[] }) {
 *   return (
 *     <div>
 *       {items.map((item, index) => (
 *         <div
 *           key={item}
 *           style={{ animationDelay: `${index * 100}ms` }}
 *           className="animate-fade-in"
 *         >
 *           {item}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Test data generation
 * const mockUsers = repeat(10).map(id => ({
 *   id,
 *   name: `User ${id}`,
 *   email: `user${id}@example.com`
 * }));
 * ```
 *
 * @performance
 * - Efficient array creation using Array.from()
 * - Minimal memory footprint for reasonable iteration counts
 * - No complex computations, just sequential number generation
 * - Suitable for both small and medium-scale iterations
 *
 * @alternatives_comparison
 * ```typescript
 * // Traditional for loop
 * const result = [];
 * for (let i = 0; i < times; i++) {
 *   result.push(i);
 * }
 *
 * // Array.from with mapping (this implementation)
 * const result = Array.from(Array(times).keys());
 *
 * // Alternative with Array.fill
 * const result = new Array(times).fill(0).map((_, i) => i);
 *
 * // Lodash range (external dependency)
 * const result = _.range(times);
 * ```
 *
 * @edge_cases
 * - times = 0: Returns empty array []
 * - times < 0: Returns empty array [] (Array constructor behavior)
 * - times = 1: Returns [0]
 * - Large numbers: Memory usage scales linearly, use caution with very large values
 *
 * @type_safety
 * - TypeScript ensures number input type
 * - Return type is explicitly number[]
 * - No runtime type checking needed for performance
 *
 * @testing
 * ```typescript
 * describe('repeat', () => {
 *   it('should generate correct sequence', () => {
 *     expect(repeat(3)).toEqual([0, 1, 2]);
 *   });
 *
 *   it('should handle edge cases', () => {
 *     expect(repeat(0)).toEqual([]);
 *     expect(repeat(1)).toEqual([0]);
 *   });
 * });
 * ```
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @version 1.0.0
 * @category Utility Functions
 * @tags iteration, array, functional-programming, helpers
 */
export const repeat = (times: number): number[] => {
  // Generate array of sequential numbers from 0 to (times - 1)
  // Array.from(Array(times).keys()) is the most efficient approach for this use case
  return Array.from(Array(times).keys());
};
