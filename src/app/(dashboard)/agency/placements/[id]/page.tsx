import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';

interface PlacementDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PlacementDetailPage({
  params,
}: PlacementDetailPageProps) {
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
      <PageHeader actions={<QuickActions userRole={user.role} />} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p>Placement detail view and response form for ID: {params.id}</p>
        </div>
      </div>
    </div>
  );
}
