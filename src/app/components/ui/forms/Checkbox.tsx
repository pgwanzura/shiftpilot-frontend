import { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: ReactNode;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  error?: string;
  required?: boolean;
}

export default function Checkbox({
  name,
  label,
  className = '',
  containerClassName = '',
  labelClassName = '',
  error,
  required,
  ...props
}: CheckboxProps) {
  return (
    <div className={containerClassName}>
      <div className="flex items-start gap-3">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={`mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${className}`}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <label
              htmlFor={name}
              className={`block text-sm text-gray-900 ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
