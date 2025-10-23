'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  referenceSchema,
  type ReferenceFormData,
} from '@/lib/validations/schemas/reference';
import { useState } from 'react';
import { FormInput } from '@/app/components/forms/fields/FormInput';
import { Select } from '@/app/components/ui/forms/Select';
import { Checkbox } from '@/app/components/form/elements/Checkbox';
import { Textarea } from '@/app/components/ui/forms/Textarea';

export function ReferenceForm({
  onSubmit,
}: {
  onSubmit: (data: ReferenceFormData) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ReferenceFormData>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      name: '',
      email: '',
      jobTitle: '',
      company: '',
      relationship: '',
      timeKnown: '',
      confidential: false,
      reminders: true,
      message: '',
    },
  });

  const handleSubmit = async (data: ReferenceFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <FormInput name="name" label="Full Name" />
        <div>
          <FormInput name="email" type="email" label="Email address" />
          <p className="mt-1 text-xs text-gray-500">
            {`We'll send a secure submission link to this address`}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput name="jobTitle" label="Job Title" />
          <FormInput name="company" label="Company" />
        </div>
        <div className="space-y-6">
          <Select
            name="relationship"
            label="Professional Relationship"
            options={[
              { value: '', label: 'Select relationship' },
              { value: 'manager', label: 'Manager/Supervisor' },
              { value: 'peer', label: 'Peer/Colleague' },
              { value: 'report', label: 'Direct Report' },
              { value: 'mentor', label: 'Mentor' },
              { value: 'client', label: 'Client/Customer' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Select
            name="timeKnown"
            label="Time worked together"
            options={[
              { value: '', label: 'Select duration' },
              { value: '<6mo', label: 'Less than 6 months' },
              { value: '6-12mo', label: '6-12 months' },
              { value: '1-2yr', label: '1-2 years' },
              { value: '2-5yr', label: '2-5 years' },
              { value: '5+yr', label: 'More than 5 years' },
            ]}
          />
        </div>
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Reference Settings
          </h3>
        </div>
        <div className="space-y-4">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <Checkbox
                name="confidential"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                containerClassName="flex items-center h-5"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="confidential"
                className="font-medium text-gray-700"
              >
                Confidential Reference
              </label>
              <p className="text-gray-500">
                Hide reference content from me after submission (only recruiters
                will see it)
              </p>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <Checkbox
                name="reminders"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                containerClassName="flex items-center h-5"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="reminders" className="font-medium text-gray-700">
                Send Reminders
              </label>
              <p className="text-gray-500">
                Automatically remind referee if not submitted within 3 days
              </p>
            </div>
          </div>
        </div>
        <Textarea
          name="message"
          label="Personal message (optional)"
          rows={4}
          placeholder="Add a personal note to your referee..."
        />
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 
               rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent 
               shadow-sm text-sm font-medium rounded-md text-white 
               bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
