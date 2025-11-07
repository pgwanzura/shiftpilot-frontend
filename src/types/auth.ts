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

export type RegistrationData =
  | AgencyRegistrationData
  | EmployerRegistrationData;

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

export type AuthUserResponse = AuthResponse;
export type LoginResponse = AuthResponse;

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

// @/lib/auth/types.ts
export const AUTH_COOKIES = {
  USER: 'auth_user',
  TOKEN: 'auth_token',
  SESSION: 'auth_session',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  AGENCY: '/agency',
  EMPLOYER: '/employer',
  EMPLOYEE: '/employee',
  SYSTEM: '/system',
} as const;

export const ROLE_REDIRECTS: Record<string, string> = {
  super_admin: ROUTES.ADMIN,
  agency_admin: ROUTES.AGENCY,
  agent: ROUTES.AGENCY,
  employer_admin: ROUTES.EMPLOYER,
  contact: ROUTES.EMPLOYER,
  employee: ROUTES.EMPLOYEE,
  system: ROUTES.SYSTEM,
} as const;

export const ALLOWED_ROLES = {
  AGENCY: ['agency_admin', 'agent'] as const,
  EMPLOYER: ['employer_admin', 'contact'] as const,
  ADMIN: ['super_admin'] as const,
  EMPLOYEE: ['employee'] as const,
  SYSTEM: ['system'] as const,
} as const;


export function isValidRole<T extends readonly string[]>(
  role: string,
  allowedRoles: T
): role is T[number] {
  return allowedRoles.includes(role as T[number]);
}

export function getRolePermissions(role: string) {
  return {
    canViewAgencyDashboard: () => isValidRole(role, ALLOWED_ROLES.AGENCY),
    canViewEmployerDashboard: () => isValidRole(role, ALLOWED_ROLES.EMPLOYER),
    canViewAdminDashboard: () => isValidRole(role, ALLOWED_ROLES.ADMIN),
    canManagePlacements: () =>
      isValidRole(role, [...ALLOWED_ROLES.EMPLOYER, ...ALLOWED_ROLES.ADMIN]),
    canViewPlacements: () =>
      isValidRole(role, [
        ...ALLOWED_ROLES.AGENCY,
        ...ALLOWED_ROLES.EMPLOYER,
        ...ALLOWED_ROLES.ADMIN,
      ]),
  } as const;
}

export function hasPermission(
  userRole: string,
  requiredRoles: readonly string[]
): boolean {
  return isValidRole(userRole, requiredRoles);
}

export function getDefaultRoute(userRole: string): string {
  return ROLE_REDIRECTS[userRole] || ROUTES.DASHBOARD;
}

export const rolePermissions = {
  canViewAgencyDashboard: (role: string) =>
    isValidRole(role, ALLOWED_ROLES.AGENCY),
  canViewEmployerDashboard: (role: string) =>
    isValidRole(role, ALLOWED_ROLES.EMPLOYER),
  canViewAdminDashboard: (role: string) =>
    isValidRole(role, ALLOWED_ROLES.ADMIN),
  canManagePlacements: (role: string) =>
    isValidRole(role, [...ALLOWED_ROLES.EMPLOYER, ...ALLOWED_ROLES.ADMIN]),
  canViewPlacements: (role: string) =>
    isValidRole(role, [
      ...ALLOWED_ROLES.AGENCY,
      ...ALLOWED_ROLES.EMPLOYER,
      ...ALLOWED_ROLES.ADMIN,
    ]),
} as const;
