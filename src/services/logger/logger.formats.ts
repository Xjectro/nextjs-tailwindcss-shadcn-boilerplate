import winston from 'winston';

/**
 * Create format for production environments
 * Uses JSON format for easy parsing and log aggregation
 */
export const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/**
 * Create format for development environments
 * Uses colorized, human-readable format with timestamps
 */
export const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    let msg = `${timestamp} [${level}]: ${message}`;

    // Add metadata if present (excluding timestamp and stack)
    const metaKeys = Object.keys(meta).filter(
      (key) => !['timestamp', 'stack', 'level', 'message'].includes(key),
    );

    if (metaKeys.length > 0) {
      const metaObj: Record<string, unknown> = {};
      metaKeys.forEach((key) => {
        metaObj[key] = meta[key];
      });
      msg += ` ${JSON.stringify(metaObj)}`;
    }

    // Add stack trace for errors
    if (info.stack) {
      msg += `\n${info.stack}`;
    }

    return msg;
  }),
);
