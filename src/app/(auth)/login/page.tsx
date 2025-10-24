'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/app/features/auth';
import { AuthPageLayout } from '@/app/components/layout/auth/AuthPageLayout';
import { MarketingSidebar } from '@/app/components/layout/auth/MarketingSidebar';
import { marketingContent } from '@/app/components/layout/auth/marketing-content';
import Link from 'next/link';
import { type LoginFormData } from '@/lib/auth';
import { loginAction } from '@/lib/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(data);

      if (result.success && result.redirectTo) {
        // Use router.push for client-side navigation
        router.push(result.redirectTo);
        return { success: true };
      }

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { error: errorMessage };
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
          {`Don't have an account?`}
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
