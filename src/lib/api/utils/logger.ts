type LogFunction<T extends readonly unknown[] = []> = (...args: T) => void;

export interface Logger {
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  debug: LogFunction;
}

export const logger: Logger = {
  info: (...args) => {
    console.info('[INFO]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', ...args);
    }
  },
};
