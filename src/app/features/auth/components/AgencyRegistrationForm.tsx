// app/components/forms/agency-registration-form.tsx
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
import {
  registrationStep1Schema,
  agencyStep2Schema,
  type RegistrationStep1Data,
  type AgencyStep2Data,
  type AgencyRegistrationData,
} from '@/lib/auth/schemas';
import Link from 'next/link';

interface RegistrationResponse {
  error?: string;
  success?: boolean;
}

interface AgencyRegistrationFormProps {
  onSubmit: (
    data: AgencyRegistrationData
  ) => Promise<RegistrationResponse | void>;
  onBack?: () => void;
  isLoading?: boolean;
}

type Step = 1 | 2;

export default function AgencyRegistrationForm({
  onSubmit,
  onBack,
  isLoading = false,
}: AgencyRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [isPending, setIsPending] = useState<boolean>(false);
  const [step1Data, setStep1Data] = useState<RegistrationStep1Data | null>(
    null
  );

  const step1Form = useForm<RegistrationStep1Data>({
    resolver: zodResolver(registrationStep1Schema),
  });

  const step2Form = useForm<AgencyStep2Data>({
    resolver: zodResolver(agencyStep2Schema),
    defaultValues: {
      terms: false,
    },
  });

  useEffect(() => {
    if (step1Data?.email) {
      step2Form.setValue('billing_email', step1Data.email);

      const emailDomain = step1Data.email.split('@')[1];
      if (emailDomain) {
        const companyName = emailDomain.split('.')[0];
        step2Form.setValue(
          'company_name',
          companyName.charAt(0).toUpperCase() + companyName.slice(1)
        );
      }
    }
  }, [step1Data, step2Form]);

  const handleStep1Submit = async (data: RegistrationStep1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = async (data: AgencyStep2Data) => {
    if (!step1Data) return;

    setRegistrationError(null);
    setIsPending(true);

    try {
      const completeData: AgencyRegistrationData = {
        ...step1Data,
        ...data,
        role: 'agency_admin' as const,
      };

      const result = await onSubmit(completeData);

      if (result?.error) {
        console.error(
          '[REGISTRATION] Agency registration failed:',
          result.error
        );
        setRegistrationError(result.error);
        setIsPending(false);
        return;
      }

      if (result?.success) {
        console.log('[REGISTRATION] Agency registration successful');
      } else {
        setIsPending(false);
      }
    } catch (error: unknown) {
      console.error(
        '[REGISTRATION] Unexpected error during registration:',
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setRegistrationError(errorMessage);
      setIsPending(false);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div
          className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}
          >
            1
          </div>
          <span className="ml-2 text-sm font-medium">Account</span>
        </div>
        <div
          className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}
        ></div>
        <div
          className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium">Agency Details</span>
        </div>
      </div>

      {registrationError && (
        <Alert
          variant="error"
          message={registrationError}
          className="mb-4"
          dismissible
          onDismiss={() => setRegistrationError(null)}
        />
      )}

      {/* Step 1: Ultra-minimal Account Creation */}
      {currentStep === 1 && (
        <Form
          form={step1Form}
          onSubmit={handleStep1Submit}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Start Your Agency Account
            </h3>
            <p className="text-gray-600 mt-1">Get started in seconds</p>
          </div>

          <FormInput
            name="email"
            label="Work Email"
            type="email"
            placeholder="you@agency.com"
            autoComplete="email"
            required
            disabled={isLoading}
          />

          <FormPasswordInput
            name="password"
            label="Password"
            placeholder="Create a password"
            required
            disabled={isLoading}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium">Quick Start</p>
                <p className="text-sm text-blue-700 mt-1">
                  {`We'll help you fill in agency details in the next step`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            {onBack && (
              <Button
                type="button"
                variant="primary-outline"
                onClick={onBack}
                className="flex-1"
                disabled={isLoading}
              >
                Back to Role Selection
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={isLoading}
            >
              Next
            </Button>
          </div>
        </Form>
      )}

      {/* Step 2: Complete Agency Details */}
      {currentStep === 2 && (
        <Form
          form={step2Form}
          onSubmit={handleStep2Submit}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Complete Your Agency Profile
            </h3>
            <p className="text-gray-600 mt-1">
              Almost there! Just a few more details
            </p>
          </div>

          <FormInput
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            required
            disabled={isLoading}
          />

          <FormInput
            name="company_name"
            label="Agency Name"
            type="text"
            placeholder="Enter your agency name"
            required
            disabled={isLoading}
          />

          <FormInput
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
            disabled={isLoading}
          />

          <FormInput
            name="billing_email"
            label="Billing Email"
            type="email"
            placeholder="billing@agency.com"
            required
            disabled={isLoading}
          />

          <FormInput
            name="address"
            label="Address"
            type="text"
            placeholder="Street address"
            required
            disabled={isLoading}
          />

          <FormInput
            name="city"
            label="City"
            type="text"
            placeholder="City"
            required
            disabled={isLoading}
          />

          <FormInput
            name="country"
            label="Country"
            type="text"
            placeholder="Country"
            required
            disabled={isLoading}
          />

          <FormCheckbox
            name="terms"
            label={
              <span>
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                  target="_blank"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                  target="_blank"
                >
                  Privacy Policy
                </Link>{' '}
                *
              </span>
            }
            required
            disabled={isLoading}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="primary-outline"
              onClick={handleBackToStep1}
              className="flex-1"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending || isLoading}
              size="lg"
            >
              {isPending ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
