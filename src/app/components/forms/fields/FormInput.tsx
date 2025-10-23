'use client';

import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
}

export default function FormInput({
  name,
  type = 'text',
  label,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  description,
}: FormInputProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormInput must be used within a FormProvider');
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
      <input
        {...register(name)}
        type={type}
        id={name}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 border rounded-lg transition duration-200
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2
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
