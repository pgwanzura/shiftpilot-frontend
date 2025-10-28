import { ApiError, parseErrorResponse } from './error-handling';

export async function simpleServerFetch<T>(
  baseURL: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const apiUrl = `${baseURL}/api/${cleanEndpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(apiUrl, config);

  if (!response.ok) {
    const errorText = await response.text();
    const errorData = parseErrorResponse(errorText);

    const apiError: ApiError = {
      message: errorData.message || `Request failed: ${response.status}`,
      status: response.status,
      errors: errorData.errors,
    };

    throw apiError;
  }

  return response.json();
}
