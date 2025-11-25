// components/ui/forms/Select.tsx
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { FieldWrapper } from './FieldWrapper';
import {
  baseInputClasses,
  iconLeftClasses,
  iconRightClasses,
} from './field-styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  description?: string;
  options: SelectOption[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      description,
      options,
      leftIcon,
      rightIcon,
      onChange,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const selectId = React.useId();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      null
    );
    const selectRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
    const paddingRight = 'pr-10';

    const selectClasses = `
      ${baseInputClasses}
      ${paddingLeft}
      ${paddingRight}
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${props.disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
      cursor-pointer select-none
      ${className}
    `
      .replace(/\s+/g, ' ')
      .trim();

    // Initialize selected option
    useEffect(() => {
      if (props.value !== undefined) {
        const option = options.find((opt) => opt.value === props.value) || null;
        setSelectedOption(option);
      } else if (props.defaultValue !== undefined) {
        const option =
          options.find((opt) => opt.value === props.defaultValue) || null;
        setSelectedOption(option);
      } else {
        setSelectedOption(options[0] || null);
      }
    }, [props.value, props.defaultValue, options]);

    const handleOptionClick = (option: SelectOption) => {
      if (option.disabled) return;

      setSelectedOption(option);
      setIsOpen(false);
      onChange?.(option.value);

      // Trigger change on hidden select for form compatibility
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = option.value;
        hiddenSelectRef.current.dispatchEvent(
          new Event('change', { bubbles: true })
        );
      }
    };

    const handleToggle = () => {
      if (!props.disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      } else if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayValue = selectedOption?.label || 'Select an option';

    return (
      <FieldWrapper
        label={label}
        error={error}
        description={description}
        htmlFor={selectId}
        required={props.required}
        className={containerClassName}
      >
        {/* Hidden native select for form submission */}
        <select
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            hiddenSelectRef.current = node;
          }}
          id={selectId}
          value={selectedOption?.value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom select UI */}
        <div className="relative" ref={selectRef}>
          {leftIcon && <div className={iconLeftClasses}>{leftIcon}</div>}

          {/* Select trigger */}
          <button
            type="button"
            className={selectClasses}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            disabled={props.disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? `${selectId}-label` : undefined}
          >
            <span className="block truncate text-left">{displayValue}</span>
          </button>

          {rightIcon && <div className={iconRightClasses}>{rightIcon}</div>}

          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
              <div className="py-1" role="listbox">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-colors duration-150
                      ${
                        option.disabled
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      ${
                        selectedOption?.value === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                          : ''
                      }
                    `}
                    onClick={() => handleOptionClick(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selectedOption?.value === option.value}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block truncate">{option.label}</span>
                      {selectedOption?.value === option.value && (
                        <svg
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

Select.displayName = 'Select';
