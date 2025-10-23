export interface AuthErrorResponse {
  errors?: Record<string, string[]>;
  hint?: string;
  message: string;
  remaining_attempts?: number;
}

export interface AuthResponse {
  access_token: string;
  message?: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
  access_token: string;
}

export interface AuthUser {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  role: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface LoginCredentials {
  device_name?: string;
  email: string;
  password: string;
  remember: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
  role?: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  role: 'candidate' | 'recruiter';
}

export interface ResetPasswordData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface Session {
  isAuthenticated: boolean;
  user: User | null;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  auth_type?: string;
  email_verified_at?: string | null;
  timezone?: string;
  locale?: string;
  company_domain?: string;
  company_name?: string;
  position?: string;
  profession?: string;
  phone?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: string;
  auth_type: string;
  terms: boolean;
  position?: string;
  profession?: string;
  summary?: string;
  company_name?: string;
}

export interface AuthApiResponse {
  access_token?: string;
  token?: string;
  user?: User;
  data?: User;
  token_type?: string;
  expires_in?: number;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
  data?: unknown;
}
