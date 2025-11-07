import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';
import { PlacementsDataTable } from '@/app/components/role/agency/placements/PlacementsDataTable';
import { PlacementStatsCards } from '@/app/components/role/agency/placements/PlacementStatsCards';
import { requireAuth} from '@/lib/auth/utils/auth';
import { ALLOWED_ROLES } from '@/lib/auth/utils/constants';

interface PlacementsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PlacementsPage({}: PlacementsPageProps) {
  const { user, access_token } = await requireAuth(ALLOWED_ROLES.AGENCY);

  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />
      <PlacementStatsCards authToken={access_token} />
      <PlacementsDataTable authToken={access_token} />
    </div>
  );
}
