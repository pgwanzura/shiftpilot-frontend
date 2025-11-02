'use client';

import { useFormContext } from 'react-hook-form';

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormSwitch({
  name,
  label,
  description,
  required = false,
  disabled = false,
}: FormSwitchProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormSwitch must be used within a FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
        <label
          className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            {...register(name)}
            type="checkbox"
            className="sr-only peer"
            disabled={disabled}
          />
          <div
            className={`
            w-11 h-6 bg-gray-200 rounded-full peer 
            peer-focus:outline-none peer-focus:ring-4 
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
            after:bg-white after:border-gray-300 after:border after:rounded-full 
            after:h-5 after:w-5 after:transition-all 
            peer-checked:after:translate-x-full peer-checked:after:border-white
            peer-checked:bg-primary-600
            ${
              error
                ? 'ring-2 ring-red-500 ring-offset-2 peer-focus:ring-red-300'
                : 'peer-focus:ring-primary-300'
            }
          `}
          ></div>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
