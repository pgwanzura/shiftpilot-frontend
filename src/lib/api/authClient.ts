import { BaseClient } from './baseClient';
import {
  LoginCredentials,
  RegisterData,
  ApiResponse,
  AuthUserResponse,
  LoginResponse,
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

interface RegistrationRequestData extends RegisterData {
  role: string;
}

interface RecruiterRegistrationRequestData extends RegisterData {
  role: string;
}

type RequestData = LoginRequestData | RegistrationRequestData | RecruiterRegistrationRequestData;

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

  protected async handleAuthRequest(url: string, data: RequestData): Promise<AuthResult> {
    try {
      await this.getCsrfCookie();

      const response = await fetch(`${this.baseURL}/api${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
      const errorMessage = error instanceof Error ? error.message : 'Network error - cannot connect to server';
      return { error: errorMessage };
    }
  }

  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    const requestData: LoginRequestData = {
      ...credentials,
      device_name: 'web-app'
    };
    const result = await this.handleAuthRequest('/auth/login', requestData);
    if (result.success) {
      return { success: true, data: { message: 'Login successful' } as LoginResponse }; // Placeholder for actual LoginResponse data
    } else {
      return { success: false, error: result.error };
    }
  }

  async logout(): Promise<ApiResponse<undefined>> {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

    try {
      if (token) {
        await fetch(`${this.baseURL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return { success: true, data: undefined };
  }

  async getUser(): Promise<ApiResponse<AuthUserResponse>> {
    // This method needs to be implemented or removed if not used.
    // For now, returning a placeholder.
    return { success: false, error: 'Not Implemented' };
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthUserResponse>> {
    const requestData: RegistrationRequestData = {
      ...data,
      role: 'candidate'
    };
    const result = await this.handleAuthRequest('/auth/register', requestData);
    if (result.success) {
      return { success: true, data: { message: 'Registration successful' } as AuthUserResponse }; // Placeholder
    } else {
      return { success: false, error: result.error };
    }
  }

  async registerAgency(
    data: RegisterData
  ): Promise<ApiResponse<AuthUserResponse>> {
    const requestData: RegistrationRequestData = {
      ...data,
      role: 'agency'
    };
    const result = await this.handleAuthRequest('/auth/register', requestData);
    if (result.success) {
      return { success: true, data: { message: 'Registration successful' } as AuthUserResponse }; // Placeholder
    } else {
      return { success: false, error: result.error };
    }
  }

  async registerEmployer(
    data: RegisterData
  ): Promise<ApiResponse<AuthUserResponse>> {
    const requestData: RegistrationRequestData = {
      ...data,
      role: 'employer'
    };
    const result = await this.handleAuthRequest('/auth/register', requestData);
    if (result.success) {
      return { success: true, data: { message: 'Registration successful' } as AuthUserResponse }; // Placeholder
    } else {
      return { success: false, error: result.error };
    }
  }
}
