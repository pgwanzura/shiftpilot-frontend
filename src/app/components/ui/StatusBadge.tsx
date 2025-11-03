import React from 'react';
import { Badge } from '@/app/components/ui';
import { StatusConfig } from '@/types';

export interface StatusBadgeProps {
  status: string;
  config?: StatusConfig;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  config,
  className = '',
  size = 'md',
  showIcon = false,
}) => {
  const defaultConfig: StatusConfig = {
    label: status,
    variant: 'secondary',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  };

  const currentConfig = config || defaultConfig;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  const getStatusIcon = (variant: StatusConfig['variant']) => {
    const iconMap = {
      success: 'checkCircle',
      warning: 'alertTriangle',
      error: 'xCircle',
      info: 'info',
      primary: 'circle',
      secondary: 'circle',
    };
    return iconMap[variant];
  };

  return (
    <Badge
      variant={currentConfig.variant}
      className={`
        ${currentConfig.bgColor} 
        ${currentConfig.color} 
        ${currentConfig.borderColor}
        ${sizeClasses[size]}
        ${showIcon ? 'flex items-center gap-1.5' : ''}
        border
        font-medium
        transition-all duration-200
        hover:scale-105
        ${className}
      `}
    >
      {showIcon && (
        <svg
          className={`${iconSize[size]} flex-shrink-0`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="8" />
        </svg>
      )}
      {currentConfig.label}
    </Badge>
  );
};

export const SuccessBadge: React.FC<Omit<StatusBadgeProps, 'config'>> = (
  props
) => (
  <StatusBadge
    {...props}
    config={{
      label: props.status,
      variant: 'success',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    }}
  />
);

export const WarningBadge: React.FC<Omit<StatusBadgeProps, 'config'>> = (
  props
) => (
  <StatusBadge
    {...props}
    config={{
      label: props.status,
      variant: 'warning',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    }}
  />
);

export const ErrorBadge: React.FC<Omit<StatusBadgeProps, 'config'>> = (
  props
) => (
  <StatusBadge
    {...props}
    config={{
      label: props.status,
      variant: 'error',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }}
  />
);

export const InfoBadge: React.FC<Omit<StatusBadgeProps, 'config'>> = (
  props
) => (
  <StatusBadge
    {...props}
    config={{
      label: props.status,
      variant: 'info',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    }}
  />
);
