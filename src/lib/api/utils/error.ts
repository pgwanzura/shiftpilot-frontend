// @/lib/api/utils/error.ts
export class ApiError<T = unknown> extends Error {
  public status: number;
  public code?: string;
  public errors?: Record<string, string[]>;
  public data?: T;

  constructor({
    message,
    status,
    code,
    errors,
    data,
  }: {
    message: string;
    status: number;
    code?: string;
    errors?: Record<string, string[]>;
    data?: T;
  }) {
    const finalMessage = message || `API Error ${status}`;
    super(finalMessage);

    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.data = data;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toString(): string {
    return `ApiError: ${this.message} (status: ${this.status}, code: ${
      this.code || 'none'
    })`;
  }
}
