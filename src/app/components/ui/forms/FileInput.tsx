import { InputHTMLAttributes } from 'react';

export interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
  error?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
}

export default function FileInput({
  name,
  label,
  className = '',
  error,
  required,
  accept,
  multiple,
  ...props
}: FileInputProps) {
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
      <input
        id={name}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        className={`
          mt-1 block w-full rounded-md border py-2 px-3
          text-base font-medium text-gray-900
          sm:text-sm
          bg-white
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100
          ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
