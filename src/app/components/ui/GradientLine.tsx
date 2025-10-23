// components/ui/GradientLine.tsx
import { ReactNode } from 'react';

interface GradientLineProps {
  className?: string;
  height?: 'sm' | 'md' | 'lg';
  colors?: string[];
  children?: ReactNode;
}

export const GradientLine = ({
  className = '',
  height = 'md',
  colors = ['from-indigo-600', 'via-purple-600', 'to-pink-600'],
  children,
}: GradientLineProps) => {
  const heightClasses = {
    sm: 'h-0.5',
    md: 'h-1',
    lg: 'h-1.5',
  };

  const gradientClass = `bg-gradient-to-r ${colors.join(' ')}`;

  return (
    <div
      className={`${className} ${gradientClass} ${heightClasses[height]} w-full`}
    >
      {children}
    </div>
  );
};

export default GradientLine;
