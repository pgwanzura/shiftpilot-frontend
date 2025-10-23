'use client';

import Image from 'next/image';
import { FormInput } from '@/app/components/forms/fields/FormInput';
import { useForm, FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  profileImage: string;
}

export default function ProfileForm({
  defaultValues,
  profileImage,
}: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    defaultValues,
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Submitted data:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="px-6 py-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Profile Photo */}
            <div className="md:w-1/3">
              <label className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-2 flex items-center">
                <div className="relative">
                  <Image
                    className="h-16 w-16 rounded-full object-cover"
                    src={profileImage}
                    alt="Profile"
                    width={64}
                    height={64}
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-gray-300 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <button
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="mt-4 md:mt-0 md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="firstName" label="First name" />
                <FormInput name="lastName" label="Last name" />
                <FormInput name="email" type="email" label="Email address" />
                <FormInput name="phone" type="tel" label="Phone number" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
