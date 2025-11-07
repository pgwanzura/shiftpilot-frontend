import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleRedirectPath } from '@/lib/auth/utils/server';

const rolePermissions: Record<string, string[]> = {
  super_admin: ['/admin', '/agency', '/employer', '/employee', '/system'],
  agency_admin: ['/agency'],
  agent: ['/agency'],
  employer_admin: ['/employer'],
  contact: ['/employer'],
  employee: ['/employee'],
  system: ['/system'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userCookie = request.cookies.get('auth_user');

  if (!userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = JSON.parse(userCookie.value);
    const userRole = user.role;
    const allowedPaths = rolePermissions[userRole] || [];

    const isPathAllowed = allowedPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (!isPathAllowed) {
      const redirectPath = getRoleRedirectPath(userRole);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/agency/:path*',
    '/employer/:path*',
    '/employee/:path*',
    '/system/:path*',
    '/dashboard',
  ],
};
