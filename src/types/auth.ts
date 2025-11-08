// @/types/auth.ts

export type UserRole =
  | 'admin'
  | 'super_admin'
  | 'agency_admin'
  | 'agent'
  | 'employer_admin'
  | 'contact'
  | 'employee';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type RegistrationData =
  | AgencyRegistrationData
  | EmployerRegistrationData;

export type AuthUserResponse = AuthResponse;
export type LoginResponse = AuthResponse;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  status: UserStatus;
  meta?: Record<string, unknown>;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthSession {
  token: string | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthResponse {
  access_token: string | null;
  user: AuthUser | null;
}

export interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
  code?: string;
  status?: number;
}

export interface AuthActionResult {
  error?: string;
  success: boolean;
  redirectTo?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
  device_name?: string;
  two_factor_code?: string;
  two_factor_recovery_code?: string;
}

export interface BaseRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  company_name: string;
  billing_email?: string;
  address?: string;
  city?: string;
  country?: string;
  terms: boolean;
}

export interface AgencyRegistrationData extends BaseRegistrationData {
  legal_name?: string;
  registration_number?: string;
  role: 'agency_admin';
}

export interface EmployerRegistrationData extends BaseRegistrationData {
  role: 'employer_admin';
}



export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role: UserRole;
  company_name?: string;
  terms: boolean;
  legal_name?: string;
  registration_number?: string;
  billing_email?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface PasswordResetData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface TwoFactorAuthData {
  code: string;
  recovery_code?: string;
}

export interface SessionData {
  user: AuthUser;
  expires: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface RoleWithPermissions {
  name: UserRole;
  permissions: Permission[];
}
