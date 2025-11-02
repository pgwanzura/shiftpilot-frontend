// app/components/forms/FormCheckbox.tsx
'use client';

import { BaseFormField } from './BaseFormField';
import { useFormContext } from 'react-hook-form';

interface FormCheckboxProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormCheckbox(props: FormCheckboxProps) {
  const { register } = useFormContext();

  return (
    <BaseFormField {...props}>
      {({ error, ...fieldProps }) => (
        <div className="flex items-center">
          <input
            {...register(props.name)}
            type="checkbox"
            className={`
              h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''}
            `}
            {...fieldProps}
          />
          <label
            htmlFor={props.name}
            className="ml-2 block text-sm text-gray-900"
          >
            {props.label}
          </label>
        </div>
      )}
    </BaseFormField>
  );
}
