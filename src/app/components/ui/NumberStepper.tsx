'use client';

import React from 'react';
import { Icon } from '@/app/components/ui';

export interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 5,
  label,
  className = '',
}: NumberStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="inline-flex items-center border border-indigo-300 rounded-md overflow-hidden shadow-sm">
        {/* Minus Button */}
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 transition-colors"
        >
          <Icon name="minus" className="h-5 w-5" />
        </button>

        {/* Number Input */}
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="w-16 text-center border-x border-indigo-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 no-spinner"
        />

        {/* Plus Button */}
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 transition-colors"
        >
          <Icon name="plus" className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        (Min {min}, Max {max})
      </p>
    </div>
  );
}
