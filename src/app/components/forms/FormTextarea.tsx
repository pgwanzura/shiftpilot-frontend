'use client';

import { useFormContext } from 'react-hook-form';

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  description?: string;
}

export default function FormTextarea({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  description,
}: FormTextareaProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormTextarea must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...register(name)}
        id={name}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 border rounded-lg transition duration-200
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-vertical focus:outline-none focus:ring-2
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
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
