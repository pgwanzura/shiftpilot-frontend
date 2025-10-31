// app/agency/placements/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';
import { PlacementsTable } from '@/app/components/role/agency/placements/PlacementsTable';
import { PlacementStatsCards } from '@/app/components/role/agency/placements/PlacementStatsCards';

interface PlacementsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getAuthUser(): Promise<{
  user: any | null;
  token: string | null;
}> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');
  const tokenCookie = cookieStore.get('auth_token');

  if (!userCookie || !tokenCookie) {
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(userCookie.value);
    return { user, token: tokenCookie.value };
  } catch (error) {
    console.error('Failed to parse auth_user cookie:', error);
    return { user: null, token: null };
  }
}

// Mock stats data - replace with actual API call
async function getPlacementStats(token: string) {
  // TODO: Replace with actual API call to get stats
  return {
    total: 24,
    active: 12,
    draft: 5,
    filled: 4,
    completed: 3,
    responses: 47,
  };
}

export default async function PlacementsPage({
  searchParams,
}: PlacementsPageProps) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    redirect('/login');
  }

  const allowedRoles = ['agency_admin', 'agent'];
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  // Fetch stats data
  const stats = await getPlacementStats(token);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placements"
        description="Manage and track your placement opportunities"
        actions={<QuickActions userRole={user.role} />}
      />

      {/* Stats Cards - Now using client component */}
      <PlacementStatsCards stats={stats} />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <PlacementsTable authToken={token} />
        </div>
      </div>
    </div>
  );
}
