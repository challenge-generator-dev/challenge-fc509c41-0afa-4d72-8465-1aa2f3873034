import winston from 'winston';
import { TransformableInfo } from 'logform';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, stack, ...meta } = info as TransformableInfo & { [key: string]: unknown };
    let logEntry = `${timestamp} [${(level || 'info').toUpperCase()}]: ${message || ''}`;
    if (Object.keys(meta).length > 0 && meta.stack === undefined) {
      logEntry += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      logEntry += `\n${stack}`;
    }
    return logEntry;
  })
);

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    logFormat
  )
});

const fileTransport = new winston.transports.File({
  filename: 'logs/error.log',
  level: 'error',
  format: logFormat
});

const combinedTransport = new winston.transports.File({
  filename: 'logs/combined.log',
  format: logFormat
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [consoleTransport, fileTransport, combinedTransport],
  exitOnError: false
});

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string, meta?: Record<string, unknown>): string {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${this.context}] ${message}${metaStr}`;
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    logger.info(this.formatMessage(message, meta));
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(this.formatMessage(message, meta));
  }

  public error(message: string, error?: Error | Record<string, unknown>, meta?: Record<string, unknown>): void {
    if (error instanceof Error) {
      logger.error(this.formatMessage(message, meta), { stack: error.stack, ...error });
    } else if (error) {
      logger.error(this.formatMessage(message, meta), { ...error });
    } else {
      logger.error(this.formatMessage(message, meta));
    }
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(this.formatMessage(message, meta));
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}