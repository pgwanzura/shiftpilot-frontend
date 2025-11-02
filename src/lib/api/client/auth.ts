// lib/api/client/auth.ts
import { getRoleBasedRedirect } from '@/lib/utils/roles';
import type {
  LoginFormData,
  CandidateRegistrationData,
  RecruiterRegistrationData,
} from '@/lib/validations/schemas/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BASE_URL = API_URL.replace(/\/api$/, '');

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

interface LoginRequestData extends LoginFormData {
  device_name: string;
}

interface RegistrationRequestData extends CandidateRegistrationData {
  role: string;
}

interface RecruiterRegistrationRequestData extends RecruiterRegistrationData {
  role: string;
}

type RequestData = LoginRequestData | RegistrationRequestData | RecruiterRegistrationRequestData;

async function getCsrfCookie(): Promise<void> {
  const response = await fetch(`${BASE_URL}/sanctum/csrf-cookie`, { 
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`CSRF failed: ${response.status}`);
  }
}

function storeAuth(token: string, user: AuthUser): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 7}; ${isProduction ? 'secure;' : ''} samesite=lax`;
  
  document.cookie = `auth_token=${token}; ${cookieOptions}`;
  document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; ${cookieOptions}`;
}

function handleApiError(result: ApiError): string {
  if (result.errors) {
    const firstError = Object.values(result.errors)[0]?.[0];
    return firstError || 'Request failed';
  }
  return result.message || 'Request failed';
}

async function handleAuthRequest(url: string, data: RequestData): Promise<AuthResult> {
  try {
    await getCsrfCookie();

    const response = await fetch(`${API_URL}${url}`, {
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
      return { error: handleApiError(result) };
    }

    const result: AuthResponse = await response.json();
    storeAuth(result.access_token, result.user);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error - cannot connect to server';
    return { error: errorMessage };
  }
}

export async function loginUser(data: LoginFormData): Promise<AuthResult> {
  const requestData: LoginRequestData = {
    ...data,
    device_name: 'web-app'
  };
  return handleAuthRequest('/auth/login', requestData);
}

export async function registerCandidate(data: CandidateRegistrationData): Promise<AuthResult> {
  const requestData: RegistrationRequestData = {
    ...data,
    role: 'candidate'
  };
  return handleAuthRequest('/auth/register', requestData);
}

export async function registerRecruiter(data: RecruiterRegistrationData): Promise<AuthResult> {
  const requestData: RecruiterRegistrationRequestData = {
    ...data,
    role: 'recruiter'
  };
  return handleAuthRequest('/auth/register', requestData);
}

export async function logoutUser(): Promise<void> {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  try {
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
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
}