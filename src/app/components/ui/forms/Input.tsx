// components/ui/forms/Input.tsx
import React, { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import {
  baseInputClasses,
  iconLeftClasses,
  iconRightClasses,
} from './field-styles';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      description,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
    const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

    const inputClasses = [
      baseInputClasses,
      paddingLeft,
      paddingRight,
      className,
      error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
      props.disabled &&
        'opacity-60 cursor-not-allowed pointer-events-none bg-gray-50 dark:bg-gray-900',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <FieldWrapper
        label={label}
        error={error}
        description={description}
        htmlFor={inputId}
        required={props.required}
        className={containerClassName}
      >
        <div className="relative">
          {leftIcon && <div className={iconLeftClasses}>{leftIcon}</div>}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={!!error}
            {...props}
          />

          {rightIcon && <div className={iconRightClasses}>{rightIcon}</div>}
        </div>
      </FieldWrapper>
    );
  }
);

Input.displayName = 'Input';
