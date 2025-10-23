'use client';

import { useFormContext } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export default function FormSelect({
  name,
  label,
  options,
  placeholder = 'Please select',
  required = false,
  disabled = false,
  description,
}: FormSelectProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormSelect must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name]?.message as string | undefined;

  const enhancedOptions: SelectOption[] = [
    { value: '', label: placeholder },
    ...options.filter((option) => option.value !== ''),
  ];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...register(name)}
        id={name}
        disabled={disabled}
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
      >
        {enhancedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
