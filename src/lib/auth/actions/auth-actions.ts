'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  LoginFormData,
  AgencyRegistrationData,
  EmployerRegistrationData,
} from '../schemas';
import { AuthActionResult } from '@/types/auth';
import { getRoleRedirectPath } from '../roles';

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  access_token: string;
  user: AuthUser;
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

function getApiUrl(): string {
  const isDocker = process.env.DOCKER_ENV === 'true';
  const internalApiUrl = process.env.INTERNAL_API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (isDocker) return validateUrl(internalApiUrl, 'http://shiftpilot-api:80');
  return validateUrl(publicApiUrl, 'http://localhost:8000');
}

const API_URL = getApiUrl();

async function storeAuth(token: string, user: AuthUser): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set({
    name: 'auth_token',
    value: token,
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set({
    name: 'auth_user',
    value: JSON.stringify(user),
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseURL = API_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const cookieStore = await cookies();
  const existingCookies = cookieStore.toString();

  const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;
  const csrfResponse = await fetch(csrfUrl, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json', Cookie: existingCookies },
  });

  if (!csrfResponse.ok) {
    const errorText = await csrfResponse.text();
    throw new Error(
      `CSRF request failed: ${csrfResponse.status} ${csrfResponse.statusText} — ${errorText}`
    );
  }

  const setCookieHeader =
    csrfResponse.headers.get('set-cookie') || existingCookies;
  const xsrfToken = extractXsrfFromSetCookie(setCookieHeader);
  const apiUrl = `${baseURL}/api/${cleanEndpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      Cookie: setCookieHeader,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(apiUrl, config);

  if (!response.ok) {
    const text = await response.text();
    let parsed: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text || response.statusText };
    }
    const apiError: ApiError = {
      message: parsed.message ?? response.statusText,
      status: response.status,
      errors: parsed.errors,
    };
    throw apiError;
  }

  const json = (await response.json()) as T;
  return json;
}

function extractXsrfFromSetCookie(setCookieHeader: string): string {
  if (!setCookieHeader) return '';
  const match = setCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function extractFirstError(apiError: ApiError): string {
  if (apiError.errors && Object.keys(apiError.errors).length > 0) {
    const first = Object.values(apiError.errors)[0];
    return Array.isArray(first) ? first[0] : 'An error occurred';
  }
  return apiError.message || 'An unexpected error occurred';
}

export async function loginAction(
  data: LoginFormData
): Promise<AuthActionResult> {
  try {
    const response = await serverFetch<AuthResponse>('/auth/login', {
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
  } catch (error) {
    if (isApiError(error))
      return { success: false, error: extractFirstError(error) };
    return {
      success: false,
      error: (error as Error)?.message ?? 'Login failed',
    };
  }
}

export async function registerAgencyAction(
  data: AgencyRegistrationData
): Promise<AuthActionResult> {
  try {
    const response = await serverFetch<AuthResponse>('/auth/register/agency', {
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
  } catch (error) {
    if (isApiError(error))
      return { success: false, error: extractFirstError(error) };
    return {
      success: false,
      error: (error as Error)?.message ?? 'Registration failed',
    };
  }
}

export async function registerEmployerAction(
  data: EmployerRegistrationData
): Promise<AuthActionResult> {
  try {
    const response = await serverFetch<AuthResponse>(
      '/auth/register/employer',
      {
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
      }
    );
    await storeAuth(response.access_token, response.user);
    const redirectTo = getRoleRedirectPath(response.user.role);
    return { success: true, redirectTo };
  } catch (error) {
    if (isApiError(error))
      return { success: false, error: extractFirstError(error) };
    return {
      success: false,
      error: (error as Error)?.message ?? 'Registration failed',
    };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get('auth_token')?.value;
    if (token) {
      await serverFetch<null>('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error('Logout error:', (error as Error)?.message ?? error);
  } finally {
    cookieStore.delete('auth_token');
    cookieStore.delete('auth_user');
    redirect('/login');
  }
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}
