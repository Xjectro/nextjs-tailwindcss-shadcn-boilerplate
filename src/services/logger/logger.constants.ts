/**
 * Logger constants and env-based configuration.
 */

/**
 * Custom log levels for application logging
 * Lower values have higher priority
 */
export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const;

/**
 * Colors for each log level (used in development)
 */
export const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
} as const;

/**
 * Determine the logging level based on environment
 * - Production: info (less verbose)
 * - Development: debug (more verbose for debugging)
 */
export const getLogLevel = (): string => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};
