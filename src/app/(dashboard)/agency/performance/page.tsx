import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';

export default async function PerformancePage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) redirect('/login');

  let user;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    redirect('/login');
  }

  const allowedRoles = ['agency_admin', 'agent'];
  if (!allowedRoles.includes(user.role)) redirect('/unauthorized');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Performance Analytics"
        description="Employee performance metrics and analytics"
        actions={<QuickActions userRole={user.role} />}
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p>Performance analytics dashboard will go here...</p>
        </div>
      </div>
    </div>
  );
}
