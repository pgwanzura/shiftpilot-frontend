import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PageHeader } from '@/app/components/layout';

interface EmployerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EmployerDetailPage({ params }: EmployerDetailPageProps) {
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
        title="Employer Profile"
        description="View employer details and relationship"
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p>Employer profile view for ID: {params.id}</p>
        </div>
      </div>
    </div>
  );
}
