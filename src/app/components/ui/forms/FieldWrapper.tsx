import React from 'react';
import { labelClasses, errorClasses, descriptionClasses } from './field-styles';

export interface FieldWrapperProps {
  label?: string;
  error?: string;
  description?: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  error,
  description,
  htmlFor,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {!error && description && (
        <p className={descriptionClasses}>{description}</p>
      )}

      {error && (
        <p className={errorClasses} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
