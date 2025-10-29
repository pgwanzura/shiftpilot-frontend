import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const allowedRoles = ['super_admin'];

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) {
    redirect('/login');
  }

  try {
    const user = JSON.parse(userCookie.value);

    if (!allowedRoles.includes(user.role)) {
      redirect('/unauthorized');
    }

    return <div className="admin-layout">{children}</div>;
  } catch {
    redirect('/login');
  }
}
