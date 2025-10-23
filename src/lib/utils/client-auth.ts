'use client';

import { User } from '@/lib/api/types/auth';

interface AuthUserCookie {
  id: string | number;
  name: string;
  email: string;
  role: string;
  [key: string]: string | number | boolean | null;
}

export function getUserFromCookie(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    const possibleCookieNames = [
      'auth_user',
      'user',
      'session_user',
      'laravel_session',
    ];

    for (const cookieName of possibleCookieNames) {
      const cookie = cookies.find((c) => c.trim().startsWith(`${cookieName}=`));

      if (cookie) {
        const value = cookie.split('=')[1]?.trim();
        if (!value) continue;

        try {
          const parsedUser = JSON.parse(value);
          if (isValidAuthUser(parsedUser)) {
            return normalizeUser(parsedUser);
          }
        } catch {
          try {
            const decodedValue = decodeURIComponent(value);
            const parsedUser = JSON.parse(decodedValue);
            if (isValidAuthUser(parsedUser)) {
              return normalizeUser(parsedUser);
            }
          } catch {
            continue;
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isValidAuthUser(user: unknown): user is AuthUserCookie {
  if (!user || typeof user !== 'object') return false;

  const authUser = user as Record<string, unknown>;

  const idValid =
    typeof authUser.id === 'string' || typeof authUser.id === 'number';
  const nameValid = typeof authUser.name === 'string';
  const emailValid = typeof authUser.email === 'string';
  const roleValid = typeof authUser.role === 'string';

  return idValid && nameValid && emailValid && roleValid;
}

function normalizeUser(user: AuthUserCookie): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function isAuthenticated(): boolean {
  return getUserFromCookie() !== null;
}

export function getUserRole(): string | null {
  const user = getUserFromCookie();
  return user?.role || null;
}

export function hasRole(role: string): boolean {
  const user = getUserFromCookie();
  return user?.role === role;
}

export function debugCookies(): void {
  if (typeof window === 'undefined') return;
  console.log('All cookies:', document.cookie);
}
