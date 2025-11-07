'use client';

import { AuthUser } from '../../types/auth';
import { UserRole } from '../roles';

export function getUserFromCookie(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_user='));

    if (!cookie) return null;

    const value = cookie.split('=')[1];
    if (!value) return null;

    const user = JSON.parse(decodeURIComponent(value));

    if (user && user.id && user.name && user.email && user.role) {
      return user as AuthUser;
    }

    return null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUserFromCookie() !== null;
}

export function getUserRole(): UserRole | null {
  const user = getUserFromCookie();
  return user?.role || null;
}

export function hasRole(role: UserRole | UserRole[]): boolean {
  const user = getUserFromCookie();
  if (!user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}
