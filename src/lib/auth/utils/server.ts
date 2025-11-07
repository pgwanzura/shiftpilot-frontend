import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthResponse, AuthUser } from '@/types';
import { ALLOWED_ROLES, isValidRole, ROUTES, AUTH_COOKIES, getRoleRedirectPath } from '../roles';

export async function getAuthUser(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get(AUTH_COOKIES.USER);
    const tokenCookie = cookieStore.get(AUTH_COOKIES.TOKEN);

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

export async function requireAuth(
  allowedRoles?: readonly string[]
): Promise<{ user: AuthUser; access_token: string }> {
  const { user, access_token } = await getAuthUser();

  if (!user || !access_token) {
    redirect(ROUTES.LOGIN);
  }

  if (allowedRoles && !isValidRole(user.role, allowedRoles)) {
    redirect(ROUTES.UNAUTHORIZED);
  }

  return { user, access_token };
}
