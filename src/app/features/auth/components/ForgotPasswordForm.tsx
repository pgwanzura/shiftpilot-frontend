'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormInput } from '@/app/components/forms';
import { Button } from '@/app/components/ui';
import { forgotPasswordSchema } from '@/lib/auth/schemas';

interface ForgotPasswordResponse {
  success?: boolean;
  error?: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (data: { email: string }) => Promise<ForgotPasswordResponse>;
}

export default function ForgotPasswordForm({
  onSubmit,
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await onSubmit(data);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      {success ? (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <p className="text-sm text-green-600">
            Password reset link sent! Check your email.
          </p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : null}

      <div className="text-sm text-gray-600 mb-4">
        {`Enter your email address and we'll send you a link to reset your password.`}
      </div>

      <FormInput
        name="email"
        type="email"
        label="Email address"
        placeholder="your@email.com"
        autoComplete="email"
      />

      <Button type="submit" className="w-full mt-0">
        {isLoading ? 'Sending email...' : 'Send reset link'}
      </Button>

      <div className="text-center text-sm text-gray-600 mt-4">
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary/80"
        >
          Back to sign in
        </Link>
      </div>
    </Form>
  );
}
