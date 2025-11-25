// components/ui/forms/Textarea.tsx
import React, { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import {
  baseInputClasses,
  iconLeftClasses,
  iconRightClasses,
  iconTopClasses,
} from './field-styles';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const textareaId = React.useId();

    const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
    const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

    const textareaClasses = `
      ${baseInputClasses}
      ${paddingLeft}
      ${paddingRight}
      resize-none
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
        htmlFor={textareaId}
        required={props.required}
      >
        <div className="relative">
          {leftIcon && <div className={iconTopClasses}>{leftIcon}</div>}

          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClasses}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />

          {rightIcon && <div className={iconTopClasses}>{rightIcon}</div>}
        </div>
      </FieldWrapper>
    );
  }
);

Textarea.displayName = 'Textarea';
