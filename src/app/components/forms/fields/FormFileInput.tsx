'use client';

import { useFormContext, FieldError } from 'react-hook-form';

interface FormFileInputProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  description?: string;
}

export default function FormFileInput({
  name,
  label,
  required = false,
  disabled = false,
  accept,
  multiple = false,
  description,
}: FormFileInputProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormFileInput must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name] as FieldError | undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        type="file"
        id={name}
        disabled={disabled}
        accept={accept}
        multiple={multiple}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm transition duration-200
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2
          file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
          file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 
          hover:file:bg-primary-100
          ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }
        `}
      />
      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {error?.message && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
