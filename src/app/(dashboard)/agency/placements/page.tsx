import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';
import { PlacementsTable } from '@/app/components/role/agency/placements/PlacementsTable';
import { PlacementStats } from '@/app/components/role/agency/placements/PlacementStats';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { AuthUser, UserRole } from '@/lib/auth';

interface PlacementsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getAuthUser(): Promise<{ user: AuthUser | null; token: string | null }> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');
  const tokenCookie = cookieStore.get('auth_token');

  console.log('Server-side: auth_user cookie', userCookie);
  console.log('Server-side: auth_token cookie', tokenCookie);

  if (!userCookie || !tokenCookie) {
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(userCookie.value);
    return { user, token: tokenCookie.value };
  } catch (error) {
    console.error('Server-side: Error parsing auth_user cookie', error);
    return { user: null, token: null };
  }
}

export default async function PlacementsPage({ searchParams }: PlacementsPageProps) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    redirect('/login');
  }

  const allowedRoles: UserRole[] = ['agency_admin', 'agent'];
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  // Client component specific hooks and state will be managed within PlacementsTable
  // and other child client components. Here we only fetch server-side data.
  
  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />

      {/* Stats Overview */}
      {/* useDashboardStats will need to be a client component and fetch stats client-side or be wrapped */}
      {/* For now, we will remove direct usage here to fix the immediate issue */}

      {/* Placements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <PlacementsTable authToken={token} />
        </div>
      </div>
    </div>
  );
}
