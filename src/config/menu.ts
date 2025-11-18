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
  UserCog,
  CalendarDays,
  Banknote,
  Receipt,
  Workflow,
  MapPin,
  Target,
  Zap,
  Search,
  FileCheck,
  ClipboardList,
} from 'lucide-react';

export interface MenuItem {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
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
      description:
        'Platform overview with key metrics and system health monitoring',
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      label: 'Calendar',
      description:
        'Manage platform-wide schedules, events, and resource allocation',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'Platform Management',
      description:
        'Manage agencies, employers, users, and system configuration',
      icon: Settings,
      children: [
        {
          label: 'Agencies',
          description: 'View and manage all staffing agencies on the platform',
          icon: Building,
          path: '/admin/agencies',
          permission: 'agency:view',
        },
        {
          label: 'Employers',
          description: 'Manage employer accounts and company information',
          icon: Briefcase,
          path: '/admin/employers',
          permission: 'employer:view',
        },
        {
          label: 'Users & Roles',
          description:
            'Manage user accounts, permissions, and role assignments',
          icon: Users,
          path: '/admin/users',
          permission: 'user:manage',
        },
        {
          label: 'System Configuration',
          description: 'Configure platform settings and global preferences',
          icon: Settings,
          path: '/admin/system-config',
          permission: 'system:configure',
        },
      ],
    },
    {
      label: 'Financial Oversight',
      description:
        'Monitor revenue, payments, commissions, and financial operations',
      icon: PoundSterling,
      children: [
        {
          label: 'Revenue Dashboard',
          description:
            'Track platform revenue, growth metrics, and financial performance',
          icon: BarChart3,
          path: '/admin/revenue',
          permission: 'revenue:view',
        },
        {
          label: 'Platform Invoices',
          description: 'View and manage all platform-generated invoices',
          icon: Receipt,
          path: '/admin/platform-invoices',
          permission: 'invoice:view',
        },
        {
          label: 'Payment Reconciliation',
          description: 'Reconcile payments and track transaction status',
          icon: Banknote,
          path: '/admin/payments',
          permission: 'payment:view',
        },
        {
          label: 'Commission Tracking',
          description: 'Monitor commission calculations and payments',
          icon: PoundSterling,
          path: '/admin/commissions',
          permission: 'commission:view',
        },
      ],
    },
    {
      label: 'Operations',
      description:
        'Manage shifts, timesheets, assignments, and operational workflows',
      icon: Workflow,
      children: [
        {
          label: 'All Shifts',
          description: 'View and manage all shifts across the platform',
          icon: Calendar,
          path: '/admin/shifts',
          permission: 'shift:view',
        },
        {
          label: 'Timesheets',
          description: 'Monitor timesheet submissions and approval status',
          icon: Clock,
          path: '/admin/timesheets',
          permission: 'timesheet:view',
        },
        {
          label: 'Assignments',
          description: 'Track employee assignments and placement status',
          icon: Link,
          path: '/admin/assignments',
          permission: 'assignment:view',
        },
      ],
    },
    {
      label: 'Compliance & Audit',
      description:
        'Monitor system compliance, audit logs, and performance metrics',
      icon: Shield,
      children: [
        {
          label: 'Audit Logs',
          description: 'Review system activity and security audit trails',
          icon: Shield,
          path: '/admin/audit-logs',
          permission: 'audit:view',
        },
        {
          label: 'Compliance Reports',
          description: 'Generate and review compliance documentation',
          icon: FileText,
          path: '/admin/compliance',
          permission: 'compliance:view',
        },
        {
          label: 'System Health',
          description: 'Monitor platform performance and system status',
          icon: Zap,
          path: '/admin/health',
          permission: 'system:health',
        },
      ],
    },
  ],

  agency_admin: [
    {
      label: 'Dashboard',
      description: 'Agency overview with performance metrics and quick actions',
      icon: LayoutDashboard,
      path: '/agency',
    },
    {
      label: 'Calendar',
      description:
        'Manage agency schedules, shift assignments, and resource planning',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'Shift Requests',
      description: 'Find and respond to employer shift requests',
      icon: Search,
      children: [
        {
          label: 'Available Requests',
          description:
            'Browse and respond to open shift requests from employers',
          icon: ClipboardList,
          path: '/agency/shift-requests',
          permission: 'shift_request:view',
        },
        {
          label: 'My Responses',
          description: 'Track your shift request responses and status',
          icon: FileCheck,
          path: '/agency/request-responses',
          permission: 'agency_response:view',
        },
        {
          label: 'Quick Match',
          description: 'Find suitable shifts based on your workforce',
          icon: Zap,
          path: '/agency/quick-match',
          permission: 'shift_request:match',
        },
      ],
    },
    {
      label: 'Staff Management',
      description: 'Manage employees, agents, and team performance',
      icon: Users,
      children: [
        {
          label: 'Employees',
          description: 'Manage your employee roster and profiles',
          icon: Users,
          path: '/agency/employees',
          permission: 'employee:manage',
        },
        {
          label: 'Agents',
          description: 'Manage agency staff and their responsibilities',
          icon: UserCog,
          path: '/agency/agents',
          permission: 'agent:manage',
        },
        {
          label: 'Performance',
          description: 'Track employee performance metrics and reviews',
          icon: Target,
          path: '/agency/performance',
          permission: 'performance:view',
        },
      ],
    },
    {
      label: 'Shift Operations',
      description: 'Create, manage, and schedule shifts for your workforce',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          description: 'View and manage all scheduled shifts',
          icon: Calendar,
          path: '/agency/shifts',
          permission: 'shift:view',
        },
        {
          label: 'Shift Calendar',
          description: 'Visual shift scheduling and calendar view',
          icon: CalendarDays,
          path: '/agency/shift-calendar',
          permission: 'shift:view',
        },
        {
          label: 'Shift Offers',
          description: 'Manage shift offers to employees',
          icon: Workflow,
          path: '/agency/shift-offers',
          permission: 'shift_offer:manage',
        },
      ],
    },
    {
      label: 'Assignments',
      description: 'Manage active employee assignments to employers',
      icon: Link,
      children: [
        {
          label: 'Active Assignments',
          description: 'View and manage current employee assignments',
          icon: Link,
          path: '/agency/assignments',
          permission: 'assignment:manage',
        },
        {
          label: 'Assignment History',
          description: 'Track completed and past assignments',
          icon: FileText,
          path: '/agency/assignments/history',
          permission: 'assignment:view',
        },
      ],
    },
    {
      label: 'Workforce Planning',
      description: 'Plan workforce availability, time off, and capacity',
      icon: Users,
      children: [
        {
          label: 'Availability',
          description: 'View and manage employee availability schedules',
          icon: CalendarDays,
          path: '/agency/availability',
          permission: 'availability:view',
        },
        {
          label: 'Time Off Requests',
          description: 'Review and approve employee time off requests',
          icon: Clock,
          path: '/agency/time-off-requests',
          permission: 'time_off:approve',
        },
      ],
    },
    {
      label: 'Timesheets & Approval',
      description: 'Manage timesheet approval and attendance tracking',
      icon: Clock,
      children: [
        {
          label: 'Pending Approval',
          description: 'Review and approve pending timesheet submissions',
          icon: Clock,
          path: '/agency/timesheets',
          permission: 'timesheet:approve',
        },
        {
          label: 'Approval History',
          description: 'View historical timesheet approvals and records',
          icon: FileText,
          path: '/agency/timesheets/history',
          permission: 'timesheet:view',
        },
      ],
    },
    {
      label: 'Financial Operations',
      description: 'Manage invoices, payroll, revenue, and financial reporting',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          description: 'Create and manage client invoices and billing',
          icon: Receipt,
          path: '/agency/invoices',
          permission: 'invoice:manage',
        },
        {
          label: 'Payroll Processing',
          description: 'Process employee payroll and payments',
          icon: PoundSterling,
          path: '/agency/payroll',
          permission: 'payroll:process',
        },
        {
          label: 'Revenue Reports',
          description: 'View revenue analytics and financial reports',
          icon: BarChart3,
          path: '/agency/revenue',
          permission: 'revenue:view',
        },
      ],
    },
    {
      label: 'Agency Settings',
      description:
        'Configure agency profile, billing, and integration settings',
      icon: Settings,
      children: [
        {
          label: 'Profile & Branding',
          description: 'Manage agency profile and branding settings',
          icon: Building,
          path: '/agency/profile',
          permission: 'agency:configure',
        },
        {
          label: 'Billing & Subscription',
          description: 'Manage billing information and subscription plans',
          icon: Receipt,
          path: '/agency/billing',
          permission: 'billing:manage',
        },
      ],
    },
  ],

  agent: [
    {
      label: 'Dashboard',
      description: 'Agent overview with assigned tasks and performance metrics',
      icon: LayoutDashboard,
      path: '/agency',
    },
    {
      label: 'Calendar',
      description:
        'View and manage shift schedules, assignments, and availability',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'Shift Requests',
      description: 'Find and manage shift requests from employers',
      icon: Search,
      children: [
        {
          label: 'Available Requests',
          description: 'Browse available shift requests from employers',
          icon: ClipboardList,
          path: '/agency/shift-requests',
          permission: 'shift_request:view',
        },
        {
          label: 'My Responses',
          description: 'Track your shift request responses',
          icon: FileCheck,
          path: '/agency/request-responses',
          permission: 'agency_response:view',
        },
      ],
    },
    {
      label: 'Shift Management',
      description: 'Manage shifts, offers, and employee assignments',
      icon: Calendar,
      children: [
        {
          label: 'Available Shifts',
          description: 'View and assign available shifts to employees',
          icon: Calendar,
          path: '/agency/shifts',
          permission: 'shift:view',
        },
        {
          label: 'Shift Calendar',
          description: 'View shift schedules and assignments',
          icon: CalendarDays,
          path: '/agency/calendar',
          permission: 'shift:view',
        },
      ],
    },
    {
      label: 'Employee Management',
      description: 'Manage your assigned employees and their availability',
      icon: Users,
      children: [
        {
          label: 'My Employees',
          description: 'Manage your assigned employee roster',
          icon: Users,
          path: '/agency/employees',
          permission: 'employee:view',
        },
        {
          label: 'Availability',
          description: 'View and manage employee availability schedules',
          icon: CalendarDays,
          path: '/agency/availability',
          permission: 'availability:view',
        },
      ],
    },
    {
      label: 'Assignments',
      description: 'Manage employee assignments to employers',
      icon: Link,
      children: [
        {
          label: 'Active Assignments',
          description: 'View and manage current assignments',
          icon: Link,
          path: '/agency/assignments',
          permission: 'assignment:view',
        },
      ],
    },
    {
      label: 'Timesheets',
      description: 'Review and manage timesheet submissions',
      icon: Clock,
      children: [
        {
          label: 'Pending Approval',
          description: 'Review and process timesheet submissions',
          icon: Clock,
          path: '/agency/timesheets',
          permission: 'timesheet:approve',
        },
      ],
    },
  ],

  employer_admin: [
    {
      label: 'Dashboard',
      description: 'Employer overview with staffing metrics and quick actions',
      icon: LayoutDashboard,
      path: '/employer',
    },
    {
      label: 'Calendar',
      description:
        'Manage company schedules, shift planning, and resource allocation',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'Shift Requests',
      description: 'Create and manage staffing requests',
      icon: ClipboardList,
      children: [
        {
          label: 'Create Request',
          description: 'Create new shift requests for staffing needs',
          icon: Calendar,
          path: '/employer/shift-requests/create',
          permission: 'shift_request:create',
        },
        {
          label: 'My Requests',
          description: 'Manage your existing shift requests',
          icon: ClipboardList,
          path: '/employer/shift-requests',
          permission: 'shift_request:view',
        },
        {
          label: 'Agency Responses',
          description: 'Review agency responses to your requests',
          icon: FileCheck,
          path: '/employer/request-responses',
          permission: 'agency_response:view',
        },
      ],
    },
    {
      label: 'Shift Management',
      description: 'Manage shifts, schedules, and bulk operations',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          description: 'View and manage all scheduled shifts',
          icon: Calendar,
          path: '/employer/shifts',
          permission: 'shift:view',
        },
        {
          label: 'Shift Calendar',
          description: 'Visual shift scheduling and calendar management',
          icon: CalendarDays,
          path: '/employer/calendar',
          permission: 'shift:view',
        },
      ],
    },
    {
      label: 'Assignments',
      description: 'Manage agency employee assignments',
      icon: Link,
      children: [
        {
          label: 'Active Assignments',
          description: 'View current agency employee assignments',
          icon: Link,
          path: '/employer/assignments',
          permission: 'assignment:view',
        },
      ],
    },
    {
      label: 'Team & Locations',
      description:
        'Manage contacts, locations, departments, and staff assignments',
      icon: Users,
      children: [
        {
          label: 'Contacts & Approvers',
          description: 'Manage team contacts and approval workflows',
          icon: Users,
          path: '/employer/contacts',
          permission: 'contact:manage',
        },
        {
          label: 'Locations',
          description: 'Manage work locations and site information',
          icon: MapPin,
          path: '/employer/locations',
          permission: 'location:manage',
        },
      ],
    },
    {
      label: 'Timesheets & Approval',
      description: 'Approve timesheets and manage digital sign-off processes',
      icon: Clock,
      children: [
        {
          label: 'Pending Approval',
          description: 'Review and approve pending timesheet submissions',
          icon: Clock,
          path: '/employer/timesheets',
          permission: 'timesheet:approve',
        },
      ],
    },
    {
      label: 'Financial Management',
      description:
        'Manage invoices, payments, budgets, and financial analytics',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          description: 'View and manage agency invoices and billing',
          icon: Receipt,
          path: '/employer/invoices',
          permission: 'invoice:view',
        },
        {
          label: 'Spend Analysis',
          description: 'Analyze staffing costs and spending patterns',
          icon: BarChart3,
          path: '/employer/analytics',
          permission: 'analytics:view',
        },
      ],
    },
  ],

  contact: [
    {
      label: 'Dashboard',
      description: "Contact overview with today's shifts and approval tasks",
      icon: LayoutDashboard,
      path: '/employer',
    },
    {
      label: 'Calendar',
      description:
        'View and manage daily schedules, shift assignments, and approvals',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'Shifts',
      description: "View and manage today's shifts and upcoming schedules",
      icon: Calendar,
      children: [
        {
          label: "Today's Shifts",
          description: 'View and manage shifts scheduled for today',
          icon: Calendar,
          path: '/employer/shifts/today',
          permission: 'shift:view',
        },
        {
          label: 'Shift Calendar',
          description: 'Visual calendar view of all shifts',
          icon: CalendarDays,
          path: '/employer/calendar',
          permission: 'shift:view',
        },
      ],
    },
    {
      label: 'Approval Center',
      description: 'Approve timesheets, shifts, and manage approval workflows',
      icon: Shield,
      children: [
        {
          label: 'Timesheet Approval',
          description: 'Review and approve employee timesheets',
          icon: Clock,
          path: '/employer/approvals/timesheets',
          permission: 'timesheet:approve',
        },
      ],
    },
    {
      label: 'Staff Management',
      description: 'Manage assigned staff and monitor attendance',
      icon: Users,
      children: [
        {
          label: 'Assigned Staff',
          description: 'View and manage staff assigned to your locations',
          icon: Users,
          path: '/employer/staff',
          permission: 'staff:view',
        },
      ],
    },
  ],

  employee: [
    {
      label: 'Dashboard',
      description: 'Personal overview with upcoming shifts and quick actions',
      icon: LayoutDashboard,
      path: '/employee',
    },
    {
      label: 'Calendar',
      description:
        'View personal schedule, shift assignments, and availability planning',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'My Shifts',
      description: 'Manage your shifts, offers, and schedule',
      icon: Calendar,
      children: [
        {
          label: 'Upcoming Shifts',
          description: 'View and manage your upcoming shifts',
          icon: Calendar,
          path: '/employee/shifts',
          permission: 'shift:view:own',
        },
        {
          label: 'Shift Offers',
          description: 'View and accept available shift offers',
          icon: Workflow,
          path: '/employee/shift-offers',
          permission: 'shift_offer:respond:own',
        },
        {
          label: 'Shift Calendar',
          description: 'Visual calendar of your shift schedule',
          icon: CalendarDays,
          path: '/employee/calendar',
          permission: 'shift:view:own',
        },
      ],
    },
    {
      label: 'My Assignments',
      description: 'View your current and past assignments',
      icon: Link,
      children: [
        {
          label: 'Current Assignments',
          description: 'View your active assignments with employers',
          icon: Link,
          path: '/employee/assignments',
          permission: 'assignment:view:own',
        },
        {
          label: 'Assignment History',
          description: 'View your completed assignments',
          icon: FileText,
          path: '/employee/assignments/history',
          permission: 'assignment:view:own',
        },
      ],
    },
    {
      label: 'Timesheets',
      description: 'Clock in/out and manage your timesheets',
      icon: Clock,
      children: [
        {
          label: 'Clock In/Out',
          description: 'Clock in and out for your shifts',
          icon: Clock,
          path: '/employee/timesheets/clock',
          permission: 'timesheet:create:own',
        },
        {
          label: 'My Timesheets',
          description: 'View and manage your timesheet submissions',
          icon: FileText,
          path: '/employee/timesheets',
          permission: 'timesheet:view:own',
        },
      ],
    },
    {
      label: 'Availability',
      description: 'Set your availability and time off preferences',
      icon: CalendarDays,
      children: [
        {
          label: 'Set Availability',
          description: 'Set your available working hours and days',
          icon: CalendarDays,
          path: '/employee/availability',
          permission: 'availability:manage:own',
        },
        {
          label: 'Time Off Requests',
          description: 'Request time off and view approval status',
          icon: Clock,
          path: '/employee/time-off',
          permission: 'time_off:request',
        },
      ],
    },
    {
      label: 'Profile & Settings',
      description: 'Manage your profile, documents, and notification settings',
      icon: Settings,
      children: [
        {
          label: 'My Profile',
          description: 'Update your personal profile information',
          icon: UserCog,
          path: '/employee/profile',
          permission: 'profile:manage',
        },
      ],
    },
  ],
};

const rolePermissions: Record<string, string[]> = {
  super_admin: ['*'],
  agency_admin: [
    'employee:*',
    'agent:*',
    'shift_request:*',
    'shift:*',
    'assignment:*',
    'timesheet:*',
    'invoice:view,create',
    'payroll:create,view',
    'availability:view,manage',
    'time_off:approve',
    'agency:configure',
    'billing:manage',
    'revenue:view',
    'performance:view',
    'agency_response:view',
    'shift_request:match',
    'shift_offer:manage',
  ],
  agent: [
    'employee:view,manage',
    'shift_request:create,view',
    'shift:create,view,update',
    'assignment:view,create,update',
    'timesheet:view,approve',
    'invoice:view,create',
    'availability:view,manage',
    'time_off:approve',
    'performance:view',
    'agency_response:view',
  ],
  employer_admin: [
    'shift_request:*',
    'shift:create,view,update',
    'assignment:view',
    'contact:manage',
    'timesheet:approve,view',
    'invoice:view,create,pay',
    'location:manage',
    'analytics:view',
    'agency_response:view',
  ],
  contact: ['timesheet:approve', 'shift:view', 'staff:view'],
  employee: [
    'shift:view:own',
    'assignment:view:own',
    'timesheet:create:own,view:own',
    'availability:manage:own',
    'time_off:request',
    'profile:manage',
    'shift_offer:respond:own',
  ],
};

export const getMenuForRole = (role: string): MenuItem[] => {
  return menuConfig[role] || [];
};

export const hasMenuAccess = (
  userRole: string,
  requiredPermission?: string
): boolean => {
  if (!requiredPermission) return true;

  const permissions = rolePermissions[userRole] || [];

  if (permissions.includes('*')) return true;

  return permissions.some((permission: string) => {
    if (permission.includes(':')) {
      const [resource, actions] = permission.split(':');
      const requiredAction = requiredPermission.split(':')[1];
      return actions.split(',').includes(requiredAction);
    }
    return permission === requiredPermission;
  });
};

export const findMenuItemByPath = (path: string): MenuItem | null => {
  const allMenuItems = Object.values(menuConfig).flat();

  const findInItems = (items: MenuItem[]): MenuItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findInItems(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findInItems(allMenuItems);
};

export const getDefaultTitleForRole = (role: string): string => {
  const roleMenu = menuConfig[role];
  if (roleMenu && roleMenu.length > 0) {
    return roleMenu[0].label;
  }
  return 'Dashboard';
};

export const getDescriptionByPath = (path: string): string => {
  const menuItem = findMenuItemByPath(path);
  return (
    menuItem?.description ||
    'Manage your operations and view important information'
  );
};

export const getDefaultDescriptionForRole = (role: string): string => {
  const roleMenu = menuConfig[role];
  if (roleMenu && roleMenu.length > 0) {
    return (
      roleMenu[0].description ||
      'Overview of your key metrics and recent activity'
    );
  }
  return 'Overview of your key metrics and recent activity';
};

export default menuConfig;
