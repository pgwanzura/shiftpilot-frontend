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

interface PlacementStats {
  total: number;
  active: number;
  draft: number;
  filled: number;
  completed: number;
  responses: number;
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

interface PlacementsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ALLOWED_ROLES = ['agency_admin', 'agent'] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:8000',
    timeout: 5000,
  },
  production: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://your-production-domain.com',
    timeout: 10000,
  },
  test: {
    baseUrl: 'http://localhost:3001',
    timeout: 3000,
  },
} as const;

function getApiConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  return (
    API_CONFIG[nodeEnv as keyof typeof API_CONFIG] || API_CONFIG.development
  );
}

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

async function getPlacementStats(token: string): Promise<PlacementStats> {
  const config = getApiConfig();
  const url = `${config.baseUrl}/api/placements/stats/detailed`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    console.log(`Fetching stats from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = (await response.json()) as ApiResponse<PlacementStats>;

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Invalid API response format');
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      console.error('API Connection Error:', {
        message: error.message,
        url,
        environment: process.env.NODE_ENV,
      });
    }

    return getFallbackStats();
  }
}

function getFallbackStats(): PlacementStats {
  return {
    total: 0,
    active: 0,
    draft: 0,
    filled: 0,
    completed: 0,
    responses: 0,
  };
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

  const stats = await getPlacementStats(token);

  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />

      <PlacementStatsCards stats={stats} />

      <PlacementsDataTable authToken={token} />
    </div>
  );
}
