import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PageHeader } from '@/app/components/layout';

interface AgentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) redirect('/login');

  let user;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    redirect('/login');
  }

  const allowedRoles = ['agency_admin'];
  if (!allowedRoles.includes(user.role)) redirect('/unauthorized');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Agent Profile"
        description="View and manage agent details"
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p>Agent profile view for ID: {params.id}</p>
        </div>
      </div>
    </div>
  );
}
