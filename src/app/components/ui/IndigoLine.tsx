// components/ui/IndigoLine.tsx
import { ReactNode } from 'react';

interface IndigoLineProps {
  className?: string;
  height?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const IndigoLine = ({
  className = '',
  height = 'md',
  children,
}: IndigoLineProps) => {
  const heightClasses = {
    sm: 'h-0.5',
    md: 'h-1',
    lg: 'h-1.5',
  };

  return (
    <div
      className={`${className} bg-indigo-600 ${heightClasses[height]} w-full`}
    >
      {children}
    </div>
  );
};

export default IndigoLine;
