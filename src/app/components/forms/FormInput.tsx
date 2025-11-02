// app/components/forms/FormInput.tsx
'use client';

import { BaseFormField } from './BaseFormField';
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

export default function FormInput(props: FormInputProps) {
  const { register } = useFormContext();

  return (
    <BaseFormField {...props}>
      {({ error, ...fieldProps }) => (
        <input
          {...register(props.name)}
          type={props.type}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
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
          {...fieldProps}
        />
      )}
    </BaseFormField>
  );
}
