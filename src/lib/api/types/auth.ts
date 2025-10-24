import { User, UserRole, AuthResponse, LoginCredentials } from './api';

// These are the API-specific auth types that extend the base auth types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role: UserRole;
  company_name?: string;
  terms: boolean;
}

// Alias for consistency with your existing code
export type AuthUserResponse = AuthResponse;
export type LoginResponse = AuthResponse;

// Re-export the base types
export type { AuthResponse, LoginCredentials, User, UserRole };