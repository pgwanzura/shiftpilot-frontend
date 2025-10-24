'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button } from '@/app/components/ui';
import {
  Form,
  FormInput,
  FormPasswordInput,
  FormCheckbox,
} from '@/app/components/forms';
import { loginSchema, type LoginFormData } from '@/lib/auth';
import Link from 'next/link';

interface LoginFormProps {
  onSubmit: (
    data: LoginFormData
  ) => Promise<{ error?: string; success?: boolean } | void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginForm({
  onSubmit,
  isLoading = false,
  error = null,
}: LoginFormProps) {
  const [loginError, setLoginError] = useState<string | null>(error);

  useEffect(() => {
    setLoginError(error);
  }, [error]);

  // Type assertion to fix the TypeScript compatibility issue
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const handleFormSubmit = async (data: LoginFormData): Promise<void> => {
    setLoginError(null);

    try {
      const result = await onSubmit(data);

      if (result?.error) {
        console.error('[LOGIN] Login failed:', result.error);
        setLoginError(result.error);
        return;
      }

      if (result?.success) {
        console.log('[LOGIN] Login successful');
      }
    } catch (error: unknown) {
      console.error('[LOGIN] Unexpected error during login:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setLoginError(errorMessage);
    }
  };

  return (
    <Form form={form} onSubmit={handleFormSubmit} className="space-y-6">
      {loginError && (
        <Alert
          variant="error"
          message={loginError}
          className="mb-4"
          dismissible
          onDismiss={() => setLoginError(null)}
        />
      )}

      <FormInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        disabled={isLoading}
      />

      <FormPasswordInput
        name="password"
        label="Password"
        placeholder="Enter your password"
        required
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <FormCheckbox
          name="remember"
          label="Remember me"
          disabled={isLoading}
        />
        <Link
          href="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
        loading={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              New to ShiftPilot?
            </span>
          </div>
        </div>
      </div>
    </Form>
  );
}
