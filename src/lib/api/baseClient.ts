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
    try {
      const response = await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`CSRF token request failed: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get CSRF token: ${error.message}`);
      }
      throw new Error('Failed to get CSRF token: Unknown error');
    }
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };

      try {
        const errorData = (await response.json()) as Partial<ApiError>;
        error.message = errorData.message || response.statusText;
        error.errors = errorData.errors;
      } catch {
        // Ignore JSON parsing errors for error responses
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
    options: RequestInit = {}
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

    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include',
      mode: 'cors',
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('CORS') ||
          error.message.includes('Failed to fetch')
        ) {
          throw new Error(
            'CORS error: Unable to connect to API. Please check if the server is running and CORS is configured properly.'
          );
        }
        throw error;
      }
      throw new Error('Network request failed with unknown error');
    }
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

  async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.authToken) {
      throw new Error('Authentication token is required for fetchWithAuth');
    }

    const method = options.method?.toUpperCase() || 'GET';

    switch (method) {
      case 'GET':
        return this.get<T>(endpoint);
      case 'POST':
        const postData = options.body
          ? (JSON.parse(options.body as string) as JsonObject)
          : undefined;
        return this.post<T>(endpoint, postData);
      case 'PUT':
        const putData = options.body
          ? (JSON.parse(options.body as string) as JsonObject)
          : undefined;
        return this.put<T>(endpoint, putData);
      case 'PATCH':
        const patchData = options.body
          ? (JSON.parse(options.body as string) as JsonObject)
          : undefined;
        return this.patch<T>(endpoint, patchData);
      case 'DELETE':
        return this.delete<T>(endpoint);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  private buildUrlWithParams(
    endpoint: string,
    queryParams?: QueryParams
  ): string {
    if (!queryParams) {
      return endpoint;
    }

    const filteredParams: Record<string, string> = {};

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = value.toString();
      }
    });

    if (Object.keys(filteredParams).length === 0) {
      return endpoint;
    }

    const queryString = new URLSearchParams(filteredParams).toString();
    return `${endpoint}?${queryString}`;
  }
}
