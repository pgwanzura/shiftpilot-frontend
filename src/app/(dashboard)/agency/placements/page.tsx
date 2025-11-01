import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/app/components/layout';
import { QuickActions } from '@/app/components/ui';
import { PlacementsDataTable } from '@/app/components/role/agency/placements/PlacementsDataTable';
import { PlacementStatsCards } from '@/app/components/role/agency/placements/PlacementStatsCards';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthResponse {
  user: AuthUser | null;
  token: string | null;
}

interface PlacementsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ALLOWED_ROLES = ['agency_admin', 'agent'] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

async function getAuthUser(): Promise<AuthResponse> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');
  const tokenCookie = cookieStore.get('auth_token');

  if (!userCookie?.value || !tokenCookie?.value) {
    return { user: null, token: null };
  }

  try {
    const userData = JSON.parse(userCookie.value) as AuthUser;

    if (!userData.id || !userData.email || !userData.role) {
      console.error('Invalid user data structure in cookie');
      return { user: null, token: null };
    }

    return { user: userData, token: tokenCookie.value };
  } catch (error) {
    console.error('Failed to parse auth_user cookie:', error);
    return { user: null, token: null };
  }
}

function isValidRole(role: string): role is AllowedRole {
  return ALLOWED_ROLES.includes(role as AllowedRole);
}

export default async function PlacementsPage({}: PlacementsPageProps) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    redirect('/login');
  }

  if (!isValidRole(user.role)) {
    redirect('/unauthorized');
  }

  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />

      <PlacementStatsCards authToken={token} />

      <PlacementsDataTable authToken={token} />
    </div>
  );
}
