'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader, Icon } from '@/app/components/ui';
import { cn } from '@/lib/utils';
import { AppIconType, IconName } from '@/app/config/icons';

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
  ...props
}: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center select-none font-medium outline-none transition-all duration-200 ease-out focus:ring-2 focus:ring-offset-1 border';

  const variants = {
    primary:
      'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 focus:ring-indigo-500 active:bg-indigo-800 active:border-indigo-800',
    'primary-outline':
      'bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500 active:bg-indigo-700 active:border-indigo-700',

    secondary:
      'bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 hover:border-gray-300 focus:ring-gray-400 active:bg-gray-300',
    'secondary-outline':
      'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-400 active:bg-gray-100',

    gradient:
      'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 hover:from-indigo-700 hover:to-indigo-800 focus:ring-indigo-500 active:from-indigo-800 active:to-indigo-900',

    ghost:
      'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-400 active:bg-gray-200',

    danger:
      'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-500 active:bg-red-800',
    'danger-outline':
      'bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 active:bg-red-700',
    'danger-gradient':
      'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-600 hover:from-red-700 hover:to-red-800 focus:ring-red-500 active:from-red-800 active:to-red-900',

    success:
      'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 focus:ring-green-500 active:bg-green-800',
    'success-outline':
      'bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 active:bg-green-700',

    warning:
      'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600 focus:ring-amber-500 active:bg-amber-700',
    'warning-outline':
      'bg-white text-amber-600 border-amber-500 hover:bg-amber-500 hover:text-white focus:ring-amber-500 active:bg-amber-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1 font-medium',
    md: 'px-4 py-2 text-sm gap-1.5 font-semibold',
    lg: 'px-6 py-2.5 text-base gap-2 font-semibold',
    xl: 'px-8 py-3 text-lg gap-2.5 font-bold',
  };

  const borderRadius = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-4.5 w-4.5',
    xl: 'h-5 w-5',
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    borderRadius[rounded],
    {
      'w-full': fullWidth,
      'opacity-70 cursor-not-allowed pointer-events-none border-opacity-50':
        loading || props.disabled,
      'cursor-not-allowed opacity-60 border-opacity-40':
        props.disabled && !loading,
      'active:scale-[0.98]': !loading && !props.disabled,
    },
    className
  );

  const renderIcon = (side: 'left' | 'right') => {
    if (!icon) return null;
    if (iconPosition !== side) return null;

    const iconElement =
      typeof icon === 'string' ? (
        <Icon
          name={icon as IconName}
          className={cn('flex-shrink-0', iconSizes[size])}
        />
      ) : (
        <span className={cn('flex-shrink-0', iconSizes[size])}>{icon}</span>
      );

    return (
      <span className="flex items-center justify-center">{iconElement}</span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <span className="flex items-center justify-center gap-2">
          <Loader
            size={size === 'sm' ? 'xs' : 'sm'}
            className="flex-shrink-0"
          />
          <span className="truncate">{processingText || children}</span>
        </span>
      );
    }

    return (
      <span className="flex items-center justify-center gap-2">
        {renderIcon('left')}
        <span className="truncate">{children}</span>
        {renderIcon('right')}
      </span>
    );
  };

  return (
    <button
      className={classes}
      disabled={loading || props.disabled}
      {...props}
      onMouseDown={(e) => {
        e.preventDefault();
        props.onMouseDown?.(e);
      }}
      onKeyDown={(e) => {
        if ([' ', 'Spacebar', 'Enter'].includes(e.key)) {
          e.preventDefault();
          e.currentTarget.click();
        }
        props.onKeyDown?.(e);
      }}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
