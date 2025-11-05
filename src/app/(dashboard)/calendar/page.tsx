import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PageHeader } from '@/app/components/layout';
import { CalendarActions } from '@/app/components/ui/actions/CalendarActions';
import { CalendarClient } from '@/app/components/ui';

export default async function CalendarPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) redirect('/login');

  let user;
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

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<CalendarActions userRole={user.role} />}
        customBreadcrumbs={{
          '/': 'Dashboard',
          calendar: 'Calendar',
        }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage shifts, placements, and interviews across all agencies
        </p>
      </PageHeader>

      <CalendarClient user={user} />
    </div>
  );
}
