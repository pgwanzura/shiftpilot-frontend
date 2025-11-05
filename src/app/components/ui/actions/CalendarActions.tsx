'use client';

import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/app/components/ui';

interface CalendarActionsProps {
  userRole: string;
  currentView: 'month' | 'week' | 'day';
  onNewShiftClick: () => void;
  onNewPlacementClick?: () => void;
  onManageAvailabilityClick?: () => void;
  onTimeOffRequestClick?: () => void;
  selectedDate?: Date | null;
}

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary-outline' | 'primary-outline' | 'ghost';
  permissions: string[];
  isActive?: boolean;
  group?: 'scheduling' | 'management' | 'export' | 'view' | 'availability';
}

export function CalendarActions({
  userRole,
  onNewShiftClick,
  onNewPlacementClick,
  onManageAvailabilityClick,
  onTimeOffRequestClick,
  selectedDate,
}: CalendarActionsProps) {
  const router = useRouter();

  const actions: ActionItem[] = [
    // SCHEDULING ACTIONS
    {
      label: 'New Shift',
      icon: <Icon name="plus" className="w-4 h-4" />,
      onClick: onNewShiftClick,
      variant: 'primary',
      permissions: ['super_admin', 'agency_admin', 'agent', 'employer_admin'],
      group: 'scheduling',
    },
    {
      label: 'New Placement',
      icon: <Icon name="briefcase" className="w-4 h-4" />,
      onClick: onNewPlacementClick || (() => router.push('/placements/create')),
      variant: 'primary',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'scheduling',
    },
    {
      label: 'Recurring Shift',
      icon: <Icon name="repeat" className="w-4 h-4" />,
      onClick: () => router.push('/shift-templates/create'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'scheduling',
    },
    {
      label: 'Bulk Create Shifts',
      icon: <Icon name="layers" className="w-4 h-4" />,
      onClick: () => router.push('/shifts/bulk-create'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'scheduling',
    },

    // AVAILABILITY & TIME OFF (Employee only + Admin management)
    {
      label: 'Set Availability',
      icon: <Icon name="calendar" className="w-4 h-4" />,
      onClick:
        onManageAvailabilityClick || (() => router.push('/availability')),
      variant: 'secondary-outline',
      permissions: ['employee'], // ONLY employees set their own availability
      group: 'availability',
    },
    {
      label: 'Request Time Off',
      icon: <Icon name="umbrella" className="w-4 h-4" />,
      onClick:
        onTimeOffRequestClick || (() => router.push('/time-off/request')),
      variant: 'secondary-outline',
      permissions: ['employee'], // ONLY employees request their own time off
      group: 'availability',
    },
    {
      label: 'Manage Time Off',
      icon: <Icon name="users" className="w-4 h-4" />,
      onClick: () => router.push('/time-off'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin'], // Admins manage employee time off requests
      group: 'management',
    },

    // MANAGEMENT ACTIONS
    {
      label: 'Assign Shifts',
      icon: <Icon name="userCheck" className="w-4 h-4" />,
      onClick: () => router.push('/shifts/assign'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin', 'agent'],
      group: 'management',
    },
    {
      label: 'Approve Timesheets',
      icon: <Icon name="checkCircle" className="w-4 h-4" />,
      onClick: () => router.push('/timesheets/pending'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin', 'employer_admin', 'contact'],
      group: 'management',
    },
    {
      label: 'Manage Rate Cards',
      icon: <Icon name="dollarSign" className="w-4 h-4" />,
      onClick: () => router.push('/rate-cards'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'management',
    },
    {
      label: 'Employee Matching',
      icon: <Icon name="users" className="w-4 h-4" />,
      onClick: () => router.push('/matching'),
      variant: 'secondary-outline',
      permissions: ['super_admin', 'agency_admin', 'agent'],
      group: 'management',
    },

    // EXPORT & REPORTING
    {
      label: 'Export Schedule',
      icon: <Icon name="download" className="w-4 h-4" />,
      onClick: () => {
        const date = selectedDate || new Date();
        const filename = `schedule-${date.toISOString().split('T')[0]}.csv`;
        console.log('Exporting schedule as:', filename);
        // Implement export functionality
      },
      variant: 'primary-outline',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'export',
    },
    {
      label: 'Print View',
      icon: <Icon name="printer" className="w-4 h-4" />,
      onClick: () => window.print(),
      variant: 'primary-outline',
      permissions: [
        'super_admin',
        'agency_admin',
        'agent',
        'employer_admin',
        'contact',
        'employee',
      ],
      group: 'export',
    },
    {
      label: 'Generate Report',
      icon: <Icon name="barChart" className="w-4 h-4" />,
      onClick: () => router.push('/reports/scheduling'),
      variant: 'primary-outline',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'export',
    },

    // SYSTEM ACTIONS (Admin only)
    {
      label: 'Calendar Settings',
      icon: <Icon name="settings" className="w-4 h-4" />,
      onClick: () => router.push('/settings/calendar'),
      variant: 'ghost',
      permissions: ['super_admin'],
      group: 'management',
    },
    {
      label: 'Sync External',
      icon: <Icon name="refreshCw" className="w-4 h-4" />,
      onClick: () => {
        console.log('Syncing with external calendars');
        // Implement calendar sync
      },
      variant: 'ghost',
      permissions: ['super_admin', 'agency_admin', 'employer_admin'],
      group: 'management',
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.permissions.includes(userRole)
  );

  // Group actions by category for better organization
  const groupedActions = filteredActions.reduce(
    (groups, action) => {
      const group = action.group || 'other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(action);
      return groups;
    },
    {} as Record<string, ActionItem[]>
  );

  const getButtonVariant = (
    variant?: string
  ): 'primary' | 'secondary-outline' | 'primary-outline' | 'ghost' => {
    const variantMap = {
      primary: 'primary',
      secondary: 'secondary-outline',
      'primary-outline': 'primary-outline',
      ghost: 'ghost',
    } as const;

    return variantMap[variant as keyof typeof variantMap] ?? 'primary-outline';
  };

  return (
    <div className="space-y-4">
      {groupedActions.view && (
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {groupedActions.view.map((action) => (
            <Button
              key={action.label}
              variant={getButtonVariant(action.variant)}
              onClick={action.onClick}
              size="sm"
              className={`
                flex items-center space-x-2 whitespace-nowrap
                ${action.isActive ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : ''}
              `}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Quick Actions - Primary scheduling actions */}
      {groupedActions.scheduling && (
        <div className="flex flex-wrap gap-2">
          {groupedActions.scheduling?.map((action) => (
            <Button
              key={action.label}
              variant={getButtonVariant(action.variant)}
              onClick={action.onClick}
              size="sm"
              className={`
                flex items-center space-x-2 whitespace-nowrap
                ${action.isActive ? 'bg-blue-500 text-white border-blue-500' : ''}
                ${action.variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
              `}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Availability Actions (Employee only) */}
      {groupedActions.availability && (
        <div className="flex flex-wrap gap-2">
          {groupedActions.availability?.map((action) => (
            <Button
              key={action.label}
              variant={getButtonVariant(action.variant)}
              onClick={action.onClick}
              size="sm"
              className={`
                flex items-center space-x-2 whitespace-nowrap
                ${action.isActive ? 'bg-blue-500 text-white border-blue-500' : ''}
              `}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Management & Export Actions */}
      <div className="flex flex-wrap gap-2">
        {groupedActions.management?.map((action) => (
          <Button
            key={action.label}
            variant={getButtonVariant(action.variant)}
            onClick={action.onClick}
            size="sm"
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}

        {groupedActions.export?.map((action) => (
          <Button
            key={action.label}
            variant={getButtonVariant(action.variant)}
            onClick={action.onClick}
            size="sm"
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
