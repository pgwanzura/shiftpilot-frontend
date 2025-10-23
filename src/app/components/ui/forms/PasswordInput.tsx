'use client';

import { forwardRef, useState } from 'react';
import { Icon } from '@/app/components/ui';
import { Input, InputProps } from '@/app/components/ui/forms';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  name: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ name, label, className = '', error, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          name={name}
          label={label}
          type={showPassword ? 'text' : 'password'}
          error={error}
          required={required}
          className={`pr-10 ${className}`}
          {...props}
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={!hasValue}
          className="absolute right-3 top-1/2 transform disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon
            name={showPassword ? 'eyeOff' : 'eye'}
            size="sm"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          />
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
