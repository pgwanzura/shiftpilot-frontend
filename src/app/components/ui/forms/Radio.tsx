'use client';

import { useState, useEffect } from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioProps {
  name: string;
  label?: string;
  className?: string;
  options: RadioOption[];
  required?: boolean;
  value?: string;
  defaultValue?: string;
  error?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export default function Radio({
  name,
  label,
  className = '',
  options,
  required,
  value,
  defaultValue,
  error,
  onChange,
  disabled = false,
  orientation = 'vertical',
}: RadioProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    } else if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [value, defaultValue]);

  const handleChange = (optionValue: string) => {
    if (disabled) return;
    setSelectedValue(optionValue);
    onChange?.(optionValue);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`flex gap-4 ${
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        } ${className}`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center cursor-pointer ${
              disabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled}
              className="hidden"
            />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                selectedValue === option.value
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300 bg-white'
              } ${
                disabled
                  ? 'bg-gray-100 border-gray-300'
                  : 'hover:border-indigo-400'
              }`}
            >
              {selectedValue === option.value && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span
              className={`text-sm ${
                disabled ? 'text-gray-500' : 'text-gray-700'
              }`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
