'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/app/components/ui';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  className?: string;
  options: SelectOption[];
  required?: boolean;
  value?: string;
  defaultValue?: string;
  error?: string;
  description?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  labelClassName?: string;
}

export default function Select({
  name,
  label,
  className = '',
  options,
  required,
  value,
  defaultValue,
  error,
  description,
  onChange,
  disabled = false,
  labelClassName = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const getDisplayLabel = () => {
    if (!currentValue) {
      return 'Select an option';
    }
    const selectedOption = options.find(
      (option) => option.value === currentValue
    );
    return selectedOption ? selectedOption.label : currentValue;
  };

  const selectedIndex = options.findIndex(
    (option) => option.value === currentValue
  );

  const navigableOptions = options.filter((option) => option.value !== '');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const newIndex =
        selectedIndex >= 0
          ? navigableOptions.findIndex(
              (opt) => opt.value === options[selectedIndex]?.value
            )
          : 0;
      setHighlightedIndex(newIndex);

      setTimeout(() => listboxRef.current?.focus(), 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, selectedIndex, navigableOptions, options]);

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case ' ':
      case 'Enter':
      case 'ArrowDown':
        event.preventDefault();
        setIsOpen(true);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleListboxKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case 'Tab':
        setIsOpen(false);
        break;

      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex >= navigableOptions.length ? 0 : nextIndex;
        });
        break;

      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev - 1;
          return nextIndex < 0 ? navigableOptions.length - 1 : nextIndex;
        });
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < navigableOptions.length
        ) {
          handleSelect(navigableOptions[highlightedIndex].value);
        }
        break;

      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setHighlightedIndex(navigableOptions.length - 1);
        break;
    }
  };

  const handleOptionMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const handleOptionMouseLeave = () => {
    setHighlightedIndex(
      selectedIndex >= 0
        ? navigableOptions.findIndex(
            (opt) => opt.value === options[selectedIndex]?.value
          )
        : -1
    );
  };

  return (
    <div className="w-full relative" ref={selectRef}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-semibold mb-1 text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          name={name}
          value={currentValue}
          onChange={(e) => handleSelect(e.target.value)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          disabled={disabled}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          ref={buttonRef}
          type="button"
          id={name}
          className={`
            relative w-full rounded-lg border px-4 py-3
            text-left text-base font-medium
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            bg-white
            flex items-center justify-between
            transition-colors duration-200
            ${
              disabled
                ? 'bg-gray-100 cursor-not-allowed opacity-70 text-gray-500'
                : 'cursor-pointer hover:border-gray-400'
            }
            ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }
            ${!currentValue ? 'text-gray-500' : 'text-gray-900'}
            ${className}
          `}
          onClick={handleButtonClick}
          onKeyDown={handleButtonKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${name}-label` : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          disabled={disabled}
        >
          <span className="truncate">{getDisplayLabel()}</span>
          <div className="pointer-events-none flex items-center ml-2">
            <Icon
              name="chevronDown"
              className={`h-4 w-4 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              } ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
            />
          </div>
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            className="absolute z-50 w-full mt-1 rounded-lg bg-white py-1 shadow-lg border border-gray-200 max-h-60 overflow-auto focus:outline-none"
            role="listbox"
            aria-labelledby={label ? `${name}-label` : undefined}
            tabIndex={-1}
            onKeyDown={handleListboxKeyDown}
          >
            {options.map((option) => {
              const isSelected = currentValue === option.value;
              const isNavigableOption = option.value !== '';
              const navigableIndex = isNavigableOption
                ? navigableOptions.findIndex(
                    (opt) => opt.value === option.value
                  )
                : -1;
              const isHighlighted = navigableIndex === highlightedIndex;

              if (option.value === '') {
                return (
                  <li
                    key="empty-option"
                    role="option"
                    aria-selected={isSelected}
                    className="py-3 px-4 text-gray-500 cursor-default select-none text-base"
                  >
                    {option.label}
                  </li>
                );
              }

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`
                    relative cursor-pointer select-none py-3 px-4
                    transition-colors duration-200 text-base
                    ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 font-medium'
                        : 'text-gray-900'
                    }
                    ${
                      isHighlighted && !isSelected
                        ? 'bg-gray-50 text-gray-900'
                        : ''
                    }
                    hover:bg-gray-50
                  `}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => handleOptionMouseEnter(navigableIndex)}
                  onMouseLeave={handleOptionMouseLeave}
                >
                  <span className="block truncate">{option.label}</span>
                  {isSelected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <Icon name="check" size={16} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
