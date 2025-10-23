'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component

import Button from '@/app/components/ui/buttons/Button';
import { Icon } from '@/app/components/ui';
import { AppIconType } from '@/app/config/icons';

interface PageHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonVariant?:
    | 'primary'
    | 'secondary'
    | 'gradient'
    | 'ghost'
    | 'primary-outline'
    | 'secondary-outline'
    | 'danger'
    | 'danger-outline'
    | 'danger-gradient'
    | 'success'
    | 'success-outline'
    | 'warning'
    | 'warning-outline';
  buttonIcon?: AppIconType;
  className?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  backButtonHref?: string;
  breadcrumbs?: ReactNode;
  actionButtons?: ReactNode;
  isLoading?: boolean;
  showBreadcrumbs?: boolean;
  badge?: ReactNode;
  metadata?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  sticky?: boolean;
  backdropBlur?: boolean;
  stickyOffset?: number;
  avatar?: string;
  avatarFallback?: string;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
  progress?: number;
  stats?: Array<{ label: string; value: string | number; trend?: number }>;
  tabs?: Array<{ label: string; href: string; isActive?: boolean }>;
  searchable?: boolean;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterButton?: ReactNode;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  titleId?: string;
}

const BREADCRUMB_CONFIG: Record<
  string,
  { label: string; href: string; icon?: AppIconType; description?: string }
> = {
  recruiter: {
    label: 'Dashboard',
    href: '/recruiter',
    icon: 'layoutDashboard',
  },
  'on-demand': {
    label: 'On Demand',
    href: '/recruiter/on-demand',
    icon: 'zap',
  },
  request: {
    label: 'Requests',
    href: '/recruiter/on-demand/request',
    icon: 'inbox',
  },
  view: {
    label: 'View Request',
    href: '/recruiter/on-demand/request/view',
    icon: 'eye',
  },
  candidates: {
    label: 'Candidates',
    href: '/recruiter/candidates',
    icon: 'users',
  },
  jobs: {
    label: 'Jobs',
    href: '/recruiter/jobs',
    icon: 'briefcase',
  },
  analytics: {
    label: 'Analytics',
    href: '/recruiter/analytics',
    icon: 'barChart',
  },
  settings: {
    label: 'Settings',
    href: '/recruiter/settings',
    icon: 'settings',
  },
  profile: {
    label: 'Profile',
    href: '/recruiter/profile',
    icon: 'user',
  },
};

const PageHeader = ({
  title,
  description,
  buttonText,
  onButtonClick,
  buttonVariant = 'primary',
  buttonIcon,
  className = '',
  showBackButton = true,
  backButtonLabel = 'Back to previous page',
  backButtonHref,
  breadcrumbs,
  actionButtons,
  isLoading = false,
  showBreadcrumbs = true,
  badge,
  metadata,
  size = 'lg',
  sticky = false,
  backdropBlur = true,
  stickyOffset = 0,
  avatar,
  avatarFallback,
  status = 'default',
  progress,
  stats = [],
  tabs = [],
  searchable = false,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterButton,
  align = 'left',
  compact = false,
  shadow = 'none',
  border = true,
  titleId,
}: PageHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackClick = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const generateBreadcrumbs = () => {
    if (!pathname || pathname === '/') return null;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const isLast = i === pathSegments.length - 1;
      const href = '/' + pathSegments.slice(0, i + 1).join('/');

      // Skip numeric IDs in breadcrumbs
      if (/^\d+$/.test(segment)) {
        continue;
      }

      const config = BREADCRUMB_CONFIG[segment];
      const label =
        config?.label ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbItems.push(
        <li key={href} className="flex items-center">
          {i > 0 && (
            <Icon
              name="chevronRight"
              className="mx-2 h-4 w-4 text-gray-400 flex-shrink-0"
              aria-hidden="true"
            />
          )}
          {isLast ? (
            <span
              className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px] flex items-center gap-1.5"
              aria-current="page"
            >
              {config?.icon && (
                <Icon name={config.icon} className="h-4 w-4 flex-shrink-0" />
              )}
              {label}
            </span>
          ) : (
            <Link
              href={href}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 truncate max-w-[100px] sm:max-w-[150px] flex items-center gap-1.5 group"
              title={config?.description}
            >
              {config?.icon && (
                <Icon
                  name={config.icon}
                  className="h-4 w-4 flex-shrink-0 opacity-60 group-hover:opacity-100"
                />
              )}
              {label}
            </Link>
          )}
        </li>
      );
    }

    return (
      <nav aria-label="Breadcrumb" className="flex items-center">
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {breadcrumbItems}
        </ol>
      </nav>
    );
  };

  const statusColors = {
    default: 'border-gray-300',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
    info: 'border-blue-500',
  };

  const sizeStyles = {
    sm: {
      title: 'text-xl font-semibold',
      description: 'text-sm mt-1',
      container: 'gap-3',
      buttonSize: 'md' as const,
      avatarSize: 32,
    },
    md: {
      title: 'text-2xl font-semibold',
      description: 'text-base mt-2',
      container: 'gap-4',
      buttonSize: 'lg' as const,
      avatarSize: 40,
    },
    lg: {
      title: 'text-3xl font-bold',
      description: 'text-lg mt-2',
      container: 'gap-5',
      buttonSize: 'lg' as const,
      avatarSize: 48,
    },
    xl: {
      title: 'text-4xl font-bold',
      description: 'text-xl mt-2',
      container: 'gap-6',
      buttonSize: 'xl' as const,
      avatarSize: 56,
    },
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const currentSize = sizeStyles[size];
  const displayedBreadcrumbs =
    breadcrumbs || (showBreadcrumbs && generateBreadcrumbs());

  // Sticky header classes
  const stickyClasses = sticky
    ? `sticky z-40 top-${stickyOffset} transition-all duration-300`
    : '';

  // Backdrop blur classes
  const backdropClasses =
    backdropBlur && sticky
      ? 'bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/50'
      : 'bg-white';

  return (
    <header
      className={`
        ${border ? 'border-b border-gray-200' : ''}
        ${shadowStyles[shadow]}
        ${compact ? 'py-3 sm:py-4' : 'py-4 sm:py-6'}
        mb-8
        transition-all duration-200
        ${stickyClasses}
        ${backdropClasses}
        ${alignStyles[align]}
        ${className}
      `}
    >
      {/* Breadcrumbs */}
      {displayedBreadcrumbs && (
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <div className="flex-1">{displayedBreadcrumbs}</div>
          {stats.length > 0 && (
            <div className="hidden lg:flex items-center gap-4 ml-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {stat.label}
                    {stat.trend && (
                      <span
                        className={`text-xs ${
                          stat.trend > 0
                            ? 'text-green-600'
                            : stat.trend < 0
                              ? 'text-red-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {stat.trend > 0 ? '↗' : stat.trend < 0 ? '↘' : '→'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Header Content */}
      <div
        className={`flex flex-col ${currentSize.container} ${
          align === 'center' || align === 'right' ? 'items-center' : ''
        } lg:flex-row lg:items-center lg:justify-between`}
      >
        {/* Left Section */}
        <div
          className={`flex-1 min-w-0 ${
            align === 'center' ? 'text-center' : ''
          } ${align === 'right' ? 'text-right' : ''}`}
        >
          <div
            className={`flex items-start gap-3 sm:gap-4 ${
              align === 'center' ? 'justify-center' : ''
            } ${align === 'right' ? 'justify-end' : ''}`}
          >
            {showBackButton && align === 'left' && (
              <button
                onClick={handleBackClick}
                aria-label={backButtonLabel}
                className="rounded-lg bg-gray-50 p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center shrink-0 mt-1"
                type="button"
              >
                <Icon
                  name="chevronLeft"
                  size="sm"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
              </button>
            )}

            <div className="min-w-0 flex-1">
              {/* Avatar and Title Row */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {avatar && (
                  <div className={`relative flex-shrink-0`}>
                    <Image
                      src={avatar}
                      alt="Avatar"
                      width={currentSize.avatarSize}
                      height={currentSize.avatarSize}
                      className={`rounded-full border-2 ${statusColors[status]} object-cover`}
                    />
                  </div>
                )}
                {avatarFallback && !avatar && (
                  <div
                    className={`rounded-full border-2 ${statusColors[status]} bg-gray-100 flex items-center justify-center text-gray-600 font-medium flex-shrink-0`}
                    style={{
                      width: currentSize.avatarSize,
                      height: currentSize.avatarSize,
                    }}
                  >
                    {avatarFallback}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h1
                      id={titleId}
                      className={`${currentSize.title} text-gray-900 tracking-tight break-words`}
                    >
                      {title}
                    </h1>
                    {badge && <div className="flex-shrink-0">{badge}</div>}
                  </div>

                  {description && (
                    <p
                      className={`${
                        currentSize.description
                      } text-gray-600 leading-relaxed max-w-3xl ${
                        align === 'center' ? 'mx-auto' : ''
                      }`}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {progress !== undefined && (
                <div className="mt-3 max-w-md">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Metadata */}
              {metadata && (
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  {metadata}
                </div>
              )}

              {/* Stats for mobile */}
              {stats.length > 0 && (
                <div className="mt-3 lg:hidden flex items-center gap-4 overflow-x-auto pb-2">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center min-w-[80px]">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 lg:justify-end">
          {/* Search Bar */}
          {searchable && onSearchChange && (
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          )}

          {/* Filter Button */}
          {filterButton}

          {/* Action Buttons */}
          {actionButtons && (
            <div className="flex items-center gap-2 flex-wrap">
              {actionButtons}
            </div>
          )}

          {/* Main Button */}
          {buttonText && onButtonClick && (
            <Button
              variant={buttonVariant}
              onClick={onButtonClick}
              disabled={isLoading}
              loading={isLoading}
              className="whitespace-nowrap"
              icon={buttonIcon}
              size={currentSize.buttonSize}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      {tabs.length > 0 && (
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab, index) => (
              <Link
                key={index}
                href={tab.href}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  tab.isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default PageHeader;
