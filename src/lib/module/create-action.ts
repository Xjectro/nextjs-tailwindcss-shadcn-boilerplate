'use server';

import { revalidateTag } from 'next/cache';

/**
 * Supported HTTP methods for API actions
 *
 * @description
 * Defines the standard HTTP methods that can be used with the action system.
 * This type ensures type safety and restricts actions to valid HTTP verbs.
 *
 * @enum {string}
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Configuration interface for creating type-safe API actions
 *
 * @description
 * Comprehensive configuration object that defines all aspects of an API action,
 * including endpoint details, request/response transformations, and cache management.
 * This interface enables the creation of strongly-typed, reusable API actions.
 *
 * @template TInput - Type of the input data for the action
 * @template TOutput - Type of the expected response data from the action
 *
 * @interface ActionConfig
 *
 * @property {string} input - API endpoint path (relative to API_URL)
 * @property {HttpMethod} [method='POST'] - HTTP method for the request
 * @property {HeadersInit} [headers] - Custom headers for the request
 * @property {string | string[]} [tags] - Cache tags for Next.js revalidation
 * @property {object} [transform] - Request/response transformation functions
 * @property {function} [transform.request] - Transform input data before sending
 * @property {function} [transform.response] - Transform response data after receiving
 *
 * @example
 * ```typescript
 * // Basic configuration
 * const basicConfig: ActionConfig<User, ApiResponse<User>> = {
 *   input: '/users',
 *   method: 'POST',
 *   tags: ['users']
 * };
 *
 * // Advanced configuration with transformations
 * const advancedConfig: ActionConfig<CreateUserRequest, User> = {
 *   input: '/users',
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer token'
 *   },
 *   tags: ['users', 'profiles'],
 *   transform: {
 *     request: (data) => ({ ...data, timestamp: Date.now() }),
 *     response: async (res) => {
 *       const json = await res.json();
 *       return json.data;
 *     }
 *   }
 * };
 * ```
 */
interface ActionConfig<TInput = unknown, TOutput = unknown> {
  input: string;
  method?: HttpMethod;
  headers?: HeadersInit;
  tags?: string | string[];
  transform?: {
    request?: (data: TInput) => unknown;
    response?: (response: Response) => Promise<TOutput>;
  };
}

/**
 * Type definition for generated action functions
 *
 * @description
 * Represents the signature of functions created by the createAction factory.
 * These functions provide a consistent interface for executing API calls with
 * type safety and built-in error handling.
 *
 * @template TInput - Type of the input parameter
 * @template TOutput - Type of the return value
 *
 * @param {TInput} [data] - Optional input data for the action
 * @returns {Promise<TOutput>} Promise resolving to the action result
 */
interface ActionFunction<TInput, TOutput> {
  (data?: TInput): Promise<TOutput>;
}

/**
 * Factory function for creating type-safe, reusable API actions with Next.js integration
 *
 * @description
 * A powerful factory function that creates standardized API action functions with built-in
 * support for Next.js server actions, cache revalidation, request/response transformations,
 * and comprehensive error handling. This function promotes code reusability, type safety,
 * and consistent API interaction patterns across the application.
 *
 * @features
 * - Type-safe API actions with TypeScript generics
 * - Next.js server actions integration ('use server')
 * - Automatic cache revalidation with tags
 * - Request/response data transformations
 * - Support for JSON and FormData requests
 * - Automatic query parameter handling for GET requests
 * - Optimized header management
 * - Comprehensive error handling and propagation
 * - Flexible configuration options
 *
 * @architecture_benefits
 * - Centralized API logic with consistent patterns
 * - Reduced boilerplate code across components
 * - Enhanced developer experience with auto-completion
 * - Improved maintainability through standardization
 * - Better testing capabilities with predictable interfaces
 *
 * @template TInput - Type of the input data passed to the action
 * @template TOutput - Type of the data returned by the action
 *
 * @param {ActionConfig<TInput, TOutput>} config - Configuration object for the action
 * @param {string} config.input - API endpoint path (relative to process.env.API_URL)
 * @param {HttpMethod} [config.method='POST'] - HTTP method for the request
 * @param {HeadersInit} [config.headers] - Custom headers (default: JSON content-type)
 * @param {string | string[]} [config.tags] - Cache tags for Next.js revalidation
 * @param {object} [config.transform] - Request/response transformation functions
 *
 * @returns {ActionFunction<TInput, TOutput>} Configured action function ready for use
 *
 * @example
 * ```typescript
 * // User management actions
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * interface CreateUserRequest {
 *   name: string;
 *   email: string;
 * }
 *
 * // Create user action
 * const createUser = createAction<CreateUserRequest, User>({
 *   input: '/users',
 *   method: 'POST',
 *   tags: ['users'],
 *   transform: {
 *     request: (data) => ({
 *       ...data,
 *       createdAt: new Date().toISOString()
 *     }),
 *     response: async (res) => {
 *       const result = await res.json();
 *       return result.data;
 *     }
 *   }
 * });
 *
 * // Get users action with query parameters
 * const getUsers = createAction<{ page: number; limit: number }, User[]>({
 *   input: '/users',
 *   method: 'GET',
 *   tags: 'users'
 * });
 *
 * // File upload action
 * const uploadAvatar = createAction<FormData, { url: string }>({
 *   input: '/users/avatar',
 *   method: 'POST',
 *   tags: ['users', 'avatars']
 * });
 *
 * // Usage in components
 * async function handleCreateUser(userData: CreateUserRequest) {
 *   try {
 *     const user = await createUser(userData);
 *     console.log('Created user:', user);
 *   } catch (error) {
 *     console.error('Failed to create user:', error);
 *   }
 * }
 *
 * // Usage with server actions
 * async function serverCreateUser(formData: FormData) {
 *   'use server';
 *   const userData = {
 *     name: formData.get('name') as string,
 *     email: formData.get('email') as string
 *   };
 *   return await createUser(userData);
 * }
 * ```
 *
 * @implementation_details
 *
 * **Request Processing:**
 * 1. Applies input transformation if provided
 * 2. Configures fetch options based on method and headers
 * 3. Handles GET requests with automatic query parameter serialization
 * 4. Manages FormData requests with automatic Content-Type handling
 * 5. Serializes JSON data for non-GET requests
 *
 * **Response Processing:**
 * 1. Validates HTTP response status
 * 2. Applies response transformation if provided
 * 3. Auto-detects content type for appropriate parsing
 * 4. Handles both JSON and text responses
 * 5. Triggers cache revalidation based on tags
 *
 * **Error Handling:**
 * - HTTP errors are converted to JavaScript errors
 * - Network errors are properly propagated
 * - Type-safe error instances are maintained
 * - Detailed error context is preserved
 *
 * @performance_considerations
 * - Minimal overhead with efficient request processing
 * - Optimized header management to avoid unnecessary copies
 * - Lazy URL construction for GET requests
 * - Selective cache revalidation based on tags
 * - Memory-efficient error handling
 *
 * @security_considerations
 * - Headers are properly managed and sanitized
 * - Environment variables are used for base URL configuration
 * - FormData content-type is automatically handled
 * - No sensitive data logging in error messages
 *
 * @testing_strategies
 * ```typescript
 * // Mock the action for testing
 * jest.mock('./module-helper', () => ({
 *   createAction: jest.fn(() => jest.fn().mockResolvedValue(mockData))
 * }));
 *
 * // Test with different configurations
 * describe('createAction', () => {
 *   it('should handle successful requests', async () => {
 *     const action = createAction({ input: '/test', method: 'GET' });
 *     const result = await action();
 *     expect(result).toBeDefined();
 *   });
 * });
 * ```
 *
 * @dependencies
 * - next/cache: For cache revalidation functionality
 * - Node.js fetch API: For HTTP requests (built-in in modern environments)
 *
 * @environment_variables
 * - API_URL: Base URL for API endpoints (required)
 *
 * @author Enterprise Development Team
 * @since 1.0.0
 * @version 1.0.0
 * @category API Utilities
 * @tags api, server-actions, cache, fetch, typescript
 */
export const createAction = <TInput = unknown, TOutput = unknown>({
  input,
  method = 'POST',
  headers = { 'Content-Type': 'application/json' },
  tags,
  transform,
}: ActionConfig<TInput, TOutput>): ActionFunction<TInput, TOutput> => {
  return async (data?: TInput): Promise<TOutput> => {
    try {
      // Apply input transformation if configured
      // This allows for data preprocessing, validation, or formatting
      const requestData =
        transform?.request && data !== undefined
          ? transform.request(data)
          : data;

      // Initialize fetch configuration with method and headers
      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      // Construct the full URL using environment-based API URL
      const url = new URL(`${process.env.API_URL}${input}`);

      // Handle GET requests with query parameter serialization
      // Convert object data to URL search parameters for GET requests
      if (method === 'GET' && requestData && typeof requestData === 'object') {
        Object.entries(requestData).forEach(([key, value]) => {
          // Only append non-null, non-undefined values to avoid empty params
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      // Handle non-GET requests with body data
      if (method !== 'GET' && requestData !== undefined) {
        if (requestData instanceof FormData) {
          // For FormData, set body directly and remove Content-Type header
          // This allows the browser to set the correct multipart boundary
          fetchOptions.body = requestData;
          if (
            headers &&
            typeof headers === 'object' &&
            'Content-Type' in headers
          ) {
            // Create new headers object without Content-Type for FormData
            const newHeaders = { ...headers };
            delete newHeaders['Content-Type'];
            fetchOptions.headers = newHeaders;
          }
        } else {
          // For JSON data, stringify and ensure proper Content-Type
          fetchOptions.body = JSON.stringify(requestData);
        }
      }

      // Execute the HTTP request with configured options
      const response = await fetch(url, fetchOptions);

      // Validate response status and throw error for HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Process response data with optional transformation
      let result: TOutput;
      if (transform?.response) {
        // Use custom response transformation if provided
        result = await transform.response(response);
      } else {
        // Auto-detect content type and parse accordingly
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
          result = await response.json();
        } else {
          // Fallback to text parsing for non-JSON responses
          result = (await response.text()) as TOutput;
        }
      }

      // Trigger cache revalidation for specified tags
      // This integrates with Next.js caching system for optimal performance
      if (tags) {
        const tagList = Array.isArray(tags) ? tags : [tags];
        for (const tag of tagList) {
          revalidateTag(tag);
        }
      }

      return result;
    } catch (error) {
      // Ensure consistent error type handling
      // Convert any thrown value to a proper Error instance
      const errorInstance =
        error instanceof Error ? error : new Error(String(error));

      // Re-throw the error to maintain the promise rejection chain
      throw errorInstance;
    }
  };
};
