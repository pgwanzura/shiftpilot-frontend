import { ApiError, QueryParams } from '../../types';

export abstract class BaseClient {
  protected abstract baseURL: string;
  protected authToken: string | null;

  constructor(authToken: string | null = null) {
    this.authToken = authToken;
  }

  protected async ensureCSRF(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });
    } catch {
      throw new Error('Failed to get CSRF token');
    }
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || response.statusText;
        error.errors = errorData.errors;
      } catch {}

      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return undefined as T;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || '')) {
      await this.ensureCSRF();
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      credentials: 'include',
      mode: 'cors', // Explicitly enable CORS mode
      ...options,
    };

    // For GET requests, don't include Content-Type header
    if (options.method === 'GET') {
      delete (config.headers as any)['Content-Type'];
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        // Handle CORS-specific errors
        console.log(error.message);
        if (
          error.message.includes('CORS') ||
          error.message.includes('Failed to fetch')
        ) {
          throw new Error(
            `CORS error: Unable to connect to API. Please check if the server is running and CORS is configured properly.`
          );
        }
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  async get<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
    if (!queryParams) {
      return this.request<T>(endpoint, { method: 'GET' });
    }

    const filteredParams: Record<string, string> = {};

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filteredParams[key] = value.toString();
      }
    });

    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: object): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: object): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: object): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
