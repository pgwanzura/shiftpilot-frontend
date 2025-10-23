// app/components/ui/Loader.tsx
'use client';

import React from 'react';

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  color?: string;
  className?: string;
  showText?: boolean;
  text?: string;
  textPosition?: 'left' | 'right' | 'top' | 'bottom';
  fullScreen?: boolean;
  thickness?: number; // New thickness prop
}

const join = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

export default function Loader({
  size = 'md',
  color = '#6366f1', // indigo-600
  className,
  showText = false,
  text = 'Loading...',
  textPosition = 'bottom',
  fullScreen = false,
  thickness = 4, // Default thickness of 4px
}: LoaderProps) {
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const spinnerSize = typeof size === 'number' ? size : sizeMap[size];

  const textPositions = {
    left: 'flex-row-reverse space-x-reverse space-x-3',
    right: 'flex-row space-x-3',
    top: 'flex-col-reverse space-y-reverse space-y-3',
    bottom: 'flex-col space-y-3',
  };

  const SpinnerLoader = () => (
    <div
      className={join('relative rounded-full', className)}
      style={{
        width: spinnerSize,
        height: spinnerSize,
      }}
      role="status"
      aria-label="Loading"
    >
      {/* Background track */}
      <div
        className="absolute inset-0 rounded-full border-2 border-gray-200"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: thickness,
        }}
      />
      {/* Animated spinner */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          color: color,
          borderWidth: thickness,
        }}
      />
    </div>
  );

  const content = showText ? (
    <div
      className={join(
        'inline-flex items-center justify-center',
        textPositions[textPosition]
      )}
      aria-live="polite"
    >
      <SpinnerLoader />
      <span className="text-sm font-medium text-gray-600">{text}</span>
    </div>
  ) : (
    <SpinnerLoader />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
        <div className="flex flex-col items-center space-y-4 p-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

// Additional specialized loader components for common use cases
export function ButtonLoader({
  size = 16,
  thickness = 2,
}: {
  size?: number;
  thickness?: number;
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="rounded-full border-2 border-white border-t-transparent animate-spin"
        style={{
          width: size,
          height: size,
          borderWidth: thickness,
        }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader size="lg" thickness={5} />
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium text-gray-600">Loading</span>
          <div className="flex space-x-1">
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.1s' }}
            />
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonLoader({
  className = '',
  count = 1,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={join('animate-pulse bg-gray-200 rounded', className)}
        />
      ))}
    </>
  );
}
