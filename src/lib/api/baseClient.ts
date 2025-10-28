import { ApiError, QueryParams } from '../../types';

export abstract class BaseClient {
  protected abstract baseURL: string;

  protected async ensureCSRF(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
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

    return response.json();
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
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) throw error;
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
