'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/app/components/ui';

export type AlertProps = {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  bordered?: boolean;
  autoDismiss?: number;
};

export default function Alert({
  message,
  variant = 'info',
  className,
  dismissible = false,
  onDismiss,
  bordered = false,
  autoDismiss,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const variantClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsMounted(true);
      });
    }
  }, [message]);

  useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(handleDismiss, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, isVisible, handleDismiss]);

  if (!isVisible || !message) return null;

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_auto] items-start gap-3 p-4 rounded-md transition-all duration-300 ease-out mb-4',
        variantClasses[variant],
        bordered && 'border',
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
      role="alert"
    >
      {/* Icon - Fixed width to prevent shifting */}
      <div className="flex-shrink-0 w-4 h-4 mt-0.5">
        {variant === 'success' && (
          <Icon name="checkCircle" className="w-4 h-4 text-green-800" />
        )}
        {variant === 'error' && (
          <Icon name="xCircle" className="w-4 h-4 text-red-800" />
        )}
        {variant === 'warning' && (
          <Icon name="alertTriangle" className="w-4 h-4 text-yellow-800" />
        )}
        {variant === 'info' && (
          <Icon name="info" className="w-4 h-4 text-blue-800" />
        )}
      </div>

      {/* Message - Guaranteed to never overlap */}
      <div className="min-w-0">
        <p className="text-sm font-medium break-words break-all">{message}</p>
      </div>

      {/* Close Button - Always in its own column */}
      {dismissible && (
        <button
          type="button"
          className="flex-shrink-0 w-6 h-6 rounded-sm hover:bg-black/5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-current flex items-center justify-center"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <Icon name="closeX" className="w-3.5 h-3.5 opacity-70" />
        </button>
      )}
    </div>
  );
}
