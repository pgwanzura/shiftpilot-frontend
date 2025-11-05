'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader, Icon } from '@/app/components/ui';
import { cn } from '@/lib/utils';
import { AppIconType } from '@/config/icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'primary-outline'
    | 'secondary'
    | 'secondary-outline'
    | 'gradient'
    | 'ghost'
    | 'danger'
    | 'danger-outline'
    | 'danger-gradient'
    | 'success'
    | 'success-outline'
    | 'warning'
    | 'warning-outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: AppIconType | ReactNode;
  loading?: boolean;
  processingText?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  processingText,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    primary:
      'bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 hover:border-primary-700 dark:bg-primary-700 dark:border-primary-700 dark:hover:bg-primary-600 dark:hover:border-primary-600',
    'primary-outline':
      'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 dark:bg-gray-800 dark:text-primary-400 dark:border-primary-500 dark:hover:bg-primary-900/20',
    secondary:
      'bg-gray-600 text-white border border-gray-600 hover:bg-gray-700 hover:border-gray-700 dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:border-gray-600',
    'secondary-outline':
      'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500',
    gradient:
      'bg-gradient-to-r from-primary-600 to-primary-700 text-white border border-transparent hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700',
    ghost:
      'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
    danger:
      'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 dark:bg-red-700 dark:border-red-700 dark:hover:bg-red-600 dark:hover:border-red-600',
    'danger-outline':
      'bg-white text-red-600 border border-red-600 hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20',
    'danger-gradient':
      'bg-gradient-to-r from-red-600 to-pink-600 text-white border border-transparent hover:from-red-700 hover:to-pink-700 dark:from-red-700 dark:to-pink-700 dark:hover:from-red-600 dark:hover:to-pink-600',
    success:
      'bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700 dark:bg-green-700 dark:border-green-700 dark:hover:bg-green-600 dark:hover:border-green-600',
    'success-outline':
      'bg-white text-green-600 border border-green-600 hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-500 dark:hover:bg-green-900/20',
    warning:
      'bg-yellow-600 text-white border border-yellow-600 hover:bg-yellow-700 hover:border-yellow-700 dark:bg-yellow-700 dark:border-yellow-700 dark:hover:bg-yellow-600 dark:hover:border-yellow-600',
    'warning-outline':
      'bg-white text-yellow-600 border border-yellow-600 hover:bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-500 dark:hover:bg-yellow-900/20',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
    xl: 'px-6 py-3 text-lg gap-2',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const iconSizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-5 w-5',
  };

  const renderIcon = (iconElement: AppIconType | ReactNode) => {
    if (typeof iconElement === 'string') {
      return (
        <Icon
          name={iconElement as AppIconType}
          className={`${iconSizeStyles[size]} transition-transform duration-300 group-hover:scale-105`}
        />
      );
    }
    return iconElement;
  };

  const displayText = loading && processingText ? processingText : children;

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        fullWidth && 'w-full',
        !fullWidth && 'whitespace-nowrap',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && iconPosition === 'left' && (
        <Loader size="sm" className={iconSizeStyles[size]} />
      )}

      {!loading && icon && iconPosition === 'left' && renderIcon(icon)}

      {displayText}

      {!loading && icon && iconPosition === 'right' && renderIcon(icon)}

      {loading && iconPosition === 'right' && (
        <Loader size="sm" className={iconSizeStyles[size]} />
      )}
    </button>
  );
};

export default Button;
