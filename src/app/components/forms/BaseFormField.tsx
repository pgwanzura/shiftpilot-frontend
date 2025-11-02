'use client';

import { useFormContext, RegisterOptions } from 'react-hook-form';
import { ReactNode, JSX } from 'react';

interface BaseFormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  children: (props: FieldChildrenProps) => ReactNode;
  description?: string;
  validation?: RegisterOptions;
}

interface FieldChildrenProps {
  id: string;
  disabled: boolean;
  'aria-describedby'?: string;
  'aria-invalid': 'true' | 'false';
  error?: string;
  required: boolean;
  name: string;
  validation?: RegisterOptions;
}

interface FormContextState {
  formState: {
    errors: Record<string, { message?: string }>;
  };
  register: (name: string, options?: RegisterOptions) => void;
}

export function BaseFormField({
  name,
  label,
  required = false,
  disabled = false,
  children,
  description,
  validation,
}: BaseFormFieldProps): JSX.Element {
  const formContext = useFormContext() as FormContextState | undefined;

  if (!formContext) {
    throw new Error('BaseFormField must be used within a FormProvider');
  }

  const error = formContext.formState.errors[name]?.message as string | undefined;

  const fieldProps: FieldChildrenProps = {
    id: name,
    disabled,
    'aria-describedby': description ? `${name}-description` : undefined,
    'aria-invalid': error ? 'true' : 'false',
    error,
    required,
    name,
    validation,
  };

  return (
    <div className="space-y-2">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children(fieldProps)}

      {description && !error && (
        <p 
          id={`${name}-description`} 
          className="text-sm text-gray-500"
        >
          {description}
        </p>
      )}
      
      {error && (
        <p 
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}