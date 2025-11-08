// app/lib/server-auth-service.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthUser, UserRole } from '@/lib/auth';

class ServerAuthService {
  async getUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const authUserCookie = cookieStore.get('auth_user');

    if (!authUserCookie) return null;

    try {
      const user = JSON.parse(authUserCookie.value);
      return this.validateAuthUser(user) ? user : null;
    } catch {
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('auth_token');
    return authTokenCookie?.value || null;
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    const token = await this.getToken();
    return !!(user && token);
  }

  async protectRoute(redirectTo: string = '/login'): Promise<AuthUser> {
    const user = await this.getUser();
    const token = await this.getToken();

    if (!user || !token) {
      redirect(redirectTo);
    }

    return user;
  }

  async protectRouteWithRole(
    allowedRoles: UserRole | UserRole[],
    redirectTo: string = '/login'
  ): Promise<AuthUser> {
    const user = await this.protectRoute(redirectTo);
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      const userDashboard = this.getRoleBasedRedirect(user.role);
      redirect(userDashboard);
    }

    return user;
  }

  getRoleBasedRedirect(role: UserRole): string {
    switch (role) {
      case 'agency_admin':
      case 'agent':
        return '/agency/dashboard';
      case 'employer_admin':
      case 'contact':
        return '/employer/dashboard';
      case 'super_admin':
        return '/admin/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        return '/login';
    }
  }

  async getSession() {
    const user = await this.getUser();
    const isAuthenticated = await this.isAuthenticated();

    return {
      user: user || null,
      isAuthenticated,
    };
  }

  private validateAuthUser(user: any): user is AuthUser {
    return (
      user &&
      typeof user.id === 'string' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      typeof user.role === 'string' &&
      [
        'super_admin',
        'agency_admin',
        'agent',
        'employer_admin',
        'contact',
        'employee',
      ].includes(user.role)
    );
  }
}

export const serverAuthService = new ServerAuthService();
