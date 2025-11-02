'use client';

import { useFormContext, FieldError } from 'react-hook-form';

interface FormArrayInputProps {
  name: string;
  index: number;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

type FieldArrayErrors = (FieldError | undefined)[];

export default function FormArrayInput({
  name,
  index,
  label,
  placeholder,
  type = 'text',
  className = '',
  required = false,
  onFocus,
  onBlur,
}: FormArrayInputProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormArrayInput must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const fieldName = `${name}.${index}`;

  const arrayErrors = errors[name] as FieldArrayErrors | undefined;
  const error = arrayErrors?.[index]?.message;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={fieldName}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...register(fieldName)}
        type={type}
        id={fieldName}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 ${className}`}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
