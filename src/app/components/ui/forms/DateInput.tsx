// components/ui/forms/DateInput.tsx
import React, { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import {
  baseInputClasses,
  iconLeftClasses,
  iconRightClasses,
} from './field-styles';

export interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      error,
      description,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const dateInputId = React.useId();

    const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
    const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

    const dateInputClasses = `
      ${baseInputClasses}
      ${paddingLeft}
      ${paddingRight}
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${props.disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    return (
      <FieldWrapper
        label={label}
        error={error}
        description={description}
        htmlFor={dateInputId}
        required={props.required}
      >
        <div className="relative">
          {leftIcon && <div className={iconLeftClasses}>{leftIcon}</div>}

          <input
            ref={ref}
            id={dateInputId}
            type="date"
            className={dateInputClasses}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />

          {rightIcon && <div className={iconRightClasses}>{rightIcon}</div>}
        </div>
      </FieldWrapper>
    );
  }
);

DateInput.displayName = 'DateInput';
