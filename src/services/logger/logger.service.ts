/**
 * Winston Logger Configuration for Next.js on Vercel
 *
 * This module provides a production-ready logger optimized for serverless
 * environments like Vercel's Fluid Compute architecture.
 *
 * Key features:
 * - Console-only logging (serverless friendly)
 * - JSON format for production (structured logging for log aggregation)
 * - Colorized simple format for development (human-readable)
 * - Timestamp support for request tracing
 * - Different log levels (error, warn, info, debug)
 * - Metadata support for context-rich logging
 * - Child logger support for request tracking
 *
 * @see https://github.com/winstonjs/winston
 * @see https://vercel.com/docs/observability/runtime-logs
 */

// TODO: Cloud logging integration

import winston from 'winston';
import { LOG_COLORS, LOG_LEVELS, getLogLevel } from './logger.constants';
import { developmentFormat, productionFormat } from './logger.formats';

// Add colors to winston
winston.addColors(LOG_COLORS);

/**
 * Main Winston logger instance
 *
 * Configured with:
 * - Console transport only (serverless friendly)
 * - Environment-specific formatting
 * - Configurable log level
 *
 * @example
 * ```typescript
 * import { logger } from '@/services/logger';
 *
 * logger.info('User logged in', { userId: '123', action: 'login' });
 * logger.error('Database error', { error: err.message });
 * logger.warn('API rate limit approaching', { limit: 100, current: 95 });
 * logger.debug('Cache hit', { key: 'user:123', ttl: 3600 });
 * ```
 */
export const logger = winston.createLogger({
  level: getLogLevel(),
  levels: LOG_LEVELS,
  format:
    process.env.NODE_ENV === 'production'
      ? productionFormat
      : developmentFormat,
  transports: [
    new winston.transports.Console({
      // Force console output even in serverless environments
      // This ensures logs are captured by Vercel's logging system
      stderrLevels: ['error'],
    }),
  ],
  // Prevent process exit on handled exceptions
  exitOnError: false,
});

/**
 * Create a child logger with default metadata
 *
 * Useful for adding context to all logs within a specific scope
 * (e.g., request ID, user ID, feature name)
 *
 * @param defaultMeta - Metadata to include in all logs from this child logger
 * @returns Child logger instance
 *
 * @example
 * ```typescript
 * const requestLogger = createChildLogger({ requestId: '123', userId: 'abc' });
 * requestLogger.info('Processing request'); // Includes requestId and userId
 * requestLogger.error('Request failed', { error: 'timeout' });
 * ```
 */
export function createChildLogger(
  defaultMeta: Record<string, unknown>,
): winston.Logger {
  return logger.child(defaultMeta);
}

/**
 * Log an error with full context
 *
 * @param error - The error object
 * @param context - Additional context about where/why the error occurred
 *
 * @example
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   logError(error, { operation: 'riskyOperation', userId: '123' });
 * }
 * ```
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (error instanceof Error) {
    logger.error(error.message, {
      ...context,
      error: error.name,
      stack: error.stack,
    });
  } else {
    logger.error('Unknown error occurred', {
      ...context,
      error: String(error),
    });
  }
}

// Only set up exception handlers in non-test environments
if (process.env.NODE_ENV !== 'test') {
  /**
   * Handle uncaught exceptions
   * Logs the error and exits the process (important for serverless)
   */
  logger.exceptions.handle(
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? productionFormat
          : developmentFormat,
    }),
  );

  /**
   * Handle unhandled promise rejections
   * Logs the error and exits the process (important for serverless)
   */
  logger.rejections.handle(
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? productionFormat
          : developmentFormat,
    }),
  );
}

/**
 * Flush logs before process exit
 * Ensures all logs are written in serverless environments
 */
export async function flushLogs(): Promise<void> {
  return new Promise((resolve) => {
    logger.on('finish', resolve);
    logger.end();
  });
}

// Default export for convenience
export default logger;
