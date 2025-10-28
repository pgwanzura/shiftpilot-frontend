export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export function extractFirstErrorMessage(error: ApiError): string {
  if (error.errors) {
    const errorEntries = Object.entries(error.errors);
    const firstError = errorEntries[0]?.[1];
    return Array.isArray(firstError) ? firstError[0] : 'Operation failed';
  }
  return error.message || 'An unexpected error occurred';
}

export function parseErrorResponse(errorText: string): {
  message?: string;
  errors?: Record<string, string[]>;
} {
  try {
    return JSON.parse(errorText);
  } catch {
    return { message: errorText };
  }
}
