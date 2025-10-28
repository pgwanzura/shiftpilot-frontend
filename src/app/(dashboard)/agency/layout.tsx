// Example: Agency layout with role protection
// src/app/(dashboard)/agency/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface AgencyLayoutProps {
  children: React.ReactNode;
}

const allowedRoles = ['agency_admin', 'agent'];

export default async function AgencyLayout({ children }: AgencyLayoutProps) {
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

    return <div className="agency-layout">{children}</div>;
  } catch {
    redirect('/login');
  }
}
