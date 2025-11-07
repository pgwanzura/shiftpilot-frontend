import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthResponse, AuthUser } from '@/types';
import { ALLOWED_ROLES } from './constants';

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

export function requireUnauth(): Promise<{ user: null; access_token: null }> {
  return new Promise(async (resolve) => {
    const { user, access_token } = await getAuthUser();

    if (user && access_token) {
      redirect(getRoleRedirectPath(user.role));
    }

    resolve({ user: null, access_token: null });
  });
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

export function hasPermission(
  userRole: string,
  requiredRoles: readonly string[]
): boolean {
  return isValidRole(userRole, requiredRoles);
}

export function getDefaultRoute(userRole: string): string {
  return getRoleRedirectPath(userRole);
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
