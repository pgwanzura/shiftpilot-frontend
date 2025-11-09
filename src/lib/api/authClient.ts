import { BaseClient } from './baseClient';
import {
  LoginCredentials,
  RegisterData,
  
} from '../../types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

interface ApiError {
  errors?: Record<string, string[]>;
  message?: string;
}

type AuthResult = { error?: string; success?: boolean };

interface LoginRequestData extends LoginCredentials {
  device_name: string;
}


type RequestData =
  | LoginRequestData


export class AuthClient extends BaseClient {
  protected baseURL: string;

  constructor(baseURL?: string) {
    super();
    this.baseURL =
      baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async getCsrfCookie(): Promise<void> {
    const response = await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`CSRF failed: ${response.status}`);
    }
  }

  private storeAuth(token: string, user: AuthUser): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 7}; ${isProduction ? 'secure;' : ''} samesite=lax`;

    document.cookie = `auth_token=${token}; ${cookieOptions}`;
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; ${cookieOptions}`;
  }

  private handleApiError(result: ApiError): string {
    if (result.errors) {
      const firstError = Object.values(result.errors)[0]?.[0];
      return firstError || 'Request failed';
    }
    return result.message || 'Request failed';
  }

  protected async handleAuthRequest(
    url: string,
    data: RequestData
  ): Promise<AuthResult> {
    try {
      await this.getCsrfCookie();

      const response = await fetch(`${this.baseURL}/api${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result: ApiError = await response.json();
        return { error: this.handleApiError(result) };
      }

      const result: AuthResponse = await response.json();
      this.storeAuth(result.access_token, result.user);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Network error - cannot connect to server';
      return { error: errorMessage };
    }
  }
}
