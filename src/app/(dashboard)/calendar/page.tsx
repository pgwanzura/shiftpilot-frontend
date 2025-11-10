import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import CalendarPageClient from '@/app/components/ui/calendar/CalendarPageClient';

interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export default async function CalendarPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) redirect('/login');

  let user: User;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    redirect('/login');
  }

  const allowedRoles = [
    'super_admin',
    'agency_admin',
    'agent',
    'employer_admin',
    'manager',
    'contact',
    'employee',
  ];

  if (!allowedRoles.includes(user.role)) redirect('/unauthorized');

  return <CalendarPageClient user={user} />;
}
