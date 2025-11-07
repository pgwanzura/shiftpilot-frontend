'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  LoginFormData,
  AgencyRegistrationData,
  EmployerRegistrationData,
} from '../schemas';
import { AuthActionResult } from '../types';
import { getRoleRedirectPath } from '../utils/server';

function getApiUrl(): string {
  const isDocker = process.env.DOCKER_ENV === 'true';
  const internalApiUrl = process.env.INTERNAL_API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (isDocker) {
    return validateUrl(internalApiUrl, 'http://shiftpilot-api:80');
  }

  return validateUrl(publicApiUrl, 'http://localhost:8000');
}

function validateUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;

  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`Invalid URL configured: ${url}, using fallback: ${fallback}`);
    return fallback;
  }
}

const API_URL = getApiUrl();

async function storeAuth(token: string, user: any): Promise<void> {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  };

  cookieStore.set('auth_token', token, cookieOptions);
  cookieStore.set('auth_user', JSON.stringify(user), {
    ...cookieOptions,
    httpOnly: false,
  });
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const baseURL = API_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');

  try {
    const cookieStore = await cookies();
    const existingCookies = cookieStore.toString();
    const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;

    const csrfResponse = await fetch(csrfUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        Cookie: existingCookies,
      },
    });

    if (!csrfResponse.ok) {
      const errorText = await csrfResponse.text();
      throw new Error(
        `CSRF request failed: ${csrfResponse.status} ${csrfResponse.statusText}`
      );
    }

    const responseCookies = csrfResponse.headers.getSetCookie();

    let xsrfToken = '';
    for (const cookie of responseCookies) {
      const match = cookie.match(/XSRF-TOKEN=([^;]+)/);
      if (match) {
        xsrfToken = decodeURIComponent(match[1]);
        break;
      }
    }

    const apiUrl = `${baseURL}/api/${cleanEndpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken }),
        Cookie: csrfResponse.headers.get('set-cookie') || existingCookies,
        ...options.headers,
      },
    };

    const response = await fetch(apiUrl, config);

    if (!response.ok) {
      const errorText = await response.text();

      let errorData: { message?: string; errors?: Record<string, string[]> } =
        {};
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      const apiError: ApiError = {
        message: errorData.message || response.statusText,
        status: response.status,
        errors: errorData.errors,
      };

      throw apiError;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function loginAction(
  data: LoginFormData
): Promise<AuthActionResult> {
  try {
    const response = await serverFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        remember: data.remember,
        device_name: 'shiftpilot-web',
      }),
    });

    await storeAuth(response.access_token, response.user);

    const redirectTo = getRoleRedirectPath(response.user.role);
    return { success: true, redirectTo };
  } catch (error: any) {
    if (error.errors) {
      const errorEntries = Object.entries(error.errors);
      const firstError = errorEntries[0]?.[1];
      return {
        error: Array.isArray(firstError) ? firstError[0] : 'Login failed',
      };
    }

    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function registerAgencyAction(
  data: AgencyRegistrationData
): Promise<AuthActionResult> {
  try {
    const response = await serverFetch('/auth/register/agency', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        phone: data.phone,
        role: 'agency_admin',
        company_name: data.company_name,
        terms: data.terms,
      }),
    });

    await storeAuth(response.access_token, response.user);
    const redirectTo = getRoleRedirectPath(response.user.role);
    return { success: true, redirectTo };
  } catch (error: any) {
    if (error.errors) {
      const errorEntries = Object.entries(error.errors);
      const firstError = errorEntries[0]?.[1];
      return {
        error: Array.isArray(firstError)
          ? firstError[0]
          : 'Registration failed',
      };
    }

    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function registerEmployerAction(
  data: EmployerRegistrationData
): Promise<AuthActionResult> {
  try {
    const response = await serverFetch('/auth/register/employer', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        phone: data.phone,
        role: 'employer_admin',
        company_name: data.company_name,
        terms: data.terms,
      }),
    });

    await storeAuth(response.access_token, response.user);
    const redirectTo = getRoleRedirectPath(response.user.role);
    return { success: true, redirectTo };
  } catch (error: any) {
    if (error.errors) {
      const errorEntries = Object.entries(error.errors);
      const firstError = errorEntries[0]?.[1];
      return {
        error: Array.isArray(firstError)
          ? firstError[0]
          : 'Registration failed',
      };
    }

    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      await serverFetch('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    cookieStore.delete('auth_token');
    cookieStore.delete('auth_user');
    redirect('/login');
  }
}
