'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader, Icon } from '@/app/components/ui';
import { cn } from '@/lib/utils';
import { AppIconType, IconName } from '@/config/icons';

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
  rounded = 'lg',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    primary:
      'bg-primary-700 text-white border border-primary-500 hover:bg-primary-600 hover:border-primary-600',
    'primary-outline':
      'bg-white text-primary-500 border border-pprimary-500 hover:bg-primary-50',
    secondary:
      'bg-gray-500 text-white border border-gray-500 hover:bg-gray-600 hover:border-gray-600',
    'secondary-outline':
      'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 hover:border-gray-400',
    gradient:
      'bg-gradient-to-r from-blue-500 to-purple-600 text-white border border-transparent hover:from-blue-600 hover:to-purple-700',
    ghost:
      'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100',
    danger:
      'bg-red-500 text-white border border-red-500 hover:bg-red-600 hover:border-red-600',
    'danger-outline':
      'bg-white text-red-500 border border-red-500 hover:bg-red-50',
    'danger-gradient':
      'bg-gradient-to-r from-red-500 to-pink-600 text-white border border-transparent hover:from-red-600 hover:to-pink-700',
    success:
      'bg-green-500 text-white border border-green-500 hover:bg-green-600 hover:border-green-600',
    'success-outline':
      'bg-white text-green-500 border border-green-500 hover:bg-green-50',
    warning:
      'bg-yellow-500 text-white border border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600',
    'warning-outline':
      'bg-white text-yellow-600 border border-yellow-500 hover:bg-yellow-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
    xl: 'px-6 py-3 text-lg gap-2',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-lg',
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
