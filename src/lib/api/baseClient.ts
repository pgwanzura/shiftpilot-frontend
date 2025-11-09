import { ApiError, QueryParams, HTTPMethod, JsonObject } from '@/types';

export abstract class BaseClient {
  protected baseURL: string;
  protected authToken: string | null;

  constructor(authToken: string | null = null, baseURL?: string) {
    this.authToken = authToken;
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  public clearAuthToken(): void {
    this.authToken = null;
  }

  protected async ensureCSRF(): Promise<void> {
    const response = await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`CSRF token request failed: ${response.status}`);
    }
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };

      try {
        const errorData = await response.json() as Partial<ApiError>;
        error.message = errorData.message || response.statusText;
        error.errors = errorData.errors;
      } catch {
      }

      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return undefined as T;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<T> {
    const method = options.method?.toUpperCase() as HTTPMethod | undefined;

    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await this.ensureCSRF();
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
    };

    if (method !== 'GET' && method !== 'HEAD') {
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include',
      mode: 'cors',
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: The request took too long to complete');
        }
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          throw new Error('CORS error: Unable to connect to API');
        }
        if (retries > 0 && this.isRetryableError(error)) {
          return this.request<T>(endpoint, options, retries - 1);
        }
        throw error;
      }
      throw new Error('Network request failed with unknown error');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'Network request failed',
      'Failed to fetch',
      'Request timeout',
      'ECONNRESET',
      'ETIMEDOUT'
    ];
    return retryableMessages.some(msg => error.message.includes(msg));
  }

  async get<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
    const url = this.buildUrlWithParams(endpoint, queryParams);
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: JsonObject): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: JsonObject): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: JsonObject): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  private buildUrlWithParams(
    endpoint: string,
    queryParams?: QueryParams
  ): string {
    if (!queryParams) {
      return endpoint;
    }

    const url = new URL(endpoint, this.baseURL);
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v.toString()));
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });

    return url.pathname + url.search;
  }
}