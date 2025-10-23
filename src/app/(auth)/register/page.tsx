'use client';

import { useState } from 'react';
import {
  RoleSelection,
  AgencyRegistrationForm,
  EmployerRegistrationForm,
} from '@/app/features/auth';
import Link from 'next/link';
import { AuthPageLayout } from '@/app/components/layout/auth/AuthPageLayout';
import { MarketingSidebar } from '@/app/components/layout/auth/MarketingSidebar';
import { marketingContent } from '@/app/components/layout/auth/marketing-content';

interface RegistrationResult {
  error?: string;
  success?: boolean;
  redirectTo?: string;
}

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<
    'agency' | 'employer' | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentContent = () => {
    if (!selectedRole) return marketingContent.register;
    return marketingContent[selectedRole];
  };

  const handleAgencyRegistration = async (): Promise<RegistrationResult> => {
    setIsLoading(true);
    try {
      const result = await registerAgencyAction();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployerRegistration = async (): Promise<RegistrationResult> => {
    setIsLoading(true);
    try {
      const result = await registerEmployerAction();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <AuthPageLayout sidebar={<MarketingSidebar {...getCurrentContent()} />}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Join ShiftPilot
          </h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <RoleSelection onRoleSelect={setSelectedRole} />

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Already have an account?
            <Link
              href="/login"
              className="text-primary-600 font-semibold hover:text-primary-500 ml-1 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout sidebar={<MarketingSidebar {...getCurrentContent()} />}>
      {selectedRole === 'agency' ? (
        <AgencyRegistrationForm
          onBack={() => setSelectedRole(null)}
          onSubmit={handleAgencyRegistration}
          isLoading={isLoading}
        />
      ) : (
        <EmployerRegistrationForm
          onBack={() => setSelectedRole(null)}
          onSubmit={handleEmployerRegistration}
          isLoading={isLoading}
        />
      )}

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <p className="text-gray-600 text-sm">
          Already have an account?
          <Link
            href="/login"
            className="text-primary-600 font-semibold hover:text-primary-500 ml-1 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}

async function registerAgencyAction(): Promise<RegistrationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}

async function registerEmployerAction(): Promise<RegistrationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}
