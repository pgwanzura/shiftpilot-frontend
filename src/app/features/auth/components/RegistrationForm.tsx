// app/components/auth/RegistrationForm.tsx
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterFormData,
} from '@/lib/validations/schemas/auth';
import { useState } from 'react';
import Link from 'next/link';
import {
  FormInput,
  FormPasswordInput,
  FormCheckbox,
} from '@/app/components/forms';
import Button from '@/app/components/ui/buttons/Button';
import { Alert } from '@/app/components/ui';
import { GoogleIcon, LinkedInIcon } from '@/app/components/ui/Icons';

export default function RegistrationForm({
  onSubmit,
}: {
  onSubmit: (data: RegisterFormData) => Promise<void>;
}) {
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    setRegistrationError(null);
    setIsPending(true);

    try {
      await onSubmit(data);
    } catch (error) {
      console.log(error);
      // setRegistrationError(
      //   error instanceof Error ? error.message : "Registration failed"
      // );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Join ReferenceScope
      </h2>
      <p className="text-gray-600 mb-8">
        Create your professional trust profile
      </p>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {registrationError && (
            <Alert
              variant="error"
              message={registrationError}
              className="mb-4"
              dismissible
              onDismiss={() => setRegistrationError(null)}
            />
          )}

          <FormInput<RegisterFormData>
            name="name"
            label="Full name"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isPending}
          />

          <FormInput<RegisterFormData>
            name="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isPending}
          />

          <FormPasswordInput<RegisterFormData>
            name="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum 8 characters with at least one number
          </p>

          <FormPasswordInput<RegisterFormData>
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
          />

          <div className="flex items-start">
            <FormCheckbox
              name="terms"
              label="I agree to the Terms of Service and Privacy Policy"
              disabled={isPending}
              containerClassName="flex items-start"
              labelClassName="text-gray-700 text-sm"
            />
          </div>
          <div className="text-xs text-gray-600 mt-1 ml-6">
            By checking this box, you agree to our{' '}
            <Link
              href="/terms"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Privacy Policy
            </Link>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full font-semibold"
            disabled={isPending}
            loading={isPending}
          >
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isPending}
            >
              <LinkedInIcon className="w-5 h-5 mr-2" />
              LinkedIn
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isPending}
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              Sign in
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
