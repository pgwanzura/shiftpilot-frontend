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
          badge: '12',
        },
        {
          label: 'Employers',
          description: 'Manage employer accounts and company information',
          icon: Briefcase,
          path: '/admin/employers',
          badge: '45',
        },
        {
          label: 'Users & Roles',
          description:
            'Manage user accounts, permissions, and role assignments',
          icon: Users,
          path: '/admin/users',
        },
        {
          label: 'System Configuration',
          description: 'Configure platform settings and global preferences',
          icon: Settings,
          path: '/admin/system-config',
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
        },
        {
          label: 'Platform Invoices',
          description: 'View and manage all platform-generated invoices',
          icon: Receipt,
          path: '/admin/platform-invoices',
          badge: '23',
        },
        {
          label: 'Payment Reconciliation',
          description: 'Reconcile payments and track transaction status',
          icon: Banknote,
          path: '/admin/payments',
        },
        {
          label: 'Commission Tracking',
          description: 'Monitor commission calculations and payments',
          icon: PoundSterling,
          path: '/admin/commissions',
        },
        {
          label: 'Tax Settings',
          description: 'Configure tax rates and compliance settings',
          icon: Receipt,
          path: '/admin/tax',
        },
      ],
    },
    {
      label: 'Operations',
      description:
        'Manage shifts, timesheets, placements, and operational workflows',
      icon: Workflow,
      children: [
        {
          label: 'All Shifts',
          description: 'View and manage all shifts across the platform',
          icon: Calendar,
          path: '/admin/shifts',
        },
        {
          label: 'Shift Templates',
          description: 'Create and manage reusable shift templates',
          icon: CalendarDays,
          path: '/admin/shift-templates',
        },
        {
          label: 'Timesheets',
          description: 'Monitor timesheet submissions and approval status',
          icon: Clock,
          path: '/admin/timesheets',
          badge: '15',
        },
        {
          label: 'Placements',
          description: 'Track job placements and assignment status',
          icon: Link,
          path: '/admin/placements',
        },
        {
          label: 'Rate Cards',
          description: 'Manage pricing structures and rate configurations',
          icon: BookOpen,
          path: '/admin/rate-cards',
        },
      ],
    },
    {
      label: 'Workforce',
      description: 'Manage employees, agents, contacts, and workforce planning',
      icon: Users,
      children: [
        {
          label: 'All Employees',
          description: 'View and manage all employee profiles and records',
          icon: Users,
          path: '/admin/employees',
        },
        {
          label: 'Agents',
          description: 'Manage agency staff and their permissions',
          icon: UserCog,
          path: '/admin/agents',
        },
        {
          label: 'Contacts',
          description:
            'Manage contact information and communication preferences',
          icon: Users,
          path: '/admin/contacts',
        },
        {
          label: 'Availability Overview',
          description: 'View workforce availability and scheduling capacity',
          icon: CalendarDays,
          path: '/admin/availability',
        },
        {
          label: 'Time Off Requests',
          description: 'Review and manage employee time off requests',
          icon: Clock,
          path: '/admin/time-off',
          badge: '8',
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
        },
        {
          label: 'Compliance Reports',
          description: 'Generate and review compliance documentation',
          icon: FileText,
          path: '/admin/compliance',
        },
        {
          label: 'System Health',
          description: 'Monitor platform performance and system status',
          icon: Zap,
          path: '/admin/health',
        },
        {
          label: 'Performance Metrics',
          description: 'Track key performance indicators and platform metrics',
          icon: Target,
          path: '/admin/metrics',
        },
      ],
    },
    {
      label: 'Integrations',
      description: 'Manage webhooks, API access, and third-party integrations',
      icon: Link,
      children: [
        {
          label: 'Webhooks',
          description: 'Configure and manage webhook endpoints and events',
          icon: Link,
          path: '/admin/webhooks',
        },
        {
          label: 'API Management',
          description: 'Manage API keys, access, and developer settings',
          icon: Zap,
          path: '/admin/api',
        },
        {
          label: 'Payment Providers',
          description: 'Configure payment gateway integrations and settings',
          icon: Banknote,
          path: '/admin/payment-providers',
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
      label: 'Placements',
      description: 'Find and respond to available job placements',
      icon: Search,
      children: [
        {
          label: 'Available Placements',
          description: 'Browse and apply for open placement opportunities',
          icon: ClipboardList,
          path: '/agency/placements',
          badge: '15',
        },
        {
          label: 'My Responses',
          description: 'Track your placement applications and response status',
          icon: FileCheck,
          path: '/agency/placement-responses',
        },
        {
          label: 'Placement Calendar',
          description: 'View placement schedules and important dates',
          icon: CalendarDays,
          path: '/agency/placement-calendar',
        },
        {
          label: 'Quick Match',
          description: 'Find suitable placements based on your workforce',
          icon: Zap,
          path: '/agency/quick-match',
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
          badge: '89',
        },
        {
          label: 'Agents',
          description: 'Manage agency staff and their responsibilities',
          icon: UserCog,
          path: '/agency/agents',
          badge: '5',
        },
        {
          label: 'Onboarding',
          description: 'Streamline new employee onboarding processes',
          icon: Upload,
          path: '/agency/onboarding',
        },
        {
          label: 'Qualifications',
          description: 'Manage employee certifications and qualifications',
          icon: Star,
          path: '/agency/qualifications',
        },
        {
          label: 'Performance',
          description: 'Track employee performance metrics and reviews',
          icon: Target,
          path: '/agency/performance',
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
        },
        {
          label: 'Shift Calendar',
          description: 'Visual shift scheduling and calendar view',
          icon: CalendarDays,
          path: '/agency/shift-calendar',
        },
        {
          label: 'Shift Offers',
          description: 'Manage shift offers and employee assignments',
          icon: Workflow,
          path: '/agency/shift-offers',
          badge: '12',
        },
        {
          label: 'Create Shift',
          description: 'Create new shifts and schedule assignments',
          icon: Calendar,
          path: '/agency/shifts/create',
        },
        {
          label: 'Auto Scheduling',
          description: 'Automated shift assignment and scheduling tools',
          icon: Zap,
          path: '/agency/auto-scheduling',
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
        },
        {
          label: 'Time Off Requests',
          description: 'Review and approve employee time off requests',
          icon: Clock,
          path: '/agency/time-off-requests',
          badge: '7',
        },
        {
          label: 'Employee Preferences',
          description: 'Manage employee work preferences and settings',
          icon: HeartHandshake,
          path: '/agency/preferences',
        },
        {
          label: 'Capacity Planning',
          description: 'Plan workforce capacity and resource allocation',
          icon: TrendingUp,
          path: '/agency/capacity',
        },
      ],
    },
    {
      label: 'Timesheets & Approval',
      description: 'Manage timesheet approval and attendance tracking',
      icon: Clock,
      children: [
        {
          label: 'All Timesheets',
          description: 'Review and approve pending timesheet submissions',
          icon: Clock,
          path: '/agency/timesheets',
          badge: '15',
        },
        {
          label: 'Approval History',
          description: 'View historical timesheet approvals and records',
          icon: FileText,
          path: '/agency/timesheets/history',
        },
        {
          label: 'Clock In/Out Logs',
          description: 'Monitor employee attendance and clock events',
          icon: Clock,
          path: '/agency/attendance',
        },
      ],
    },
    {
      label: 'Client Management',
      description: 'Manage employer relationships and client communications',
      icon: Briefcase,
      children: [
        {
          label: 'Employers',
          description: 'Manage your employer clients and partnerships',
          icon: Briefcase,
          path: '/agency/employers',
          badge: '23',
        },
        {
          label: 'Contracts',
          description: 'Manage client contracts and service agreements',
          icon: FileText,
          path: '/agency/contracts',
        },
        {
          label: 'Service Level Monitoring',
          description: 'Track service level agreements and performance',
          icon: Target,
          path: '/agency/service-levels',
        },
        {
          label: 'Client Communications',
          description: 'Manage client communications and messaging',
          icon: MessageSquare,
          path: '/agency/client-comms',
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
          badge: '8',
        },
        {
          label: 'Payroll Processing',
          description: 'Process employee payroll and payments',
          icon: PoundSterling,
          path: '/agency/payroll',
        },
        {
          label: 'Payouts',
          description: 'Manage employee payments and payout schedules',
          icon: Banknote,
          path: '/agency/payouts',
        },
        {
          label: 'Revenue Reports',
          description: 'View revenue analytics and financial reports',
          icon: BarChart3,
          path: '/agency/revenue',
        },
        {
          label: 'Commission Tracking',
          description: 'Track agent commissions and performance incentives',
          icon: PoundSterling,
          path: '/agency/commissions',
        },
        {
          label: 'Expense Management',
          description: 'Manage business expenses and reimbursements',
          icon: Receipt,
          path: '/agency/expenses',
        },
      ],
    },
    {
      label: 'Rate Management',
      description: 'Manage pricing, rate cards, and billing structures',
      icon: BookOpen,
      children: [
        {
          label: 'Rate Cards',
          description: 'Create and manage client rate cards and pricing',
          icon: BookOpen,
          path: '/agency/rate-cards',
        },
        {
          label: 'Client Rates',
          description: 'Manage individual client pricing and agreements',
          icon: PoundSterling,
          path: '/agency/client-rates',
        },
        {
          label: 'Employee Pay Rates',
          description: 'Set and manage employee compensation rates',
          icon: Banknote,
          path: '/agency/pay-rates',
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
        },
        {
          label: 'Billing & Subscription',
          description: 'Manage billing information and subscription plans',
          icon: Receipt,
          path: '/agency/billing',
        },
        {
          label: 'Integrations',
          description: 'Configure third-party integrations and connections',
          icon: Link,
          path: '/agency/integrations',
        },
        {
          label: 'Webhooks',
          description: 'Manage webhook endpoints and event subscriptions',
          icon: Link,
          path: '/agency/webhooks',
        },
        {
          label: 'Document Templates',
          description: 'Create and manage document templates and forms',
          icon: FileText,
          path: '/agency/templates',
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
      label: 'Placements',
      description: 'Find and manage placement opportunities for your team',
      icon: Search,
      children: [
        {
          label: 'Available Placements',
          description: 'Browse available job placements and opportunities',
          icon: ClipboardList,
          path: '/agency/placements',
          badge: '15',
        },
        {
          label: 'My Responses',
          description: 'Track your placement applications and responses',
          icon: FileCheck,
          path: '/agency/placement-responses',
        },
        {
          label: 'Quick Match',
          description: 'Quickly match employees to suitable placements',
          icon: Zap,
          path: '/agency/quick-match',
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
          badge: '18',
        },
        {
          label: 'Shift Offers',
          description: 'Manage shift offers and employee acceptances',
          icon: Workflow,
          path: '/agency/shift-offers',
          badge: '12',
        },
        {
          label: 'Create Shift Offer',
          description: 'Create new shift offers for your employees',
          icon: Calendar,
          path: '/agency/shifts/create-offer',
        },
        {
          label: 'Shift Calendar',
          description: 'View shift schedules and assignments',
          icon: CalendarDays,
          path: '/agency/calendar',
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
        },
        {
          label: 'Availability',
          description: 'View and manage employee availability schedules',
          icon: CalendarDays,
          path: '/agency/availability',
        },
        {
          label: 'Quick Assign',
          description: 'Quickly assign employees to available shifts',
          icon: Zap,
          path: '/agency/quick-assign',
        },
      ],
    },
    {
      label: 'Timesheets',
      description: 'Review and manage timesheet submissions',
      icon: Clock,
      children: [
        {
          label: 'All Timesheets',
          description: 'Review and process timesheet submissions',
          icon: Clock,
          path: '/agency/timesheets',
          badge: '8',
        },
        {
          label: 'Approval History',
          description: 'View timesheet approval history and records',
          icon: FileText,
          path: '/agency/timesheets/history',
        },
      ],
    },
    {
      label: 'Client Coordination',
      description: 'Coordinate with employers and manage client relationships',
      icon: Briefcase,
      children: [
        {
          label: 'My Employers',
          description: 'Manage your assigned employer accounts',
          icon: Briefcase,
          path: '/agency/employers',
        },
        {
          label: 'Client Communications',
          description: 'Communicate with clients and manage messages',
          icon: MessageSquare,
          path: '/agency/client-comms',
        },
      ],
    },
    {
      label: 'Reports',
      description: 'View performance reports and activity metrics',
      icon: BarChart3,
      children: [
        {
          label: 'Shift Fill Rate',
          description: 'Track shift fulfillment rates and performance',
          icon: Target,
          path: '/agency/reports/fill-rate',
        },
        {
          label: 'Employee Performance',
          description: 'View employee performance metrics and reviews',
          icon: Star,
          path: '/agency/reports/performance',
        },
        {
          label: 'My Activity',
          description: 'Track your agent activity and performance metrics',
          icon: BarChart3,
          path: '/agency/reports/activity',
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
      label: 'Placement Management',
      description: 'Create and manage job placements and staffing requests',
      icon: ClipboardList,
      children: [
        {
          label: 'Create Placement',
          description: 'Create new job placements and staffing requests',
          icon: Calendar,
          path: '/employer/placements/create',
        },
        {
          label: 'My Placements',
          description: 'Manage your existing placements and requests',
          icon: ClipboardList,
          path: '/employer/placements',
        },
        {
          label: 'Agency Responses',
          description: 'Review agency responses to your placements',
          icon: FileCheck,
          path: '/employer/placement-responses',
          badge: '8',
        },
        {
          label: 'Placement Calendar',
          description: 'View placement schedules and staffing timelines',
          icon: CalendarDays,
          path: '/employer/placement-calendar',
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
        },
        {
          label: 'Shift Calendar',
          description: 'Visual shift scheduling and calendar management',
          icon: CalendarDays,
          path: '/employer/calendar',
        },
        {
          label: 'Bulk Shift Upload',
          description: 'Upload multiple shifts via spreadsheet or template',
          icon: Upload,
          path: '/employer/shifts/upload',
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
        },
        {
          label: 'Locations',
          description: 'Manage work locations and site information',
          icon: MapPin,
          path: '/employer/locations',
        },
        {
          label: 'Departments',
          description: 'Organize departments and team structures',
          icon: Building,
          path: '/employer/departments',
        },
        {
          label: 'Assigned Staff',
          description: 'View and manage assigned agency staff',
          icon: Users,
          path: '/employer/staff',
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
          badge: '12',
        },
        {
          label: 'Approval History',
          description: 'View historical timesheet approvals',
          icon: FileText,
          path: '/employer/timesheets/history',
        },
        {
          label: 'Digital Sign-off',
          description: 'Manage digital approval workflows and signatures',
          icon: Shield,
          path: '/employer/sign-off',
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
          badge: '5',
        },
        {
          label: 'Payment History',
          description: 'Track payment history and transaction records',
          icon: Banknote,
          path: '/employer/payments',
        },
        {
          label: 'Spend Analysis',
          description: 'Analyze staffing costs and spending patterns',
          icon: BarChart3,
          path: '/employer/analytics',
        },
        {
          label: 'Budget Management',
          description: 'Manage staffing budgets and cost controls',
          icon: PoundSterling,
          path: '/employer/budget',
        },
      ],
    },
    {
      label: 'Agency Management',
      description: 'Manage agency partnerships, contracts, and service reviews',
      icon: Briefcase,
      children: [
        {
          label: 'Agency Partners',
          description: 'Manage your agency partnerships and relationships',
          icon: Briefcase,
          path: '/employer/agencies',
        },
        {
          label: 'Contracts',
          description: 'View and manage agency contracts and agreements',
          icon: FileText,
          path: '/employer/contracts',
        },
        {
          label: 'Service Reviews',
          description: 'Review agency service performance and feedback',
          icon: Star,
          path: '/employer/service-reviews',
        },
      ],
    },
    {
      label: 'Rate Management',
      description: 'Manage rate cards, budgets, and pricing structures',
      icon: BookOpen,
      children: [
        {
          label: 'Rate Cards',
          description: 'Manage approved rate cards and pricing',
          icon: BookOpen,
          path: '/employer/rate-cards',
        },
        {
          label: 'Budget Rates',
          description: 'Set and manage budget rates for staffing',
          icon: PoundSterling,
          path: '/employer/budget-rates',
        },
      ],
    },
    {
      label: 'Employer Settings',
      description: 'Configure company profile, billing, and workflow settings',
      icon: Settings,
      children: [
        {
          label: 'Company Profile',
          description: 'Manage company information and branding',
          icon: Building,
          path: '/employer/profile',
        },
        {
          label: 'Billing & Subscription',
          description: 'Manage billing details and subscription plans',
          icon: Receipt,
          path: '/employer/billing',
        },
        {
          label: 'Approval Workflow',
          description: 'Configure timesheet and shift approval workflows',
          icon: Workflow,
          path: '/employer/approval-workflow',
        },
        {
          label: 'Notification Settings',
          description: 'Manage notification preferences and alerts',
          icon: Bell,
          path: '/employer/notifications',
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
          badge: '6',
        },
        {
          label: 'Upcoming Shifts',
          description: 'View upcoming shifts and schedules',
          icon: CalendarDays,
          path: '/employer/shifts/upcoming',
        },
        {
          label: 'Shift Calendar',
          description: 'Visual calendar view of all shifts',
          icon: CalendarDays,
          path: '/employer/calendar',
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
          badge: '8',
        },
        {
          label: 'Shift Sign-off',
          description: 'Review and sign off on completed shifts',
          icon: Calendar,
          path: '/employer/approvals/shifts',
          badge: '3',
        },
        {
          label: 'Approval History',
          description: 'View approval history and past decisions',
          icon: FileText,
          path: '/employer/approvals/history',
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
        },
        {
          label: 'Attendance',
          description: 'Monitor staff attendance and punctuality',
          icon: Clock,
          path: '/employer/attendance',
        },
      ],
    },
    {
      label: 'Communications',
      description: 'Manage communications with agencies and staff',
      icon: MessageSquare,
      path: '/employer/comms',
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
          badge: '5',
        },
        {
          label: 'Shift Offers',
          description: 'View and accept available shift offers',
          icon: Workflow,
          path: '/employee/shift-offers',
          badge: '2',
        },
        {
          label: 'Shift History',
          description: 'View your completed shift history',
          icon: CalendarDays,
          path: '/employee/shift-history',
        },
        {
          label: 'Shift Calendar',
          description: 'Visual calendar of your shift schedule',
          icon: CalendarDays,
          path: '/employee/calendar',
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
        },
        {
          label: 'My Timesheets',
          description: 'View and manage your timesheet submissions',
          icon: FileText,
          path: '/employee/timesheets',
        },
        {
          label: 'Submission History',
          description: 'View your timesheet submission history',
          icon: FileText,
          path: '/employee/timesheets/history',
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
        },
        {
          label: 'Time Off Requests',
          description: 'Request time off and view approval status',
          icon: Clock,
          path: '/employee/time-off',
        },
        {
          label: 'Preferences',
          description: 'Set your work preferences and settings',
          icon: HeartHandshake,
          path: '/employee/preferences',
        },
      ],
    },
    {
      label: 'Pay & Documents',
      description: 'View pay history, documents, and qualifications',
      icon: PoundSterling,
      children: [
        {
          label: 'Pay History',
          description: 'View your payment history and earnings',
          icon: Banknote,
          path: '/employee/pay-history',
        },
        {
          label: 'Payslips',
          description: 'Access and download your payslips',
          icon: Receipt,
          path: '/employee/payslips',
        },
        {
          label: 'Tax Documents',
          description: 'View and manage your tax documents',
          icon: FileText,
          path: '/employee/tax-documents',
        },
        {
          label: 'Qualifications',
          description: 'Manage your certifications and qualifications',
          icon: Star,
          path: '/employee/qualifications',
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
        },
        {
          label: 'Documents',
          description: 'Manage your personal documents and files',
          icon: FileText,
          path: '/employee/documents',
        },
        {
          label: 'Notification Settings',
          description: 'Configure your notification preferences',
          icon: Bell,
          path: '/employee/notifications',
        },
      ],
    },
  ],

  system: [
    {
      label: 'System Dashboard',
      description: 'System overview with process monitoring and health status',
      icon: LayoutDashboard,
      path: '/system',
    },
    {
      label: 'Process Queue',
      description: 'Monitor and manage background processing queues',
      icon: Workflow,
      path: '/system/process-queue',
    },
    {
      label: 'Scheduled Jobs',
      description: 'Manage scheduled tasks and automated processes',
      icon: Clock,
      path: '/system/scheduled-jobs',
    },
    {
      label: 'Webhook Management',
      description: 'Monitor webhook deliveries and event processing',
      icon: Link,
      path: '/system/webhooks',
    },
    {
      label: 'Integration Health',
      description: 'Monitor third-party integration status and health',
      icon: Zap,
      path: '/system/integration-health',
    },
    {
      label: 'System Logs',
      description: 'View system logs and diagnostic information',
      icon: FileText,
      path: '/system/logs',
    },
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

// NEW: Helper function to get description by path
export const getDescriptionByPath = (path: string): string => {
  const menuItem = findMenuItemByPath(path);
  return (
    menuItem?.description ||
    'Manage your operations and view important information'
  );
};

// NEW: Helper function to get description for role's default page
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
