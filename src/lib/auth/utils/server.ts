import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthResponse, AuthUser } from '@/types';

export const ALLOWED_ROLES = {
  AGENCY: ['agency_admin', 'agent'] as const,
  EMPLOYER: ['employer_admin', 'contact'] as const,
  ADMIN: ['super_admin'] as const,
  EMPLOYEE: ['employee'] as const,
  SYSTEM: ['system'] as const,
} as const;

export type AgencyRole = (typeof ALLOWED_ROLES.AGENCY)[number];
export type EmployerRole = (typeof ALLOWED_ROLES.EMPLOYER)[number];
export type AdminRole = (typeof ALLOWED_ROLES.ADMIN)[number];
export type EmployeeRole = (typeof ALLOWED_ROLES.EMPLOYEE)[number];
export type SystemRole = (typeof ALLOWED_ROLES.SYSTEM)[number];
export type UserRole =
  | AgencyRole
  | EmployerRole
  | AdminRole
  | EmployeeRole
  | SystemRole;

export async function getAuthUser(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('auth_user');
    const tokenCookie = cookieStore.get('auth_token');

    if (!userCookie?.value || !tokenCookie?.value) {
      return { user: null, access_token: null };
    }

    const userData = JSON.parse(userCookie.value) as AuthUser;

    if (!userData.id || !userData.email || !userData.role) {
      console.warn('Invalid user data structure in cookie');
      return { user: null, access_token: null };
    }

    return {
      user: userData,
      access_token: tokenCookie.value,
    };
  } catch (error) {
    console.error('Failed to parse auth_user cookie:', error);
    return { user: null, access_token: null };
  }
}

export function isValidRole<T extends readonly string[]>(
  role: string,
  allowedRoles: T
): role is T[number] {
  return allowedRoles.includes(role as T[number]);
}

export async function requireAuth(
  allowedRoles?: readonly string[]
): Promise<{ user: AuthUser; access_token: string }> {
  const { user, access_token } = await getAuthUser();

  if (!user || !access_token) {
    redirect('/login');
  }

  if (allowedRoles && !isValidRole(user.role, allowedRoles)) {
    redirect('/unauthorized');
  }

  return { user, access_token };
}

export function getRoleRedirectPath(role: string): string {
  const roleRedirects: Record<string, string> = {
    super_admin: '/admin',
    agency_admin: '/agency',
    agent: '/agency',
    employer_admin: '/employer',
    contact: '/employer',
    employee: '/employee',
    system: '/system',
  };

  return roleRedirects[role] || '/dashboard';
}
