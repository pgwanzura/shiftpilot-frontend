'use server';

import { cookies } from 'next/headers';
import type {
  LoginFormData,
  CandidateRegistrationData,
  RecruiterRegistrationData,
} from '@/lib/validations/schemas/auth';

function getApiUrl(): string {
  if (process.env.DOCKER_ENV === 'true') {
    return process.env.INTERNAL_API_URL || 'http://api:80/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
}

function getBaseUrl(): string {
  const apiUrl = getApiUrl();

  return apiUrl.replace(/\/api$/, '');
}

const API_URL = getApiUrl();
const BASE_URL = getBaseUrl();

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

interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

interface AuthActionResult {
  error?: string;
  success?: boolean;
}

async function getCsrfCookie(): Promise<void> {
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

async function storeAuth(token: string, user: AuthUser): Promise<void> {
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

export async function loginAction(
  data: LoginFormData
): Promise<AuthActionResult> {
  try {
    await getCsrfCookie();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        device_name: 'web-app',
      }),
    });

    const result: AuthResponse & ApiErrorResponse = await response.json();

    if (!response.ok) {
      if (result.errors) {
        const errorEntries = Object.entries(result.errors);
        const firstError = errorEntries[0]?.[1];
        return { error: firstError?.[0] || 'Login failed' };
      }
      return { error: result.message || 'Login failed' };
    }

    await storeAuth(result.access_token, result.user);
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ⭐ CANDIDATE REGISTRATION - Called by CandidateRegistrationForm
export async function registerCandidateAction(
  data: CandidateRegistrationData
): Promise<AuthActionResult> {
  try {
    await getCsrfCookie();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result: AuthResponse & ApiErrorResponse = await response.json();

    if (!response.ok) {
      if (result.errors) {
        const errorEntries = Object.entries(result.errors);
        const firstError = errorEntries[0]?.[1];
        return { error: firstError?.[0] || 'Registration failed' };
      }
      return { error: result.message || 'Registration failed' };
    }

    await storeAuth(result.access_token, result.user);
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ⭐ RECRUITER REGISTRATION - Called by RecruiterRegistrationForm
export async function registerRecruiterAction(
  data: RecruiterRegistrationData
): Promise<AuthActionResult> {
  try {
    await getCsrfCookie();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result: AuthResponse & ApiErrorResponse = await response.json();

    if (!response.ok) {
      if (result.errors) {
        const errorEntries = Object.entries(result.errors);
        const firstError = errorEntries[0]?.[1];
        return { error: firstError?.[0] || 'Registration failed' };
      }
      return { error: result.message || 'Registration failed' };
    }

    await storeAuth(result.access_token, result.user);
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ⭐ LOGOUT ACTION
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        credentials: 'include',
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    cookieStore.delete('auth_token');
    cookieStore.delete('auth_user');
  }
}
