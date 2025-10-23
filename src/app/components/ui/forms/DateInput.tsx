'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/app/components/ui';

export interface DateInputProps {
  name: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DateInput({
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(value || '');
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const selectRef = useRef<HTMLDivElement>(null);

  const today = new Date();

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days: (number | null)[] = [];
    const firstDay = date.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return days;
  };

  const handleSelectDate = (day: number | null) => {
    if (!day) {
      setSelectedDate('');
      onChange?.('');
      return;
    }
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    setSelectedDate(dateStr);
    onChange?.(dateStr);
    setIsOpen(false);
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      return true;
    if (min && date < new Date(min)) return true;
    if (max && date > new Date(max)) return true;
    return false;
  };

  return (
    <div className={`w-full relative ${className}`} ref={selectRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <button
        id={name}
        type="button"
        className={`
          mt-1 block w-full rounded-md border py-2 pl-3 pr-10
          text-base font-medium text-gray-900 shadow-sm
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500
          sm:text-sm
          bg-white
          flex items-center
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}
          border-gray-300
          relative
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate text-left flex-1">
          {selectedDate
            ? `${String(new Date(selectedDate).getDate()).padStart(
                2,
                '0'
              )}/${String(new Date(selectedDate).getMonth() + 1).padStart(
                2,
                '0'
              )}/${new Date(selectedDate).getFullYear()}`
            : 'Select a date'}
        </span>
        <span className="absolute right-3 flex items-center h-full">
          <Icon name="calendar" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 rounded-lg bg-white shadow-xl border border-gray-200 p-4 min-w-[280px] max-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon name="chevronLeft" />
            </button>
            <div className="font-semibold text-gray-700 text-sm">
              {new Date(currentYear, currentMonth).toLocaleString('default', {
                month: 'long',
              })}{' '}
              {currentYear}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon name="chevronRight" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();
              const isSelected =
                selectedDate ===
                `${currentYear}-${String(currentMonth + 1).padStart(
                  2,
                  '0'
                )}-${String(day).padStart(2, '0')}`;
              const disabledDay = isDateDisabled(day);

              return (
                <button
                  key={idx}
                  className={`
                    h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all
                    ${
                      disabledDay
                        ? 'cursor-not-allowed text-gray-300'
                        : 'cursor-pointer'
                    }
                    ${
                      isToday && !isSelected
                        ? 'border border-indigo-300 text-indigo-600'
                        : ''
                    }
                    ${isSelected ? 'bg-indigo-600 text-white shadow-md' : ''}
                    ${
                      !isSelected && !disabledDay
                        ? 'hover:bg-indigo-50 hover:text-indigo-700'
                        : ''
                    }
                  `}
                  onClick={() => !disabledDay && handleSelectDate(day)}
                  disabled={disabledDay}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => handleSelectDate(today.getDate())}
              className="text-xs text-indigo-600 hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleSelectDate(null)}
              className="text-xs text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
