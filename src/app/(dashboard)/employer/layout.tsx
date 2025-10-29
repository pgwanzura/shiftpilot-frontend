import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

const allowedRoles = ['employer_admin', 'manager', 'contact'];

export default async function EmployerLayout({
  children,
}: EmployerLayoutProps) {
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

    return <div className="employer-layout">{children}</div>;
  } catch {
    redirect('/login');
  }
}
