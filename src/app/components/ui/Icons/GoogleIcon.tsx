import React from 'react';

export interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official Google "G" logo (multi-color circular icon)
 */
export default function GoogleIcon({ size = 24, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={style}
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.22 3.6l6.85-6.85C35.91 2.56 30.47 0 24 0 14.62 0 6.41 5.49 2.56 13.44l7.98 6.2C12.17 13.07 17.63 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.1 24.55c0-1.64-.15-3.22-.44-4.75H24v9.02h12.43c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.59c4.2-3.89 6.63-9.63 6.63-16.9z"
      />
      <path
        fill="#4A90E2"
        d="M24 48c6.48 0 11.94-2.15 15.92-5.86l-7.18-5.59c-2 1.35-4.55 2.15-7.61 2.15-5.86 0-10.82-3.95-12.59-9.26l-8.1 6.26C8.75 43.53 15.84 48 24 48z"
      />
      <path
        fill="#FBBC05"
        d="M11.41 29.44A14.48 14.48 0 0 1 10.6 24c0-1.89.34-3.72.95-5.44l-8.1-6.26A23.88 23.88 0 0 0 0 24c0 3.91.94 7.62 2.56 10.91l8.85-5.47z"
      />
    </svg>
  );
}
