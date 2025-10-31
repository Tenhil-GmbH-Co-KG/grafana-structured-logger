type LabelKey = 'userId' | string; // it can be extended, if necessary

type Label = Record<LabelKey, string | null | undefined>;

type Config = {
  defaultLabels?: Label
};

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export type LogRecord = {
  time: string;
  level: LogLevel;
  message: string;
  stack?: string;
  labels?: Label;
};

// Configuration state
let defaultLabels: Label | undefined;

/**
 * Determines whether the current execution environment
 * is a browser.
 */
const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Emits a structured log line for server-side environments.
 */
const emitServer = (level: LogLevel, messageOrError: string | Error, labels?: Label): void => {
  const isError = messageOrError instanceof Error;
  const mergedLabels = defaultLabels ? { ...defaultLabels, ...labels } : labels;

  const record: LogRecord = {
    time: new Date().toISOString(),
    level,
    message: isError ? messageOrError.message : messageOrError,
    ...(isError && messageOrError.stack ? { stack: messageOrError.stack } : {}),
    ...(mergedLabels && Object.keys(mergedLabels).length > 0 ? { labels: mergedLabels } : {}),
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
 * Emits a simpler log line for client-side environments.
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
 * Dispatches to server or client implementation.
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
 * Initialize the logger with optional configuration.
 *
 * @param config - Configuration object.
 * @param config.defaultLabels - Labels to be added to all server-side logs.
 * @returns void
 */
export const init = (config: Config): void => {
  if (config.defaultLabels) {
    defaultLabels = config.defaultLabels;
  }
};

/**
 * Logs an informational message.
 *
 * @param message - Human-readable message to log.
 * @param labels - Optional structured labels (e.g., userId, requestId, service).
 * @returns void
 */
export const info = (message: string, labels?: Label): void => {
  emit('info', message, labels);
};

/**
 * Logs a debug message (low-level details useful during development).
 *
 * @param message - Debug message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const debug = (message: string, labels?: Label): void => {
  emit('debug', message, labels);
};

/**
 * Logs a warning.
 *
 * @param message - Warning message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const warn = (message: string, labels?: Label): void => {
  emit('warning', message, labels);
};

/**
 * Logs an error.
 *
 * @param err - Either an Error object (stack will be included) or a string message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const error = (err: string | Error, labels?: Label): void => {
  emit('error', err, labels);
};

/**
 * Logs a critical error (serious failure requiring immediate attention).
 *
 * @param err - Either an Error object (stack will be included) or a string message.
 * @param labels - Optional structured labels.
 * @returns void
 */
export const critical = (err: string | Error, labels?: Label): void => {
  emit('critical', err, labels);
};

const logger = {
  init,
  info,
  debug,
  warn,
  error,
  critical,
};

export default logger;
