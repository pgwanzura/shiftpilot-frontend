'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface PageHeaderProps {
  actions?: ReactNode;
  children?: ReactNode;
  customBreadcrumbs?: { [key: string]: string };
}

export default function PageHeader({
  actions,
  customBreadcrumbs = {},
}: PageHeaderProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    if (!pathname) return [];

    const pathSegments = pathname
      .split('/')
      .filter((segment) => segment !== '');

    const breadcrumbs = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;

      const label =
        customBreadcrumbs[segment] ||
        customBreadcrumbs[href] ||
        formatSegmentLabel(segment);

      return {
        label,
        href: isLast ? undefined : href,
      };
    });

    return [
      {
        label: customBreadcrumbs['/'] || 'Dashboard',
        href: pathname === '/' ? undefined : '/',
      },
      ...breadcrumbs,
    ];
  };

  const formatSegmentLabel = (segment: string): string => {
    return segment
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 flex-wrap">
              {breadcrumbs.map((breadcrumb, index) => (
                <li
                  key={`${breadcrumb.label}-${index}`}
                  className="flex items-center"
                >
                  {index > 0 && (
                    <svg
                      className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {breadcrumb.href ? (
                    <a
                      href={breadcrumb.href}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
                    >
                      {breadcrumb.label}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {breadcrumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
      {actions && <div className="mt-4 sm:mt-0 sm:ml-4">{actions}</div>}
    </div>
  );
}
