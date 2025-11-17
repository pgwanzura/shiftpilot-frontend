export const logger = {
  info: (
    message: string,
    context?: Record<string, string | number | boolean | null>
  ): void =>
    console.log('[INFO]', message, context ? JSON.stringify(context) : ''),

  warn: (
    message: string,
    context?: Record<string, string | number | boolean | null>
  ): void =>
    console.warn('[WARN]', message, context ? JSON.stringify(context) : ''),

  error: (
    message: string,
    error?: Error,
    context?: Record<string, string | number | boolean | null>
  ): void =>
    console.error(
      '[ERROR]',
      message,
      error?.message,
      context ? JSON.stringify(context) : ''
    ),

  debug: (
    message: string,
    context?: Record<string, string | number | boolean | null>
  ): void =>
    console.debug('[DEBUG]', message, context ? JSON.stringify(context) : ''),
};
