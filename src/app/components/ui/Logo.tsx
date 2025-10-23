'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  backgroundColor?: 'white' | 'transparent' | 'indigo' | 'gray';
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white';
}

export default function Logo({
  size = 'md',
  backgroundColor = 'transparent',
  className,
  showText = false,
  variant = 'default',
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32',
    '4xl': 'w-40 h-40',
  };

  const backgroundClasses = {
    white: 'bg-white',
    transparent: 'bg-transparent',
    indigo: 'bg-indigo-50',
    gray: 'bg-gray-100',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const logoSource =
    variant === 'white'
      ? '/images/logo_short_white.png'
      : '/images/logo_short.png';

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg',
          sizeClasses[size],
          backgroundClasses[backgroundColor]
        )}
      >
        <Image
          src={logoSource}
          alt="ReferenceScope"
          width={84}
          height={84}
          className={cn(
            'object-contain',
            size === 'sm' && 'w-6 h-6',
            size === 'md' && 'w-8 h-8',
            size === 'lg' && 'w-12 h-12',
            size === 'xl' && 'w-16 h-16',
            size === '2xl' && 'w-20 h-20',
            size === '3xl' && 'w-24 h-24',
            size === '4xl' && 'w-28 h-28'
          )}
          priority
        />
      </div>

      {showText && (
        <span
          className={cn(
            'font-bold text-gray-900 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent',
            textSizes[size],
            variant === 'white' && 'text-white bg-none'
          )}
        >
          ReferenceScope
        </span>
      )}
    </div>
  );
}
