// app/agency/placements/page.tsx
import { requireAuth } from '@/lib/auth/utils/server';
import { ALLOWED_ROLES } from '@/lib/auth/roles';
import { PlacementsClient } from '@/app/components/role/agency/placements/PlacementsClient';

interface PlacementsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PlacementsPage({}: PlacementsPageProps) {
  const { user } = await requireAuth(ALLOWED_ROLES.AGENCY);

  return <PlacementsClient user={user} />;
}
