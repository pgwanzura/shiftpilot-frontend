import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

class ServerAuthService {
  async getUser() {
    const cookieStore = await cookies();
    const authUserCookie = cookieStore.get('auth_user');

    if (!authUserCookie) return null;

    try {
      return JSON.parse(authUserCookie.value);
    } catch {
      return null;
    }
  }

  async getToken() {
    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('auth_token');
    return authTokenCookie?.value || null;
  }

  async isAuthenticated() {
    const user = await this.getUser();
    const token = await this.getToken();
    return !!(user && token);
  }

  async protectRoute(redirectTo: string = '/login') {
    const user = await this.getUser();
    const token = await this.getToken();

    if (!user || !token) {
      redirect(redirectTo);
    }

    return user;
  }

  async protectRouteWithRole(
    allowedRoles: string | string[],
    redirectTo: string = '/login'
  ) {
    const user = await this.protectRoute(redirectTo);

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      const userDashboard = this.getRoleBasedRedirect(user.role);
      redirect(userDashboard);
    }

    return user;
  }

  private getRoleBasedRedirect(role: string): string {
    switch (role) {
      case 'candidate':
        return '/candidate';
      case 'recruiter_admin':
      case 'recruiter':
        return '/recruiter';
      case 'super_admin':
      case 'admin':
        return '/admin';
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

  async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const API_URL = this.getApiUrl();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private getApiUrl(): string {
    if (process.env.DOCKER_ENV === 'true') {
      return process.env.INTERNAL_API_URL || 'http://api:80/api';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }
}

export const serverAuthService = new ServerAuthService();
