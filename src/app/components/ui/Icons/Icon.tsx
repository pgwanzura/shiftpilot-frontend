'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

const clientIconCache = new Map<
  AppIconType,
  React.ComponentType<LucideIconProps>
>();

export const preloadIconsClient = async (
  iconNames: AppIconType[]
): Promise<void> => {
  const uniqueIcons = [...new Set(iconNames)];
  const loadPromises = uniqueIcons.map(async (name) => {
    if (!clientIconCache.has(name)) {
      try {
        const component = await getIconComponent(name);
        if (component) {
          clientIconCache.set(
            name,
            component as React.ComponentType<LucideIconProps>
          );
        }
      } catch {
        console.warn(`Failed to preload icon: ${name}`);
      }
    }
  });
  await Promise.allSettled(loadPromises);
};

const getCachedIconClient = (
  name: AppIconType
): React.ComponentType<LucideIconProps> | null => {
  return clientIconCache.get(name) || null;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  spin = false,
  className,
  ...props
}) => {
  const [IconComponent, setIconComponent] =
    useState<React.ComponentType<LucideIconProps> | null>(() =>
      getCachedIconClient(name)
    );
  const [error, setError] = useState<string | null>(null);

  const iconSize = useMemo(
    () => (typeof size === 'number' ? size : SIZE_MAP[size]),
    [size]
  );

  useEffect(() => {
    let isMounted = true;

    if (IconComponent) return;

    const loadIcon = async (): Promise<void> => {
      try {
        const cached = getCachedIconClient(name);
        if (cached) {
          if (isMounted) {
            setIconComponent(() => cached);
            setError(null);
          }
          return;
        }

        const component = await getIconComponent(name);
        if (isMounted && component) {
          const typedComponent =
            component as React.ComponentType<LucideIconProps>;
          clientIconCache.set(name, typedComponent);
          setIconComponent(() => typedComponent);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load icon';
          setError(errorMessage);
          setIconComponent(null);
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [name, IconComponent]);

  if (error || !IconComponent) {
    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ width: iconSize, height: iconSize }}
        title={`Icon "${name}" not available`}
        {...props}
      >
        <span
          className="text-xs font-medium"
          style={{ fontSize: Math.max(iconSize * 0.5, 8) }}
        >
          ?
        </span>
      </span>
    );
  }

  return (
    <IconComponent
      size={iconSize}
      color="currentColor"
      className={clsx(
        'inline-flex flex-shrink-0',
        spin && 'animate-spin',
        className
      )}
      {...props}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
