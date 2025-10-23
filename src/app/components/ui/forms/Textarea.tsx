import { TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  className?: string;
  required?: boolean;
  description?: string;
  error?: string;
}

export default function Textarea({
  name,
  label,
  className = '',
  required,
  description,
  error,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        {...props}
        className={`
          mt-1 block w-full rounded-md py-2 px-3
          text-base font-medium text-gray-900 shadow-sm
          focus:ring-2 focus:ring-indigo-500
          sm:text-sm
          bg-white
          resize-y
          min-h-[100px]
          border
          ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500'
          }
          ${className}
        `}
      />

      {description && !error && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
