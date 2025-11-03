'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  loading?: boolean;
  onClick?: () => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  loading = false,
  onClick,
  interactive = false,
  size = 'md',
  className,
}: StatCardProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const textSizes = {
    sm: { title: 'text-xs', value: 'text-xl', description: 'text-xs' },
    md: { title: 'text-sm', value: 'text-2xl', description: 'text-sm' },
    lg: { title: 'text-base', value: 'text-3xl', description: 'text-base' },
  };

  const iconSizes = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const baseClasses = `
    rounded-lg border border-gray-200 bg-white
    transition-all duration-200
    ${interactive ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''}
    ${loading ? 'animate-pulse' : ''}
    ${sizeClasses[size]}
  `;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      interactive &&
      onClick &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      onClick();
    }
  };

  if (loading) {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            {trend && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
          </div>
          <div className={`bg-gray-200 rounded-lg ${iconSizes[size]}`}>
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : -1}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? `${title}: ${value}` : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-gray-600 ${textSizes[size].title}`}>
            {title}
          </p>
          <p
            className={`font-bold text-gray-900 mt-1 truncate ${textSizes[size].value}`}
          >
            {value}
          </p>

          {description && (
            <p className={`text-gray-500 mt-1 ${textSizes[size].description}`}>
              {description}
            </p>
          )}

          {trend && (
            <div className={`mt-2 ${textSizes[size].description}`}>
              <div
                className={`flex items-center font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <span className="flex items-center">
                  {trend.isPositive ? (
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {Math.abs(trend.value)}%
                </span>
              </div>
              <div className="text-gray-500 mt-1">
                {trend.label || 'from last month'}
              </div>
            </div>
          )}
        </div>

        <div
          className={`bg-primary-50 rounded-lg flex-shrink-0 ml-4 w-12 h-12 flex items-center justify-center`}
        >
          <div className="text-primary-600">{icon}</div>
        </div>
      </div>
    </div>
  );
}
