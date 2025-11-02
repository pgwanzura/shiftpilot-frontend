// app/components/forms/FormPasswordInput.tsx
'use client';

import { useState } from 'react';
import { BaseFormField } from './BaseFormField';
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
  showVisibilityToggle = true,
  ...props
}: FormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useFormContext();

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <BaseFormField {...props}>
      {({ error, ...fieldProps }) => (
        <div className="relative">
          <input
            {...register(props.name)}
            type={showPassword ? 'text' : 'password'}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
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
            {...fieldProps}
          />

          {showVisibilityToggle && (
            <button
              type="button"
              onClick={toggleVisibility}
              disabled={props.disabled}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <EyeIcon show={showPassword} />
            </button>
          )}
        </div>
      )}
    </BaseFormField>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
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
  );
}
