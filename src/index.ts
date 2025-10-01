export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

type LabelKey = 'userId' | string; // it can be extended, if necessary
type Label = Record<LabelKey, string | null | undefined>;

export type LogRecord = {
  time: string;
  level: LogLevel;
  message: string;
  stack?: string;
  labels?: Label;
};

const isClient = (): boolean => typeof window !== 'undefined';

/**
 * Emit a structured log line for server-side environments.
 */
const emitServer = (level: LogLevel, messageOrError: string | Error, labels?: Label): void => {
  const isError = messageOrError instanceof Error;

  const record: LogRecord = {
    time: new Date().toISOString(),
    level,
    message: isError ? messageOrError.message : messageOrError,
    ...(isError && messageOrError.stack ? { stack: messageOrError.stack } : {}),
    ...(labels && Object.keys(labels).length > 0 ? { labels } : {}),
  };

  const output = JSON.stringify(record);

  switch (level) {
    case 'debug':
      console.debug(output);
      break;
    case 'warning':
      console.warn(output);
      break;
    case 'error':
    case 'critical':
      console.error(output);
      break;
    case 'info':
    default:
      console.info(output);
  }
};

/**
 * Emit a simpler log line for client-side environments.
 */
const emitClient = (level: LogLevel, messageOrError: string | Error): void => {
  const msg = messageOrError instanceof Error ? messageOrError.message : messageOrError;

  switch (level) {
    case 'debug':
      console.debug(msg);
      break;
    case 'warning':
      console.warn(msg);
      break;
    case 'error':
    case 'critical':
      console.error(msg);
      break;
    case 'info':
    default:
      console.info(msg);
  }
};

/**
 * Dispatch to server or client implementation.
 */
const emit = (level: LogLevel, messageOrError: string | Error, labels?: Label): void => {
  if (isClient()) {
    emitClient(level, messageOrError);
  } else {
    emitServer(level, messageOrError, labels);
  }
};

// Public API

/**
 * Log an informational message.
 *
 * @param message - Human-readable message to log.
 * @param labels - Optional structured labels (e.g., userId, requestId, service).
 * @returns void
 */
export const info = (message: string, labels?: Label): void => emit('info', message, labels);

/**
 * Log a debug message (low-level details useful during development).
 *
 * @param message - Debug message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const debug = (message: string, labels?: Label): void => emit('debug', message, labels);

/**
 * Log a warning.
 *
 * @param message - Warning message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const warn = (message: string, labels?: Label): void => emit('warning', message, labels);

/**
 * Log an error.
 *
 * @param err - Either an Error object (stack will be included) or a string message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const error = (err: string | Error, labels?: Label): void => emit('error', err, labels);

/**
 * Log a critical error (serious failure requiring immediate attention).
 *
 * @param err - Either an Error object (stack will be included) or a string message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const critical = (err: string | Error, labels?: Label): void =>
  emit('critical', err, labels);
