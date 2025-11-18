import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AuthUser } from '@/lib/auth';
import { getRoleRedirectPath } from '@/lib/auth';

export default async function RootPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie?.value) {
    redirect('/login');
  }

  try {
    const user = JSON.parse(userCookie.value) as AuthUser;
    const redirectPath = getRoleRedirectPath(user.role);
    redirect(redirectPath);
  } catch {
    redirect('/login');
  }
}
