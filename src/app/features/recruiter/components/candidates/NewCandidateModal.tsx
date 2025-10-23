'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@/app/components/ui';
import Button from '@/app/components/ui/buttons/Button';
import { FormInput, FormSelect, FormTextarea } from '@/app/components/forms';
import { candidateFormSchema } from '@/lib/validations/schemas/candidate';

type CandidateFormData = z.infer<typeof candidateFormSchema>;

// Update the interface to match the actual form data structure
interface NewCandidateModalProps {
  onSave: (candidateData: {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    team: string;
    notes?: string;
  }) => Promise<void>;
}

const teamOptions = [
  { value: '', label: 'Select team...' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Product', label: 'Product' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Data Science', label: 'Data Science' },
];

export default function NewCandidateModal({ onSave }: NewCandidateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      team: '',
      notes: '',
    },
  });

  const {
    formState: { isValid },
    reset,
  } = methods;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
    setIsSubmitting(false);
  };

  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    try {
      // Transform the data to match what the onSave function expects
      await onSave({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        position: data.position,
        team: data.team,
        notes: data.notes || undefined, // Convert empty string to undefined
      });
      handleClose();
    } catch (error) {
      console.error('Failed to save candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleOpen}
        className="inline-flex items-center"
      >
        <Icon name="plus" className="h-4 w-4 mr-1.5" />
        Add Candidate
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <Icon name="x" className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                    Add New Candidate
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {`Enter the candidate's information to start the reference
                    process.`}
                  </p>

                  <FormProvider {...methods}>
                    <form
                      onSubmit={methods.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput<CandidateFormData>
                          name="firstName"
                          label="First Name"
                          type="text"
                          placeholder="Enter first name"
                        />
                        <FormInput<CandidateFormData>
                          name="lastName"
                          label="Last Name"
                          type="text"
                          placeholder="Enter last name"
                        />
                      </div>

                      <FormInput<CandidateFormData>
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter email address"
                      />

                      <FormInput<CandidateFormData>
                        name="position"
                        label="Position"
                        type="text"
                        placeholder="Enter position"
                      />

                      <FormSelect<CandidateFormData>
                        name="team"
                        label="Team"
                        options={teamOptions}
                      />

                      <FormTextarea<CandidateFormData>
                        name="notes"
                        label="Notes (Optional)"
                        placeholder="Add any additional notes about this candidate..."
                        rows={3}
                      />

                      <div className="mt-6 flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleClose}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="gradient"
                          disabled={isSubmitting || !isValid}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Adding...
                            </>
                          ) : (
                            'Add Candidate'
                          )}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
