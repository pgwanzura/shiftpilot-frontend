// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Strictly typed user roles and permissions
export type UserRole =
  | 'super_admin'
  | 'agency_admin'
  | 'agent'
  | 'employer_admin'
  | 'contact'
  | 'employee'
  | 'system';

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

// Role-based path permissions (principle of least privilege)
const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ['/admin'],
  agency_admin: ['/agency'],
  agent: ['/agency'],
  employer_admin: ['/employer'],
  contact: ['/employer'],
  employee: ['/employee'],
  system: ['/system'],
};

// Default redirect paths for each role
const roleDefaultPaths: Record<UserRole, string> = {
  super_admin: '/admin',
  agency_admin: '/agency',
  agent: '/agency',
  employer_admin: '/employer',
  contact: '/employer',
  employee: '/employee',
  system: '/system',
};

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth',
  '/_next',
  '/static',
  '/favicon.ico',
];

// Security headers configuration
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Validates and parses user data from cookie with proper error handling
 */
function validateUserData(cookieValue: string): AuthUser | null {
  try {
    const user = JSON.parse(cookieValue) as AuthUser;

    // Basic validation
    if (!user.id || !user.role || !user.email) {
      return null;
    }

    // Validate role
    if (!(user.role in rolePermissions)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Checks if path requires authentication
 */
function isPathProtected(pathname: string): boolean {
  // Public paths don't require auth
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return false;
  }

  // API routes handling (adjust based on your API structure)
  if (pathname.startsWith('/api/')) {
    return !pathname.startsWith('/api/auth/');
  }

  return true;
}

/**
 * Checks if user has permission to access the path
 */
function hasPathPermission(userRole: UserRole, pathname: string): boolean {
  const allowedPaths = rolePermissions[userRole];

  return allowedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  const response = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Skip authentication check for public paths
  if (!isPathProtected(pathname)) {
    return response;
  }

  // Check authentication
  const userCookie = request.cookies.get('auth_user');

  if (!userCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // Validate user data
  const user = validateUserData(userCookie.value);

  if (!user) {
    // Clear invalid cookie and redirect to login
    const redirect = NextResponse.redirect(new URL('/login', request.url));
    redirect.cookies.delete('auth_user');
    return redirect;
  }

  // Handle root path redirect
  if (pathname === '/') {
    const defaultPath = roleDefaultPaths[user.role];
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  // Check path permissions
  if (!hasPathPermission(user.role, pathname)) {
    // User doesn't have permission - redirect to their default path
    const defaultPath = roleDefaultPaths[user.role];
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
