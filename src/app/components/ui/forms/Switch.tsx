import { InputHTMLAttributes } from 'react';

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  error?: string;
  required?: boolean;
}

export default function Switch({
  name,
  label,
  className = '',
  containerClassName = '',
  labelClassName = '',
  error,
  required,
  ...props
}: SwitchProps) {
  return (
    <div className={containerClassName}>
      <div className="flex items-center">
        <input
          id={name}
          type="checkbox"
          name={name}
          className={`sr-only ${className}`}
          {...props}
        />
        <div
          className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors ${
            props.checked ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
              props.checked ? 'transform translate-x-5' : ''
            }`}
          />
        </div>
        {label && (
          <label
            htmlFor={name}
            className={`ml-3 block text-sm text-gray-900 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
