export type UserRole =
  | 'admin'
  | 'super_admin'
  | 'agency_admin'
  | 'agent'
  | 'employer_admin'
  | 'contact'
  | 'employee';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at?: string;
  last_login_at?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
  code?: string;
}

export interface AuthActionResult {
  error?: string;
  success?: boolean;
  redirectTo?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
  device_name?: string;
}

export interface AgencyRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  company_name: string;
  legal_name?: string;
  registration_number?: string;
  billing_email?: string;
  address?: string;
  city?: string;
  country?: string;
  terms: boolean;
  role: 'agency_admin';
}

export interface EmployerRegistrationData {
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
  role: 'employer_admin';
}

export type RegistrationData =
  | AgencyRegistrationData
  | EmployerRegistrationData;
