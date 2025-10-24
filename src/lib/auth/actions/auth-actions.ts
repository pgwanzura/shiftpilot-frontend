'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  LoginFormData,
  AgencyRegistrationFormData,
  EmployerRegistrationFormData,
} from '../schemas';
import { AuthActionResult } from '../types';

function getApiUrl(): string {
  if (process.env.DOCKER_ENV === 'true') {
    return process.env.INTERNAL_API_URL || 'http://shiftpilot-api:80';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
}

const API_URL = getApiUrl();

function logDebug(message: string, data?: any) {
  console.log(`[AUTH DEBUG] ${message}`, data || '');
}

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

  logDebug('Making server fetch request', {
    baseURL,
    endpoint: `${baseURL}/api/${cleanEndpoint}`,
  });

  try {
    // Create a simple cookie store for the server-side request
    const cookieStore = await cookies();
    const existingCookies = cookieStore.toString();

    // First, get CSRF token - with simplified approach
    const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;
    logDebug('Fetching CSRF token', csrfUrl);

    const csrfResponse = await fetch(csrfUrl, {
      method: 'GET',
      credentials: 'include', // Important for cookies
      headers: {
        Accept: 'application/json',
        Cookie: existingCookies, // Pass existing cookies
      },
    });

    logDebug('CSRF response status', csrfResponse.status);
    logDebug(
      'CSRF response headers',
      Object.fromEntries(csrfResponse.headers.entries())
    );

    if (!csrfResponse.ok) {
      const errorText = await csrfResponse.text();
      logDebug('CSRF error response', errorText);
      throw new Error(
        `CSRF request failed: ${csrfResponse.status} ${csrfResponse.statusText}`
      );
    }

    // Extract cookies from response and store them
    const responseCookies = csrfResponse.headers.getSetCookie();
    logDebug('CSRF response cookies', responseCookies);

    // Get XSRF token from cookies
    let xsrfToken = '';
    for (const cookie of responseCookies) {
      const match = cookie.match(/XSRF-TOKEN=([^;]+)/);
      if (match) {
        xsrfToken = decodeURIComponent(match[1]);
        break;
      }
    }

    logDebug('XSRF Token extracted', xsrfToken ? 'Yes' : 'No');

    // For the actual API request, use the same origin and include credentials
    const apiUrl = `${baseURL}/api/${cleanEndpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken }),
        // Include any cookies we received
        Cookie: csrfResponse.headers.get('set-cookie') || existingCookies,
        ...options.headers,
      },
    };

    logDebug('Making API request', {
      url: apiUrl,
      method: options.method,
      hasXsrfToken: !!xsrfToken,
    });

    const response = await fetch(apiUrl, config);

    logDebug('API response status', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      logDebug('API error response', errorText);

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
    logDebug('API success response', {
      hasToken: !!responseData.access_token,
      userRole: responseData.user?.role,
    });
    return responseData;
  } catch (error) {
    logDebug('Fetch error details', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// Alternative simplified version without CSRF for testing
async function simpleServerFetch(endpoint: string, options: RequestInit = {}) {
  const baseURL = API_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const apiUrl = `${baseURL}/api/${cleanEndpoint}`;

  logDebug('Making simple fetch request', { apiUrl });

  try {
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(apiUrl, config);

    logDebug('Simple fetch response status', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      logDebug('Simple fetch error response', errorText);

      let errorData: { message?: string; errors?: Record<string, string[]> } =
        {};
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      throw new Error(
        errorData.message || `Request failed: ${response.status}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    logDebug('Simple fetch error', error);
    throw error;
  }
}

export async function loginAction(
  data: LoginFormData
): Promise<AuthActionResult> {
  logDebug('Login action started', { email: data.email });

  try {
    // Try simple fetch first (without CSRF)
    const response = await simpleServerFetch('/auth/login', {
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
    logDebug('Login successful', { redirectTo });
    return { success: true, redirectTo };
  } catch (error: any) {
    logDebug('Login action failed', error);

    // If simple fetch fails, try with CSRF
    try {
      logDebug('Trying login with CSRF flow');
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
      logDebug('Login successful with CSRF', { redirectTo });
      return { success: true, redirectTo };
    } catch (csrfError: any) {
      logDebug('CSRF login also failed', csrfError);

      if (csrfError.errors) {
        const errorEntries = Object.entries(csrfError.errors);
        const firstError = errorEntries[0]?.[1];
        return {
          error: Array.isArray(firstError) ? firstError[0] : 'Login failed',
        };
      }

      return { error: csrfError.message || 'An unexpected error occurred' };
    }
  }
}

// Keep other actions the same but use simpleServerFetch for now
export async function registerAgencyAction(
  data: AgencyRegistrationFormData
): Promise<AuthActionResult> {
  logDebug('Agency registration started', { email: data.email });

  try {
    const response = await simpleServerFetch('/auth/register/agency', {
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
    logDebug('Agency registration successful', { redirectTo });
    return { success: true, redirectTo };
  } catch (error: any) {
    logDebug('Agency registration failed', error);

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
  data: EmployerRegistrationFormData
): Promise<AuthActionResult> {
  logDebug('Employer registration started', { email: data.email });

  try {
    const response = await simpleServerFetch('/auth/register/employer', {
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
    logDebug('Employer registration successful', { redirectTo });
    return { success: true, redirectTo };
  } catch (error: any) {
    logDebug('Employer registration failed', error);

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

// Keep logoutAction and getRoleRedirectPath the same
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      await simpleServerFetch('/auth/logout', {
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

function getRoleRedirectPath(role: string): string {
  switch (role) {
    case 'agency_admin':
    case 'agent':
      return '/agency/dashboard';
    case 'employer_admin':
    case 'contact':
      return '/employer/dashboard';
    case 'super_admin':
      return '/admin/dashboard';
    case 'employee':
      return '/employee/dashboard';
    default:
      return '/dashboard';
  }
}
