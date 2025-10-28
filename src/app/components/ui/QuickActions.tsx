'use client';

import { Plus, Calendar, Users, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/app/components/ui';

interface QuickActionsProps {
  userRole: string;
}

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  permissions: string[];
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const router = useRouter();

  const actions: ActionItem[] = [
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
      label: 'Schedule',
      icon: <Icon name="calendar" className="w-4 h-4" />,
      href: '/agency/shifts',
      permissions: ['agency_admin', 'agent'],
    },
    {
      label: 'Timesheets',
      icon: <Icon name="fileText" className="w-4 h-4" />,
      href: '/agency/timesheets',
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
    <div className="flex flex-wrap gap-2">
      {filteredActions.map((action) => (
        <Button
          key={action.label}
          onClick={() => handleActionClick(action.href)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {action.icon}
          <span className="ml-2">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
