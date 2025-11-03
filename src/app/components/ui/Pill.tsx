'use client';

import React, { ReactNode, useState } from 'react';
import { Icon } from '@/app/components/ui';
import { AppIconType } from '@/config/icons';

interface PillProps {
  children: ReactNode;
  status?:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'neutral'
    | 'premium'
    | 'default'
    | 'primary-gradient';
  variant?: 'solid' | 'outline' | 'soft' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  icon?: AppIconType;
  onClose?: () => void;
  dismissible?: boolean;
  animated?: boolean;
  className?: string;
}

const Pill = ({
  children,
  status = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  onClose,
  dismissible = false,
  animated = true,
  className = '',
}: PillProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    if (animated) {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 200);
    } else {
      onClose?.();
    }
  };

  const baseClasses =
    'inline-flex items-center rounded-full font-medium transition-all duration-200 ease-out';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1 h-6',
    md: 'text-sm px-3 py-1.5 gap-1.5 h-7',
    lg: 'text-base px-4 py-2 gap-2 h-9',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const statusClasses = {
    solid: {
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      error: 'bg-red-600 text-white hover:bg-red-700',
      info: 'bg-blue-600 text-white hover:bg-blue-700',
      neutral: 'bg-gray-600 text-white hover:bg-gray-700',
      premium:
        'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg',
      default: 'bg-indigo-600 text-white hover:bg-indigo-700',
      'primary-gradient':
        'bg-gradient-to-r from-indigo-600 to-red-600 text-white shadow-md hover:shadow-lg',
    },
    outline: {
      success:
        'bg-white text-green-700 border border-green-300 hover:bg-green-50',
      warning:
        'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50',
      error: 'bg-white text-red-700 border border-red-300 hover:bg-red-50',
      info: 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50',
      neutral: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      premium:
        'bg-white text-purple-700 border border-purple-300 hover:bg-purple-50',
      default:
        'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50',
      'primary-gradient':
        'bg-white border border-transparent bg-clip-padding bg-origin-border [background:linear-gradient(white,white),linear-gradient(to_right,theme(colors.indigo.600),theme(colors.red.600))] text-transparent bg-clip-text hover:bg-indigo-50',
    },
    soft: {
      success: 'bg-green-100 text-green-800 hover:bg-green-200/80',
      warning: 'bg-amber-100 text-amber-800 hover:bg-amber-200/80',
      error: 'bg-red-100 text-red-800 hover:bg-red-200/80',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200/80',
      neutral: 'bg-gray-100 text-gray-800 hover:bg-gray-200/80',
      premium: 'bg-purple-100 text-purple-800 hover:bg-purple-200/80',
      default: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200/80',
      'primary-gradient':
        'bg-gradient-to-r from-indigo-100 to-red-100 text-indigo-800 hover:from-indigo-200 hover:to-red-200',
    },
    bordered: {
      success:
        'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100/80',
      warning:
        'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100/80',
      error: 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100/80',
      info: 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100/80',
      neutral:
        'bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100/80',
      premium:
        'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100/80',
      default:
        'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100/80',
      'primary-gradient':
        'bg-gradient-to-r from-indigo-50 to-red-50 text-indigo-800 border border-indigo-200 hover:from-indigo-100 hover:to-red-100',
    },
  };

  const statusIcons: Record<string, AppIconType> = {
    success: 'checkCircle',
    warning: 'alertCircle',
    error: 'xCircle',
    info: 'info',
    neutral: 'circle',
    premium: 'crown',
    default: 'circle',
    'primary-gradient': 'sparkles',
  };

  if (!isVisible) return null;

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${statusClasses[variant][status]} ${className}`}
    >
      {(icon || statusIcons[status]) && (
        <Icon
          name={icon || statusIcons[status]}
          size={iconSizes[size]}
          className="flex-shrink-0"
        />
      )}
      <span className="truncate">{children}</span>
      {dismissible && (
        <button
          onClick={handleClose}
          className="ml-1 flex items-center rounded-full hover:bg-black/10 p-0.5 focus:outline-none"
          aria-label="Dismiss"
        >
          <Icon name="x" size={iconSizes[size]} />
        </button>
      )}
    </span>
  );
};

export default Pill;
