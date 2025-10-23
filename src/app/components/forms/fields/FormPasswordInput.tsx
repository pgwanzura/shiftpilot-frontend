'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface FormPasswordInputProps {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  showVisibilityToggle?: boolean;
}

export default function FormPasswordInput({
  name,
  label,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  showVisibilityToggle = true,
}: FormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext();

  if (!form) {
    throw new Error('FormPasswordInput must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name]?.message as string | undefined;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? 'text' : 'password'}
          id={name}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pr-12 border rounded-lg transition duration-200
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2
            ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
          `}
        />

        {showVisibilityToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.83 3.83"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
