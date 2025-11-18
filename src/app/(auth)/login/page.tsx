'use client';
     
import { useState } from 'react';
import { LoginForm } from '@/app/features/auth';
import { AuthPageLayout } from '@/app/components/layout/auth/AuthPageLayout';
import { MarketingSidebar } from '@/app/components/layout/auth/MarketingSidebar';
import { marketingContent } from '@/app/components/layout/auth/marketing-content';
import Link from 'next/link';
import { type LoginFormData } from '@/lib/auth';
import { loginAction, type AuthActionResult } from '@/lib/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (
    data: LoginFormData
  ): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(data);

      if (result.success && result.redirectTo) {
        window.location.href = result.redirectTo;
        return { success: true };
      }

      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout sidebar={<MarketingSidebar {...marketingContent.login} />}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600">Sign in to your ShiftPilot account</p>
      </div>

      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="text-primary-600 font-semibold hover:text-primary-500 ml-1 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>

      <FooterLinks />
    </AuthPageLayout>
  );
}

function FooterLinks() {
  return (
    <div className="mt-8 text-center text-sm text-gray-600">
      <p>© 2024 ShiftPilot. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
          Privacy
        </Link>
        <Link href="/terms" className="text-gray-500 hover:text-gray-700">
          Terms
        </Link>
      </div>
    </div>
  );
}
