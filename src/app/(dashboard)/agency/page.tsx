import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  PoundSterling,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { StatCard } from '@/app/components/ui';
import { RecentShifts } from '@/app/components/role/agency/RecentShifts';
import { QuickActions } from '@/app/components/role/agency/QuickActions';
import { PageHeader } from '@/app/components/layout';

interface DashboardStats {
  totalShifts: number;
  activeEmployees: number;
  pendingApprovals: number;
  revenueThisMonth: number;
  shiftFillRate: number;
  upcomingShifts: number;
}

interface RecentShift {
  id: string;
  employeeName: string;
  employerName: string;
  location: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface AgencyDashboardProps {
  stats: DashboardStats;
  recentShifts: RecentShift[];
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

function getStatusIcon(status: string) {
  const statusIcons: Record<string, React.ReactNode> = {
    scheduled: <Calendar className="w-4 h-4" />,
    in_progress: <Clock className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };
  return statusIcons[status] || <AlertCircle className="w-4 h-4" />;
}

async function getDashboardData(): Promise<AgencyDashboardProps> {
  // Mock data - replace with actual API call
  return {
    stats: {
      totalShifts: 147,
      activeEmployees: 89,
      pendingApprovals: 23,
      revenueThisMonth: 45280,
      shiftFillRate: 94,
      upcomingShifts: 18,
    },
    recentShifts: [
      {
        id: '1',
        employeeName: 'Sarah Johnson',
        employerName: 'St. Mary Hospital',
        location: 'ICU Ward',
        startTime: '2024-01-15T08:00:00Z',
        endTime: '2024-01-15T16:00:00Z',
        status: 'completed',
      },
      {
        id: '2',
        employeeName: 'Mike Chen',
        employerName: 'Tech Solutions Ltd',
        location: 'Data Center',
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T17:00:00Z',
        status: 'in_progress',
      },
      {
        id: '3',
        employeeName: 'Emma Davis',
        employerName: 'City Elementary',
        location: 'Classroom 4B',
        startTime: '2024-01-16T08:30:00Z',
        endTime: '2024-01-16T15:30:00Z',
        status: 'scheduled',
      },
    ],
  };
}

export default async function AgencyPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user');

  if (!userCookie) {
    redirect('/login');
  }

  let user;

  try {
    user = JSON.parse(userCookie.value);
  } catch {
    redirect('/login');
  }

  const allowedRoles = ['agency_admin', 'agent'];
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  const dashboardData = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Shifts"
          value={dashboardData.stats.totalShifts.toString()}
          icon={<Calendar className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Active Employees"
          value={dashboardData.stats.activeEmployees.toString()}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 5, isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Pending Approvals"
          value={dashboardData.stats.pendingApprovals.toString()}
          icon={<AlertCircle className="w-5 h-5" />}
          className="bg-white"
        />
        <StatCard
          title="Revenue This Month"
          value={`£${dashboardData.stats.revenueThisMonth.toLocaleString()}`}
          icon={<PoundSterling className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Shift Fill Rate"
          value={`${dashboardData.stats.shiftFillRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 3, isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Upcoming Shifts"
          value={dashboardData.stats.upcomingShifts.toString()}
          icon={<Clock className="w-5 h-5" />}
          className="bg-white"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shifts - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Shifts
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Latest shift activity and status
              </p>
            </div>
            <div className="p-6">
              <RecentShifts shifts={dashboardData.recentShifts} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Pending Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Timesheets Pending
                      </p>
                      <p className="text-xs text-yellow-600">
                        7 require approval
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
                    Review
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Shift Offers
                      </p>
                      <p className="text-xs text-blue-600">
                        3 pending responses
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                    View
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        New Applicants
                      </p>
                      <p className="text-xs text-green-600">5 to review</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Shift Completion
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    98%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '98%' }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On-time Arrival</span>
                  <span className="text-sm font-semibold text-blue-600">
                    95%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: '95%' }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Client Satisfaction
                  </span>
                  <span className="text-sm font-semibold text-purple-600">
                    4.8/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: '96%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
