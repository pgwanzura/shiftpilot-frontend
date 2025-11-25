// components/ui/forms/Checkbox.tsx
import React, { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { labelClasses, errorClasses, descriptionClasses } from './field-styles';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className = '', ...props }, ref) => {
    const checkboxId = React.useId();

    const checkboxClasses = `
      w-4 h-4 text-blue-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded
      focus:ring focus:ring-blue-500 focus:ring-offset-0 focus:border-blue-500
      transition-all duration-300
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${props.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    return (
      <FieldWrapper
        label={undefined}
        error={error}
        description={description}
        htmlFor={checkboxId}
        required={props.required}
      >
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={checkboxClasses}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />

          {label && (
            <label
              htmlFor={checkboxId}
              className={`${labelClasses} mb-0 cursor-pointer select-none`}
            >
              {label}
            </label>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

Checkbox.displayName = 'Checkbox';
