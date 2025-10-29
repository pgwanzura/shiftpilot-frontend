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
  MapPin,
  Target,
  Star,
  Zap,
  HeartHandshake,
  BookOpen,
  Download,
  Upload,
  MessageSquare,
  HelpCircle,
  Search,
  TrendingUp,
  FileCheck,
  ClipboardList,
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
      path: '/admin',
    },
    {
      label: 'Platform Management',
      icon: Settings,
      children: [
        {
          label: 'Agencies',
          icon: Building,
          path: '/admin/agencies',
          badge: '12',
        },
        {
          label: 'Employers',
          icon: Briefcase,
          path: '/admin/employers',
          badge: '45',
        },
        {
          label: 'Users & Roles',
          icon: Users,
          path: '/admin/users',
        },
        {
          label: 'System Configuration',
          icon: Settings,
          path: '/admin/system-config',
        },
      ],
    },
    {
      label: 'Financial Oversight',
      icon: PoundSterling,
      children: [
        {
          label: 'Revenue Dashboard',
          icon: BarChart3,
          path: '/admin/revenue',
        },
        {
          label: 'Platform Invoices',
          icon: Receipt,
          path: '/admin/platform-invoices',
          badge: '23',
        },
        {
          label: 'Payment Reconciliation',
          icon: Banknote,
          path: '/admin/payments',
        },
        {
          label: 'Commission Tracking',
          icon: PoundSterling,
          path: '/admin/commissions',
        },
        {
          label: 'Tax Settings',
          icon: Receipt,
          path: '/admin/tax',
        },
      ],
    },
    {
      label: 'Operations',
      icon: Workflow,
      children: [
        {
          label: 'All Shifts',
          icon: Calendar,
          path: '/admin/shifts',
        },
        {
          label: 'Shift Templates',
          icon: CalendarDays,
          path: '/admin/shift-templates',
        },
        {
          label: 'Timesheets',
          icon: Clock,
          path: '/admin/timesheets',
          badge: '15',
        },
        {
          label: 'Placements',
          icon: Link,
          path: '/admin/placements',
        },
        {
          label: 'Rate Cards',
          icon: BookOpen,
          path: '/admin/rate-cards',
        },
      ],
    },
    {
      label: 'Workforce',
      icon: Users,
      children: [
        {
          label: 'All Employees',
          icon: Users,
          path: '/admin/employees',
        },
        {
          label: 'Agents',
          icon: UserCog,
          path: '/admin/agents',
        },
        {
          label: 'Contacts',
          icon: Users,
          path: '/admin/contacts',
        },
        {
          label: 'Availability Overview',
          icon: CalendarDays,
          path: '/admin/availability',
        },
        {
          label: 'Time Off Requests',
          icon: Clock,
          path: '/admin/time-off',
          badge: '8',
        },
      ],
    },
    {
      label: 'Compliance & Audit',
      icon: Shield,
      children: [
        {
          label: 'Audit Logs',
          icon: Shield,
          path: '/admin/audit-logs',
        },
        {
          label: 'Compliance Reports',
          icon: FileText,
          path: '/admin/compliance',
        },
        {
          label: 'System Health',
          icon: Zap,
          path: '/admin/health',
        },
        {
          label: 'Performance Metrics',
          icon: Target,
          path: '/admin/metrics',
        },
      ],
    },
    {
      label: 'Integrations',
      icon: Link,
      children: [
        {
          label: 'Webhooks',
          icon: Link,
          path: '/admin/webhooks',
        },
        {
          label: 'API Management',
          icon: Zap,
          path: '/admin/api',
        },
        {
          label: 'Payment Providers',
          icon: Banknote,
          path: '/admin/payment-providers',
        },
      ],
    },
  ],

  agency_admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/agency',
    },
    {
      label: 'Placement Opportunities',
      icon: Search,
      children: [
        {
          label: 'Available Placements',
          icon: ClipboardList,
          path: '/agency/placements',
          badge: '15',
        },
        {
          label: 'My Responses',
          icon: FileCheck,
          path: '/agency/placement-responses',
        },
        {
          label: 'Placement Calendar',
          icon: CalendarDays,
          path: '/agency/placement-calendar',
        },
        {
          label: 'Quick Match',
          icon: Zap,
          path: '/agency/quick-match',
        },
      ],
    },
    {
      label: 'Staff Management',
      icon: Users,
      children: [
        {
          label: 'Employees',
          icon: Users,
          path: '/agency/employees',
          badge: '89',
        },
        {
          label: 'Agents',
          icon: UserCog,
          path: '/agency/agents',
          badge: '5',
        },
        {
          label: 'Onboarding',
          icon: Upload,
          path: '/agency/onboarding',
        },
        {
          label: 'Qualifications',
          icon: Star,
          path: '/agency/qualifications',
        },
        {
          label: 'Performance',
          icon: Target,
          path: '/agency/performance',
        },
      ],
    },
    {
      label: 'Shift Operations',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          icon: Calendar,
          path: '/agency/shifts',
        },
        {
          label: 'Shift Calendar',
          icon: CalendarDays,
          path: '/agency/shift-calendar',
        },
        {
          label: 'Shift Offers',
          icon: Workflow,
          path: '/agency/shift-offers',
          badge: '12',
        },
        {
          label: 'Create Shift',
          icon: Calendar,
          path: '/agency/shifts/create',
        },
        {
          label: 'Auto Scheduling',
          icon: Zap,
          path: '/agency/auto-scheduling',
        },
      ],
    },
    {
      label: 'Workforce Planning',
      icon: Users,
      children: [
        {
          label: 'Availability',
          icon: CalendarDays,
          path: '/agency/availability',
        },
        {
          label: 'Time Off Requests',
          icon: Clock,
          path: '/agency/time-off-requests',
          badge: '7',
        },
        {
          label: 'Employee Preferences',
          icon: HeartHandshake,
          path: '/agency/preferences',
        },
        {
          label: 'Capacity Planning',
          icon: TrendingUp,
          path: '/agency/capacity',
        },
      ],
    },
    {
      label: 'Timesheets & Approval',
      icon: Clock,
      children: [
        {
          label: 'Pending Approval',
          icon: Clock,
          path: '/agency/timesheets',
          badge: '15',
        },
        {
          label: 'Approval History',
          icon: FileText,
          path: '/agency/timesheets/history',
        },
        {
          label: 'Clock In/Out Logs',
          icon: Clock,
          path: '/agency/attendance',
        },
      ],
    },
    {
      label: 'Client Management',
      icon: Briefcase,
      children: [
        {
          label: 'Employers',
          icon: Briefcase,
          path: '/agency/employers',
          badge: '23',
        },
        {
          label: 'Contracts',
          icon: FileText,
          path: '/agency/contracts',
        },
        {
          label: 'Service Level Monitoring',
          icon: Target,
          path: '/agency/service-levels',
        },
        {
          label: 'Client Communications',
          icon: MessageSquare,
          path: '/agency/client-comms',
        },
      ],
    },
    {
      label: 'Financial Operations',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          icon: Receipt,
          path: '/agency/invoices',
          badge: '8',
        },
        {
          label: 'Payroll Processing',
          icon: PoundSterling,
          path: '/agency/payroll',
        },
        {
          label: 'Payouts',
          icon: Banknote,
          path: '/agency/payouts',
        },
        {
          label: 'Revenue Reports',
          icon: BarChart3,
          path: '/agency/revenue',
        },
        {
          label: 'Commission Tracking',
          icon: PoundSterling,
          path: '/agency/commissions',
        },
        {
          label: 'Expense Management',
          icon: Receipt,
          path: '/agency/expenses',
        },
      ],
    },
    {
      label: 'Rate Management',
      icon: BookOpen,
      children: [
        {
          label: 'Rate Cards',
          icon: BookOpen,
          path: '/agency/rate-cards',
        },
        {
          label: 'Client Rates',
          icon: PoundSterling,
          path: '/agency/client-rates',
        },
        {
          label: 'Employee Pay Rates',
          icon: Banknote,
          path: '/agency/pay-rates',
        },
      ],
    },
    {
      label: 'Agency Settings',
      icon: Settings,
      children: [
        {
          label: 'Profile & Branding',
          icon: Building,
          path: '/agency/profile',
        },
        {
          label: 'Billing & Subscription',
          icon: Receipt,
          path: '/agency/billing',
        },
        {
          label: 'Integrations',
          icon: Link,
          path: '/agency/integrations',
        },
        {
          label: 'Webhooks',
          icon: Link,
          path: '/agency/webhooks',
        },
        {
          label: 'Document Templates',
          icon: FileText,
          path: '/agency/templates',
        },
      ],
    },
  ],

  agent: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/agency',
    },
    {
      label: 'Placement Opportunities',
      icon: Search,
      children: [
        {
          label: 'Available Placements',
          icon: ClipboardList,
          path: '/agency/placements',
          badge: '15',
        },
        {
          label: 'My Responses',
          icon: FileCheck,
          path: '/agency/placement-responses',
        },
        {
          label: 'Quick Match',
          icon: Zap,
          path: '/agency/quick-match',
        },
      ],
    },
    {
      label: 'Shift Management',
      icon: Calendar,
      children: [
        {
          label: 'Available Shifts',
          icon: Calendar,
          path: '/agency/shifts',
          badge: '18',
        },
        {
          label: 'Shift Offers',
          icon: Workflow,
          path: '/agency/shift-offers',
          badge: '12',
        },
        {
          label: 'Create Shift Offer',
          icon: Calendar,
          path: '/agency/shifts/create-offer',
        },
        {
          label: 'Shift Calendar',
          icon: CalendarDays,
          path: '/agency/calendar',
        },
      ],
    },
    {
      label: 'Employee Management',
      icon: Users,
      children: [
        {
          label: 'My Employees',
          icon: Users,
          path: '/agency/employees',
        },
        {
          label: 'Availability',
          icon: CalendarDays,
          path: '/agency/availability',
        },
        {
          label: 'Quick Assign',
          icon: Zap,
          path: '/agency/quick-assign',
        },
      ],
    },
    {
      label: 'Timesheets',
      icon: Clock,
      children: [
        {
          label: 'Pending Approval',
          icon: Clock,
          path: '/agency/timesheets',
          badge: '8',
        },
        {
          label: 'Approval History',
          icon: FileText,
          path: '/agency/timesheets/history',
        },
      ],
    },
    {
      label: 'Client Coordination',
      icon: Briefcase,
      children: [
        {
          label: 'My Employers',
          icon: Briefcase,
          path: '/agency/employers',
        },
        {
          label: 'Client Communications',
          icon: MessageSquare,
          path: '/agency/client-comms',
        },
      ],
    },
    {
      label: 'Reports',
      icon: BarChart3,
      children: [
        {
          label: 'Shift Fill Rate',
          icon: Target,
          path: '/agency/reports/fill-rate',
        },
        {
          label: 'Employee Performance',
          icon: Star,
          path: '/agency/reports/performance',
        },
        {
          label: 'My Activity',
          icon: BarChart3,
          path: '/agency/reports/activity',
        },
      ],
    },
  ],

  employer_admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/employer',
    },
    {
      label: 'Placement Management',
      icon: ClipboardList,
      children: [
        {
          label: 'Create Placement',
          icon: Calendar,
          path: '/employer/placements/create',
        },
        {
          label: 'My Placements',
          icon: ClipboardList,
          path: '/employer/placements',
        },
        {
          label: 'Agency Responses',
          icon: FileCheck,
          path: '/employer/placement-responses',
          badge: '8',
        },
        {
          label: 'Placement Calendar',
          icon: CalendarDays,
          path: '/employer/placement-calendar',
        },
      ],
    },
    {
      label: 'Shift Management',
      icon: Calendar,
      children: [
        {
          label: 'All Shifts',
          icon: Calendar,
          path: '/employer/shifts',
        },
        {
          label: 'Shift Calendar',
          icon: CalendarDays,
          path: '/employer/calendar',
        },
        {
          label: 'Bulk Shift Upload',
          icon: Upload,
          path: '/employer/shifts/upload',
        },
      ],
    },
    {
      label: 'Team & Locations',
      icon: Users,
      children: [
        {
          label: 'Contacts & Approvers',
          icon: Users,
          path: '/employer/contacts',
        },
        {
          label: 'Locations',
          icon: MapPin,
          path: '/employer/locations',
        },
        {
          label: 'Departments',
          icon: Building,
          path: '/employer/departments',
        },
        {
          label: 'Assigned Staff',
          icon: Users,
          path: '/employer/staff',
        },
      ],
    },
    {
      label: 'Timesheets & Approval',
      icon: Clock,
      children: [
        {
          label: 'Pending Approval',
          icon: Clock,
          path: '/employer/timesheets',
          badge: '12',
        },
        {
          label: 'Approval History',
          icon: FileText,
          path: '/employer/timesheets/history',
        },
        {
          label: 'Digital Sign-off',
          icon: Shield,
          path: '/employer/sign-off',
        },
      ],
    },
    {
      label: 'Financial Management',
      icon: PoundSterling,
      children: [
        {
          label: 'Invoices',
          icon: Receipt,
          path: '/employer/invoices',
          badge: '5',
        },
        {
          label: 'Payment History',
          icon: Banknote,
          path: '/employer/payments',
        },
        {
          label: 'Spend Analysis',
          icon: BarChart3,
          path: '/employer/analytics',
        },
        {
          label: 'Budget Management',
          icon: PoundSterling,
          path: '/employer/budget',
        },
      ],
    },
    {
      label: 'Agency Management',
      icon: Briefcase,
      children: [
        {
          label: 'Agency Partners',
          icon: Briefcase,
          path: '/employer/agencies',
        },
        {
          label: 'Contracts',
          icon: FileText,
          path: '/employer/contracts',
        },
        {
          label: 'Service Reviews',
          icon: Star,
          path: '/employer/service-reviews',
        },
      ],
    },
    {
      label: 'Rate Management',
      icon: BookOpen,
      children: [
        {
          label: 'Rate Cards',
          icon: BookOpen,
          path: '/employer/rate-cards',
        },
        {
          label: 'Budget Rates',
          icon: PoundSterling,
          path: '/employer/budget-rates',
        },
      ],
    },
    {
      label: 'Employer Settings',
      icon: Settings,
      children: [
        {
          label: 'Company Profile',
          icon: Building,
          path: '/employer/profile',
        },
        {
          label: 'Billing & Subscription',
          icon: Receipt,
          path: '/employer/billing',
        },
        {
          label: 'Approval Workflow',
          icon: Workflow,
          path: '/employer/approval-workflow',
        },
        {
          label: 'Notification Settings',
          icon: Bell,
          path: '/employer/notifications',
        },
      ],
    },
  ],

  contact: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/employer',
    },
    {
      label: 'Shifts',
      icon: Calendar,
      children: [
        {
          label: "Today's Shifts",
          icon: Calendar,
          path: '/employer/shifts/today',
          badge: '6',
        },
        {
          label: 'Upcoming Shifts',
          icon: CalendarDays,
          path: '/employer/shifts/upcoming',
        },
        {
          label: 'Shift Calendar',
          icon: CalendarDays,
          path: '/employer/calendar',
        },
      ],
    },
    {
      label: 'Approval Center',
      icon: Shield,
      children: [
        {
          label: 'Timesheet Approval',
          icon: Clock,
          path: '/employer/approvals/timesheets',
          badge: '8',
        },
        {
          label: 'Shift Sign-off',
          icon: Calendar,
          path: '/employer/approvals/shifts',
          badge: '3',
        },
        {
          label: 'Approval History',
          icon: FileText,
          path: '/employer/approvals/history',
        },
      ],
    },
    {
      label: 'Staff Management',
      icon: Users,
      children: [
        {
          label: 'Assigned Staff',
          icon: Users,
          path: '/employer/staff',
        },
        {
          label: 'Attendance',
          icon: Clock,
          path: '/employer/attendance',
        },
      ],
    },
    {
      label: 'Communications',
      icon: MessageSquare,
      path: '/employer/comms',
    },
  ],

  employee: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/employee',
    },
    {
      label: 'My Shifts',
      icon: Calendar,
      children: [
        {
          label: 'Upcoming Shifts',
          icon: Calendar,
          path: '/employee/shifts',
          badge: '5',
        },
        {
          label: 'Shift Offers',
          icon: Workflow,
          path: '/employee/shift-offers',
          badge: '2',
        },
        {
          label: 'Shift History',
          icon: CalendarDays,
          path: '/employee/shift-history',
        },
        {
          label: 'Shift Calendar',
          icon: CalendarDays,
          path: '/employee/calendar',
        },
      ],
    },
    {
      label: 'Timesheets',
      icon: Clock,
      children: [
        {
          label: 'Clock In/Out',
          icon: Clock,
          path: '/employee/timesheets/clock',
        },
        {
          label: 'My Timesheets',
          icon: FileText,
          path: '/employee/timesheets',
        },
        {
          label: 'Submission History',
          icon: FileText,
          path: '/employee/timesheets/history',
        },
      ],
    },
    {
      label: 'Availability',
      icon: CalendarDays,
      children: [
        {
          label: 'Set Availability',
          icon: CalendarDays,
          path: '/employee/availability',
        },
        {
          label: 'Time Off Requests',
          icon: Clock,
          path: '/employee/time-off',
        },
        {
          label: 'Preferences',
          icon: HeartHandshake,
          path: '/employee/preferences',
        },
      ],
    },
    {
      label: 'Pay & Documents',
      icon: PoundSterling,
      children: [
        {
          label: 'Pay History',
          icon: Banknote,
          path: '/employee/pay-history',
        },
        {
          label: 'Payslips',
          icon: Receipt,
          path: '/employee/payslips',
        },
        {
          label: 'Tax Documents',
          icon: FileText,
          path: '/employee/tax-documents',
        },
        {
          label: 'Qualifications',
          icon: Star,
          path: '/employee/qualifications',
        },
      ],
    },
    {
      label: 'Profile & Settings',
      icon: Settings,
      children: [
        {
          label: 'My Profile',
          icon: UserCog,
          path: '/employee/profile',
        },
        {
          label: 'Documents',
          icon: FileText,
          path: '/employee/documents',
        },
        {
          label: 'Notification Settings',
          icon: Bell,
          path: '/employee/notifications',
        },
      ],
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
      path: '/system/process-queue',
    },
    {
      label: 'Scheduled Jobs',
      icon: Clock,
      path: '/system/scheduled-jobs',
    },
    {
      label: 'Webhook Management',
      icon: Link,
      path: '/system/webhooks',
    },
    {
      label: 'Integration Health',
      icon: Zap,
      path: '/system/integration-health',
    },
    {
      label: 'System Logs',
      icon: FileText,
      path: '/system/logs',
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
