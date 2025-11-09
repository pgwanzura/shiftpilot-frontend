// app/agency/placements/PlacementsClient.tsx
'use client';

import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';
import { PlacementsDataTable } from '@/app/components/role/agency/placements/PlacementsDataTable';
import { PlacementStatsCards } from '@/app/components/role/agency/placements/PlacementStatsCards';
import { AuthUser } from '@/types/auth';

interface PlacementsClientProps {
  user: AuthUser;
}

export function PlacementsClient({ user }: PlacementsClientProps) {
  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />
      <PlacementStatsCards />
      <PlacementsDataTable />
    </div>
  );
}
