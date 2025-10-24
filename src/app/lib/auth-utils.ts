// app/lib/auth-utils.ts
import { serverAuthService } from './server-auth-service';
import { UserRole } from '@/lib/auth';

export { serverAuthService };

export async function getServerSession() {
  return serverAuthService.getSession();
}

export async function requireAuth(allowedRoles?: UserRole | UserRole[]) {
  if (allowedRoles) {
    return serverAuthService.protectRouteWithRole(allowedRoles);
  }
  return serverAuthService.protectRoute();
}

// Simple version with type assertion
export async function requireAuthWithRoles(allowedRoles: string | string[]) {
  if (allowedRoles) {
    return serverAuthService.protectRouteWithRole(
      allowedRoles as UserRole | UserRole[]
    );
  }
  return serverAuthService.protectRoute();
}
