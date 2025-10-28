// app/components/ui/Icon/Icon.tsx
'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { AppIconType, getIconComponent } from '@/config/icons';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'ref'> {
  name: AppIconType;
  size?: IconSize;
  spin?: boolean;
  className?: string;
}

interface LucideIconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

const SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

const Spinner: React.FC<{
  size: number;
  spin?: boolean;
  className?: string;
}> = ({ size, spin = true, className }) => {
  return (
    <span
      className={clsx(
        'inline-flex animate-spin text-current',
        spin && 'animate-spin',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  spin = false,
  className,
}) => {
  const [IconComponent, setIconComponent] =
    useState<React.ComponentType<LucideIconProps> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconSize = typeof size === 'number' ? size : SIZE_MAP[size];

  useEffect(() => {
    let isMounted = true;

    const loadIcon = async () => {
      try {
        setLoading(true);
        const component = await getIconComponent(name);
        if (isMounted) {
          setIconComponent(
            () => component as React.ComponentType<LucideIconProps>
          );
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load icon');
          setIconComponent(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [name]);

  if (loading) {
    return <Spinner size={iconSize} spin={spin} className={className} />;
  }

  if (error || !IconComponent) {
    console.error(`Failed to load icon: ${name}`, error);
    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center bg-red-100 text-red-600',
          className
        )}
        style={{ width: iconSize, height: iconSize }}
        title={`Icon ${name} not found`}
      >
        <span className="text-xs">❌</span>
      </span>
    );
  }

  return (
    <IconComponent
      size={iconSize}
      color="currentColor"
      className={clsx('inline-flex', spin && 'animate-spin', className)}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
