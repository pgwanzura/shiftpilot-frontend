import { ReactNode } from 'react';

export interface BrandGradientLineProps {
  className?: string;
  height?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export default function BrandGradientLine({
  className = '',
  height = 'md',
  children,
}: BrandGradientLineProps) {
  const heightClasses = {
    sm: 'h-0.5',
    md: 'h-1',
    lg: 'h-1.5',
  };

  return (
    <div
      className={`${className} bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 ${heightClasses[height]} w-full`}
    >
      {children}
    </div>
  );
}
