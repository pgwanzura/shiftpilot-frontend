// @/lib/auth/utils.ts
import { ALLOWED_ROLES, ROLE_REDIRECTS, ROUTES } from './utils/constants';

import type { AuthUser } from '../../types';

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

export function getRoleRedirectPath(role: string): string {
  return ROLE_REDIRECTS[role] || ROUTES.DASHBOARD;
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

export class AuthClient {
  static getUserFromStorage(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem('auth_user');
      if (!userData) return null;

      return JSON.parse(userData) as AuthUser;
    } catch {
      return null;
    }
  }

  static setUserInStorage(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  static clearUserStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_user');
  }

  static hasClientPermission(
    userRole: string,
    requiredRoles: readonly string[]
  ): boolean {
    return isValidRole(userRole, requiredRoles);
  }

  static getClientRedirectPath(role: string): string {
    return getRoleRedirectPath(role);
  }
}
