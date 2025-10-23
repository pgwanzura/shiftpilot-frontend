'use client';

import { useFormContext, FieldError } from 'react-hook-form';
import { ReactNode } from 'react';

interface FormCheckboxProps {
  name: string;
  label: string | ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export default function FormCheckbox({
  name,
  label,
  required = false,
  disabled = false,
}: FormCheckboxProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormCheckbox must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name] as FieldError | undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <input
          {...register(name)}
          type="checkbox"
          id={name}
          disabled={disabled}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error?.message && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
