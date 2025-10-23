// @/app/components/layouts/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  User,
  Users,
  UserPlus,
  Share2,
  HelpCircle,
  CreditCard,
  FileSignature,
  CheckCircle,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Shield,
  BookOpen,
  Calendar,
  MessageSquare,
  Building,
  ShieldCheck,
  BarChart3,
  Database,
  Wallet,
  UserCog,
  FileSearch,
  ClipboardCheck,
  TrendingUp,
  CreditCard as CreditCardIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import IndigoLine from '@/app/components/ui/IndigoLine';
import { UserRole } from '@/lib/utils/roles';
import { User as UserType } from '@/lib/api/types/auth';
import { logoutAction } from '@/lib/actions/auth-actions';
import { Logo } from '@/app/components/ui';

interface MenuItem {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}

interface SidebarProps {
  role: UserRole;
  user?: UserType;
  onSignOut?: () => void;
}

const menus: Record<UserRole, MenuItem[]> = {
  super_admin: [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '/admin/companies',
      label: 'Companies',
      icon: <Building className="w-5 h-5" />,
    },
    {
      href: '/admin/users',
      label: 'User Management',
      icon: <UserCog className="w-5 h-5" />,
    },
    {
      href: '/admin/payment-plans',
      label: 'Payment Plans',
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
    {
      href: '/admin/subscriptions',
      label: 'Subscriptions',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      href: '/admin/reference-requests',
      label: 'Reference Requests',
      icon: <FileSearch className="w-5 h-5" />,
    },
    {
      href: '/admin/verifications',
      label: 'Verifications',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      href: '/admin/system-logs',
      label: 'System Logs',
      icon: <Database className="w-5 h-5" />,
    },
  ],
  admin: [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '/admin/companies',
      label: 'Companies',
      icon: <Building className="w-5 h-5" />,
    },
    {
      href: '/admin/users',
      label: 'User Management',
      icon: <UserCog className="w-5 h-5" />,
    },
    {
      href: '/admin/payment-plans',
      label: 'Payment Plans',
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
    {
      href: '/admin/subscriptions',
      label: 'Subscriptions',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      href: '/admin/reference-requests',
      label: 'Reference Requests',
      icon: <FileSearch className="w-5 h-5" />,
    },
    {
      href: '/admin/verifications',
      label: 'Verifications',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ],
  recruiter_admin: [
    {
      href: '/recruiter-admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/team',
      label: 'Team Management',
      icon: <Users className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/candidates',
      label: 'Candidates',
      icon: <User className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/reference-requests',
      label: 'Reference Requests',
      icon: <FileSignature className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/reference-profiles',
      label: 'Reference Profiles',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/subscription',
      label: 'Subscription',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/payments',
      label: 'Payments',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      href: '/recruiter-admin/reports',
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ],
  recruiter: [
    {
      href: '/recruiter',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      href: '/recruiter/candidates',
      label: 'Candidates',
      icon: <User className="w-5 h-5" />,
    },
    {
      href: '/recruiter/reference-profiles',
      label: 'Reference Profiles',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      href: '/recruiter/on-demand',
      label: 'On-Demand Requests',
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
  ],
  candidate: [
    {
      href: '/candidate/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '/candidate/profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      href: '/candidate/references',
      label: 'My References',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      href: '/candidate/add-reference',
      label: 'Add Reference',
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      href: '/candidate/share-reference',
      label: 'Share Reference',
      icon: <Share2 className="w-5 h-5" />,
    },
    {
      href: '/candidate/on-demand',
      label: 'On-Demand Requests',
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
  ],
  referee: [
    {
      href: '/referee/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '/referee/pending-requests',
      label: 'Pending Requests',
      icon: <FileSignature className="w-5 h-5" />,
    },
    {
      href: '/referee/completed-references',
      label: 'Completed References',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      href: '/referee/guidelines',
      label: 'Guidelines',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      href: '/referee/profile',
      label: 'Profile Settings',
      icon: <User className="w-5 h-5" />,
    },
  ],
};

const accountMenus: Record<UserRole, MenuItem[]> = {
  super_admin: [
    {
      href: '/admin/settings',
      label: 'System Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      href: '/admin/notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      href: '/admin/audit-logs',
      label: 'Audit Logs',
      icon: <Database className="w-4 h-4" />,
    },
  ],
  admin: [
    {
      href: '/admin/settings',
      label: 'System Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      href: '/admin/notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      href: '/admin/audit-logs',
      label: 'Audit Logs',
      icon: <Database className="w-4 h-4" />,
    },
  ],
  recruiter_admin: [
    {
      href: '/recruiter-admin/settings',
      label: 'Company Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      href: '/recruiter-admin/billing',
      label: 'Billing & Payments',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      href: '/recruiter-admin/credits',
      label: 'Credit Management',
      icon: <Wallet className="w-4 h-4" />,
    },
  ],
  recruiter: [
    {
      href: '/recruiter/settings',
      label: 'Profile Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      href: '/recruiter/credits',
      label: 'My Credits',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      href: '/recruiter/notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
  ],
  candidate: [
    {
      href: '/candidate/settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      href: '/candidate/notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      href: '/candidate/privacy',
      label: 'Privacy & Security',
      icon: <Shield className="w-4 h-4" />,
    },
  ],
  referee: [
    {
      href: '/referee/settings',
      label: 'Profile Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      href: '/referee/availability',
      label: 'Availability',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      href: '/referee/communication',
      label: 'Communication Preferences',
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ],
};

const helpMenuItem: MenuItem = {
  href: '/help-center',
  label: 'Help Center',
  icon: <HelpCircle className="w-4 h-4" />,
};

export default function Sidebar({ role, user, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isActive = (item: MenuItem): boolean => {
    if (item.exact) {
      return pathname === item.href;
    }

    const nestedRoutes = [
      '/recruiter/on-demand',
      '/candidate/on-demand',
      '/recruiter/candidates',
      '/recruiter-admin/candidates',
    ];

    if (nestedRoutes.includes(item.href)) {
      return pathname.startsWith(item.href);
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const formatRole = (role: UserRole): string => {
    return role.replace(/_/g, ' ');
  };

  const getAvatarPlaceholder = (name: string) => {
    return 'https://randomuser.me/api/portraits/women/44.jpg';
  };

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const avatarUrl = user?.avatar || getAvatarPlaceholder(displayName);

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col border-r border-gray-200 fixed left-0 top-0 bottom-0 z-40">
      <div className="flex flex-col">
        <div className="flex items-center justify-center h-20 px-4 bg-white border-b border-gray-200">
          <Logo size="2xl" backgroundColor="white" />
        </div>
        <IndigoLine height="md" />
      </div>

      <div className="px-4 py-5 flex items-center bg-indigo-50 rounded-lg m-4 mt-6">
        <div className="relative flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={`${displayName}'s profile`}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
              {formatRole(role)}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 px-4">
          Main Navigation
        </h3>
        <ul className="mt-3 space-y-1">
          {menus[role].map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'text-indigo-700 bg-indigo-50 shadow-sm'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${
                      active ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="ml-3 truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
            Account
          </h3>
          <ul className="mt-3 space-y-1">
            {accountMenus[role]?.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'text-indigo-700 bg-indigo-50 shadow-sm'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        active ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="ml-3 truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}

            <li>
              <Link
                href={helpMenuItem.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(helpMenuItem)
                    ? 'text-indigo-700 bg-indigo-50 shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <span
                  className={`flex-shrink-0 ${
                    isActive(helpMenuItem) ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  {helpMenuItem.icon}
                </span>
                <span className="ml-3 truncate">{helpMenuItem.label}</span>
              </Link>
            </li>

            <li>
              <button
                onClick={async () => {
                  await logoutAction();
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                type="button"
              >
                <LogOut className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                <span className="truncate">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-center text-xs text-gray-500 flex-wrap gap-1">
          <span>© {currentYear} ReferenceScope</span>
          <span aria-hidden="true">•</span>
          <Link
            href="/privacy"
            className="hover:text-indigo-600 transition-colors"
          >
            Privacy
          </Link>
          <span aria-hidden="true">•</span>
          <Link
            href="/terms"
            className="hover:text-indigo-600 transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </aside>
  );
}
