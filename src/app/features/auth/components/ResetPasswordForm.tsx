'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/auth/schemas';
import { Form, FormInput } from '@/app/components/forms';
import { Button } from '@/app/components/ui/buttons';

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  isLoading: boolean;
  email: string;
}

export default function ResetPasswordForm({
  onSubmit,
  isLoading,
  email,
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          name="password"
          type="password"
          label="New password"
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <FormInput
          name="confirmPassword"
          type="password"
          label="Confirm new password"
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          variant="gradient"
          size="lg"
        >
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </Form>
  );
}
