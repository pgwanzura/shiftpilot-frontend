import { forwardRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      description,
      className = '',
      labelClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={props.name}
            className={`block text-sm font-semibold mb-1 text-gray-700 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`
            block w-full rounded-lg border px-4 py-3 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
        />
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
