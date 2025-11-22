'use client';

import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/app/components/ui';

interface QuickActionsProps {
  userRole: string;
}

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  buttonVariant?: string;
  permissions: string[];
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const router = useRouter();

  const actions: ActionItem[] = [
    {
      label: 'Browse Shift Requests',
      icon: <Icon name="search" className="w-4 h-4" />,
      href: '/agency/shift-requests',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Quick Match',
      icon: <Icon name="zap" className="w-4 h-4" />,
      href: '/agency/quick-match',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Register Employee',
      icon: <Icon name="userPlus" className="w-4 h-4" />,
      href: '/agency/agency-employees/register',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Create Shift',
      icon: <Icon name="calendar" className="w-4 h-4" />,
      href: '/agency/shifts/create',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Pending Timesheets',
      icon: <Icon name="fileText" className="w-4 h-4" />,
      href: '/agency/timesheets/pending',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'My Responses',
      icon: <Icon name="fileCheck" className="w-4 h-4" />,
      href: '/agency/agency-responses',
      permissions: ['agency_admin', 'agent'],
    },

    {
      label: 'Create Shift Request',
      icon: <Icon name="plus" className="w-4 h-4" />,
      href: '/employer/shift-requests/create',
      permissions: ['employer_admin'],
    },
    {
      label: 'Review Responses',
      icon: <Icon name="fileCheck" className="w-4 h-4" />,
      href: '/employer/request-responses',
      permissions: ['employer_admin'],
    },
    {
      label: 'Pending Timesheets',
      icon: <Icon name="fileText" className="w-4 h-4" />,
      href: '/employer/timesheets/pending',
      permissions: ['employer_admin'],
    },
    {
      label: 'Pay Invoices',
      icon: <Icon name="creditCard" className="w-4 h-4" />,
      href: '/employer/invoices/pay',
      permissions: ['employer_admin'],
    },
    {
      label: 'Add Contact',
      icon: <Icon name="userPlus" className="w-4 h-4" />,
      href: '/employer/contacts/create',
      permissions: ['employer_admin'],
    },

    {
      label: "Today's Shifts",
      icon: <Icon name="calendar" className="w-4 h-4" />,
      href: '/employer/shifts/today',
      permissions: ['contact'],
    },
    {
      label: 'Approve Timesheets',
      icon: <Icon name="checkSquare" className="w-4 h-4" />,
      href: '/employer/approvals/timesheets',
      permissions: ['contact'],
    },
    {
      label: 'Shift Approval',
      icon: <Icon name="shield" className="w-4 h-4" />,
      href: '/employer/shifts/approval',
      permissions: ['contact'],
    },

    {
      label: 'Clock In/Out',
      icon: <Icon name="clock" className="w-4 h-4" />,
      href: '/employee/timesheets/clock',
      permissions: ['employee'],
    },
    {
      label: 'My Shifts',
      icon: <Icon name="calendar" className="w-4 h-4" />,
      href: '/employee/shifts',
      permissions: ['employee'],
    },
    {
      label: 'Shift Offers',
      icon: <Icon name="workflow" className="w-4 h-4" />,
      href: '/employee/shift-offers',
      permissions: ['employee'],
    },
    {
      label: 'Set Availability',
      icon: <Icon name="calendarDay" className="w-4 h-4" />,
      href: '/employee/availability',
      permissions: ['employee'],
    },
    {
      label: 'Request Time Off',
      icon: <Icon name="clock" className="w-4 h-4" />,
      href: '/employee/time-off',
      permissions: ['employee'],
    },

    {
      label: 'Agency Management',
      icon: <Icon name="building" className="w-4 h-4" />,
      href: '/admin/agencies',
      permissions: ['super_admin'],
    },
    {
      label: 'Employer Management',
      icon: <Icon name="briefcase" className="w-4 h-4" />,
      href: '/admin/employers',
      permissions: ['super_admin'],
    },
    {
      label: 'User Management',
      icon: <Icon name="users" className="w-4 h-4" />,
      href: '/admin/users',
      permissions: ['super_admin'],
    },
    {
      label: 'System Settings',
      icon: <Icon name="settings" className="w-4 h-4" />,
      href: '/admin/system-config',
      permissions: ['super_admin'],
    },
    {
      label: 'Revenue Dashboard',
      icon: <Icon name="barChart3" className="w-4 h-4" />,
      href: '/admin/revenue',
      permissions: ['super_admin'],
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.permissions.includes(userRole)
  );

  const handleActionClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
      {filteredActions.map((action) => (
        <Button
          variant="primary"
          key={action.label}
          onClick={() => handleActionClick(action.href)}
        >
          {action.icon}
          <span className="whitespace-nowrap">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
