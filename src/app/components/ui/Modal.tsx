'use client';

import { ReactNode, useEffect } from 'react';
import { Icon } from '@/app/components/ui';
import { GradientLine } from '@/app/components/ui';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  overlayClassName?: string;
  containerClassName?: string;
  showGradientLine?: boolean;
  gradientLineColors?: string[];
  icon?: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  overlayClassName = '',
  containerClassName = '',
  showGradientLine = true,
  gradientLineColors = ['from-indigo-600', 'via-purple-600', 'to-pink-600'],
  icon,
  className = '',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0 ${overlayClassName}`}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100/50 bg-white shadow-2xl backdrop-blur-md transition-all duration-300 animate-in zoom-in-95 fade-in-0 ${sizeClasses[size]} max-h-[90vh] ${containerClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || icon || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/80 px-6 py-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex-shrink-0 text-indigo-600">{icon}</div>
              )}
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {title}
                </h2>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <Icon
                  name="closeX"
                  className="h-5 w-5 text-gray-400 transition-colors hover:text-gray-600"
                />
              </button>
            )}
          </div>
        )}
        {showGradientLine && (
          <GradientLine colors={gradientLineColors} height="sm" />
        )}
        <div className="flex-1 overflow-y-auto bg-white/95 px-6 py-5">
          {children}
        </div>
        {actions && (
          <div className="flex justify-end space-x-3 border-t border-gray-100 bg-gradient-to-t from-gray-50/90 to-white/80 px-6 py-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
