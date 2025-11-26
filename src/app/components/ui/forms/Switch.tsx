'use client';

import React, { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import { labelClasses } from './field-styles';

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, description, className = '', ...props }, ref) => {
    const switchId = React.useId();

    const switchClasses = `
      relative inline-flex h-6 w-11 items-center rounded-full
      transition-all duration-300
      ${props.checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
      ${props.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    const knobClasses = `
      inline-block h-4 w-4 transform rounded-full bg-white transition
      ${props.checked ? 'translate-x-6' : 'translate-x-1'}
    `.trim();

    return (
      <FieldWrapper
        label={undefined}
        error={error}
        description={description}
        htmlFor={switchId}
        required={props.required}
      >
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            className="sr-only"
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />

          <label htmlFor={switchId} className={switchClasses}>
            <span className={knobClasses} />
          </label>

          {label && (
            <label
              htmlFor={switchId}
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

Switch.displayName = 'Switch';
