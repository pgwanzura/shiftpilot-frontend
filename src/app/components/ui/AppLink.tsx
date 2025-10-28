import Link from 'next/link';
import { Icon } from './Icons';
import { IconName } from '@/config/icons';

export interface AppLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  className?: string;
  underline?: boolean;
}

export default function AppLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  underline = false,
}: AppLinkProps) {
  const baseStyles =
    'inline-flex items-center font-medium transition-all duration-200 rounded-md hover:transition-all';

  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary:
      'text-indigo-600 hover:text-indigo-700 bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50',
    secondary:
      'text-slate-700 hover:text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50',
    ghost:
      'text-slate-600 hover:text-slate-800 bg-transparent border border-transparent hover:bg-slate-100',
    gradient:
      'text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border border-transparent shadow-sm hover:shadow-md',
  };

  const underlineStyle = underline
    ? 'relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-purple-600 after:transition-all after:duration-200 hover:after:w-full'
    : '';

  return (
    <Link
      href={href}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${underlineStyle} ${className}`}
    >
      {icon && iconPosition === 'left' && (
        <Icon
          name={icon}
          className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
        />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon
          name={icon}
          className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
        />
      )}
    </Link>
  );
}
