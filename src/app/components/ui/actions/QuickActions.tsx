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
      label: 'Browse Placements',
      icon: <Icon name="search" className="w-4 h-4" />,
      href: '/agency/placements',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Create Shift',
      icon: <Icon name="plus" className="w-4 h-4" />,
      href: '/agency/shifts/create',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Add Employee',
      icon: <Icon name="user" className="w-4 h-4" />,
      href: '/agency/employees/create',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Timesheets',
      icon: <Icon name="fileText" className="w-4 h-4" />,
      href: '/agency/timesheets',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'My Responses',
      icon: <Icon name="fileCheck" className="w-4 h-4" />,
      href: '/agency/placement-responses',
      permissions: ['agency_admin', 'agent'],
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
