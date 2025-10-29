import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const allowedRoles = ['employee'];

export default async function EmployeeLayout({ children }: EmployeeLayoutProps) {
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

    return <div className="employee-layout">{children}</div>;
  } catch {
    redirect('/login');
  }
}