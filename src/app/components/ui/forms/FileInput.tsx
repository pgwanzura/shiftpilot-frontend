'use client';

import React, { forwardRef, useState } from 'react';
import { FieldWrapper } from './FieldWrapper';
import {
  baseInputClasses,
  iconLeftClasses,
  iconRightClasses,
} from './field-styles';

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      error,
      description,
      leftIcon,
      rightIcon,
      accept,
      multiple,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const fileInputId = React.useId();
    const [fileName, setFileName] = useState<string>('');

    const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
    const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

    const fileInputClasses = `
      ${baseInputClasses}
      ${paddingLeft}
      ${paddingRight}
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${props.disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
      file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300
      cursor-pointer
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        if (multiple && files.length > 1) {
          setFileName(`${files.length} files selected`);
        } else {
          setFileName(files[0].name);
        }
      } else {
        setFileName('');
      }
      onChange?.(event);
    };

    return (
      <FieldWrapper
        label={label}
        error={error}
        description={description}
        htmlFor={fileInputId}
        required={props.required}
      >
        <div className="relative">
          {leftIcon && <div className={iconLeftClasses}>{leftIcon}</div>}

          <input
            ref={ref}
            id={fileInputId}
            type="file"
            className={fileInputClasses}
            aria-invalid={error ? 'true' : 'false'}
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            {...props}
          />

          {rightIcon && <div className={iconRightClasses}>{rightIcon}</div>}
        </div>

        {fileName && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selected: {fileName}
          </p>
        )}
      </FieldWrapper>
    );
  }
);

FileInput.displayName = 'FileInput';
