'use client';

import React, { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { labelClasses, errorClasses, descriptionClasses } from './field-styles';

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, description, className = '', ...props }, ref) => {
    const radioId = React.useId();

    const radioClasses = `
      w-4 h-4 text-blue-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
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
        htmlFor={radioId}
        required={props.required}
      >
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={radioClasses}
            {...props}
          />

          {label && (
            <label
              htmlFor={radioId}
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

Radio.displayName = 'Radio';
