import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

function getRoleRedirectPath(role: string): string {
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

export default async function DashboardRoot() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) {
    redirect('/login');
  }

  try {
    const user = JSON.parse(userCookie.value);
    const redirectPath = getRoleRedirectPath(user.role);
    redirect(redirectPath);
  } catch {
    redirect('/login');
  }
}
