import {
  LayoutDashboard,
  Users,
  Building,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  PoundSterling,
  Settings,
  BarChart3,
  Shield,
  Link,
  Bell,
  UserCog,
  CalendarDays,
  Banknote,
  Receipt,
  Workflow,
} from 'lucide-react';

export interface MenuItem {
  label: string;
  icon: any;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  permission?: string;
}

export interface MenuConfig {
  [role: string]: MenuItem[];
}

export const menuConfig: MenuConfig = {
  super_admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Agencies',
      icon: Building,
      path: '/agencies',
    },
    {
      label: 'Employers',
      icon: Briefcase,
      path: '/employers',
    },
    {
      label: 'Users',
      icon: Users,
      children: [
        {
          label: 'All Users',
          icon: Users,
          path: '/users',
        },
        {
          label: 'Agents',
          icon: UserCog,
          path: '/agents',
        },
        {
          label: 'Contacts',
          icon: Users,
          path: '/contacts',
        },
      ],
    },
    {
      label: 'Shifts',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          icon: Calendar,
          path: '/shifts',
        },
        {
          label: 'Shift Templates',
          icon: CalendarDays,
          path: '/shift-templates',
        },
        {
          label: 'Shift Offers',
          icon: Workflow,
          path: '/shift-offers',
        },
      ],
    },
    {
      label: 'Timesheets',
      icon: Clock,
      path: '/timesheets',
    },
    {
      label: 'Financial',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          icon: Receipt,
          path: '/invoices',
        },
        {
          label: 'Payments',
          icon: Banknote,
          path: '/payments',
        },
        {
          label: 'Payroll',
          icon: PoundSterling,
          path: '/payroll',
        },
        {
          label: 'Payouts',
          icon: Banknote,
          path: '/payouts',
        },
        {
          label: 'Subscriptions',
          icon: Receipt,
          path: '/subscriptions',
        },
      ],
    },
    {
      label: 'Workforce',
      icon: Users,
      children: [
        {
          label: 'Employees',
          icon: Users,
          path: '/employees',
        },
        {
          label: 'Availability',
          icon: CalendarDays,
          path: '/availability',
        },
        {
          label: 'Time Off',
          icon: Clock,
          path: '/time-off',
        },
        {
          label: 'Placements',
          icon: Link,
          path: '/placements',
        },
      ],
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
    },
    {
      label: 'System',
      icon: Settings,
      children: [
        {
          label: 'Audit Logs',
          icon: Shield,
          path: '/audit-logs',
        },
        {
          label: 'Webhooks',
          icon: Link,
          path: '/webhooks',
        },
        {
          label: 'Notifications',
          icon: Bell,
          path: '/notifications',
        },
        {
          label: 'Platform Settings',
          icon: Settings,
          path: '/platform-settings',
        },
      ],
    },
  ],

  agency_admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'My Agency',
      icon: Building,
      path: '/agency',
    },
    {
      label: 'Team',
      icon: Users,
      children: [
        {
          label: 'Agents',
          icon: UserCog,
          path: '/agents',
        },
        {
          label: 'Employees',
          icon: Users,
          path: '/employees',
        },
      ],
    },
    {
      label: 'Shifts',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          icon: Calendar,
          path: '/shifts',
        },
        {
          label: 'Shift Offers',
          icon: Workflow,
          path: '/shift-offers',
        },
        {
          label: 'Shift Approval',
          icon: Shield,
          path: '/shift-approvals',
        },
      ],
    },
    {
      label: 'Workforce',
      icon: Users,
      children: [
        {
          label: 'Placements',
          icon: Link,
          path: '/placements',
        },
        {
          label: 'Availability',
          icon: CalendarDays,
          path: '/availability',
        },
        {
          label: 'Time Off Requests',
          icon: Clock,
          path: '/time-off-requests',
        },
      ],
    },
    {
      label: 'Timesheets',
      icon: Clock,
      path: '/timesheets',
    },
    {
      label: 'Financial',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          icon: Receipt,
          path: '/invoices',
        },
        {
          label: 'Payroll',
          icon: PoundSterling,
          path: '/payroll',
        },
        {
          label: 'Payouts',
          icon: Banknote,
          path: '/payouts',
        },
      ],
    },
    {
      label: 'Clients',
      icon: Briefcase,
      children: [
        {
          label: 'Employers',
          icon: Briefcase,
          path: '/employers',
        },
        {
          label: 'Contracts',
          icon: Link,
          path: '/contracts',
        },
      ],
    },
    {
      label: 'Settings',
      icon: Settings,
      children: [
        {
          label: 'Webhooks',
          icon: Link,
          path: '/webhooks',
        },
        {
          label: 'Subscription',
          icon: Receipt,
          path: '/subscription',
        },
      ],
    },
  ],

  agent: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Shifts',
      icon: Calendar,
      children: [
        {
          label: 'Manage Shifts',
          icon: Calendar,
          path: '/shifts',
        },
        {
          label: 'Shift Offers',
          icon: Workflow,
          path: '/shift-offers',
        },
      ],
    },
    {
      label: 'Employees',
      icon: Users,
      path: '/employees',
    },
    {
      label: 'Placements',
      icon: Link,
      path: '/placements',
    },
    {
      label: 'Timesheets',
      icon: Clock,
      path: '/timesheets',
    },
    {
      label: 'Availability',
      icon: CalendarDays,
      path: '/availability',
    },
    {
      label: 'Invoices',
      icon: Receipt,
      path: '/invoices',
    },
  ],

  employer_admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'My Company',
      icon: Building,
      path: '/employer',
    },
    {
      label: 'Shifts',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          icon: Calendar,
          path: '/shifts',
        },
        {
          label: 'Create Shift',
          icon: Calendar,
          path: '/shifts/create',
        },
        {
          label: 'Shift Templates',
          icon: CalendarDays,
          path: '/shift-templates',
        },
      ],
    },
    {
      label: 'Team',
      icon: Users,
      children: [
        {
          label: 'Contacts',
          icon: Users,
          path: '/contacts',
        },
        {
          label: 'Locations',
          icon: Building,
          path: '/locations',
        },
      ],
    },
    {
      label: 'Timesheets',
      icon: Clock,
      path: '/timesheets',
    },
    {
      label: 'Financial',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          icon: Receipt,
          path: '/invoices',
        },
        {
          label: 'Payments',
          icon: Banknote,
          path: '/payments',
        },
      ],
    },
    {
      label: 'Agencies',
      icon: Briefcase,
      path: '/agencies',
    },
    {
      label: 'Subscription',
      icon: Receipt,
      path: '/subscription',
    },
  ],

  contact: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Shifts',
      icon: Calendar,
      path: '/shifts',
    },
    {
      label: 'Timesheets',
      icon: Clock,
      path: '/timesheets',
    },
    {
      label: 'Approval Queue',
      icon: Shield,
      path: '/approvals',
    },
  ],

  system: [
    {
      label: 'System Dashboard',
      icon: LayoutDashboard,
      path: '/system',
    },
    {
      label: 'Process Queue',
      icon: Workflow,
      path: '/process-queue',
    },
    {
      label: 'Webhooks',
      icon: Link,
      path: '/webhooks',
    },
  ],
};

// Helper function to get menu for a specific role
export const getMenuForRole = (role: string): MenuItem[] => {
  return menuConfig[role] || [];
};

// Helper to check if user has access to a menu item
export const hasMenuAccess = (
  userRole: string,
  requiredPermission?: string
): boolean => {
  if (!requiredPermission) return true;

  // Implement permission checking logic based on your user_roles config
  const rolePermissions = {
    super_admin: ['*'],
    agency_admin: [
      'employee:*',
      'agent:*',
      'placement:*',
      'shift:*',
      'timesheet:*',
      'invoice:view,create',
      'payroll:create,view',
      'payout:view',
      'webhook:manage',
      'subscription:view',
      'availability:view,manage',
      'time_off:approve',
    ],
    agent: [
      'shift:create,view,update',
      'placement:create,view',
      'timesheet:view',
      'invoice:view',
      'availability:view',
      'employee:view',
    ],
    employer_admin: [
      'shift:create,view,update',
      'contact:manage',
      'timesheet:approve,view',
      'invoice:view,create,pay',
      'shift_template:manage',
    ],
    contact: ['timesheet:approve', 'shift:approve'],
    employee: [
      'shift:view:own',
      'timesheet:create:own',
      'timesheet:view:own',
      'availability:manage:own',
      'time_off:request',
    ],
    system: [
      'timesheet:create',
      'invoice:create',
      'payment:record',
      'subscription:manage',
      'shift:generate_from_template',
    ],
  };

  const permissions =
    rolePermissions[userRole as keyof typeof rolePermissions] || [];

  if (permissions.includes('*')) return true;

  return permissions.some((permission) => {
    if (permission.includes(':')) {
      const [resource, actions] = permission.split(':');
      const requiredAction = requiredPermission.split(':')[1];
      return actions.split(',').includes(requiredAction);
    }
    return permission === requiredPermission;
  });
};

export default menuConfig;
