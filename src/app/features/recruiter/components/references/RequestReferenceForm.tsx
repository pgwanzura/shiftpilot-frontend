'use client';

import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  referenceRequestSchema,
  type ReferenceRequestFormData,
} from '@/lib/validations/schemas/referenceRequest';
import { useState } from 'react';
import {
  FormInput,
  FormSelect,
  FormRadio,
  FormArrayInput,
} from '@/app/components/forms';
import { NewCandidateModal } from '../candidates';
import { CandidateFormData } from '@/types/candidate';
import { Plus, Lightbulb, Trash2 } from 'lucide-react';
import { Icon } from '@/app/components/ui';

export interface CandidateOption {
  value: string;
  label: string;
}

export interface ReferenceTypeOption {
  value: string;
  label: string;
}

interface RequestReferenceFormProps {
  candidateOptions: CandidateOption[];
  referenceTypeOptions: ReferenceTypeOption[];
  onSubmit: (data: ReferenceRequestFormData) => Promise<void>;
  initialCredits?: number;
  onCandidateAdded?: (candidateData: CandidateFormData) => Promise<void>;
}

export default function RequestReferenceForm({
  candidateOptions,
  referenceTypeOptions,
  onSubmit,
  initialCredits = 42,
  onCandidateAdded,
}: RequestReferenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits] = useState(initialCredits);
  const [showQuestionSuggestions, setShowQuestionSuggestions] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null
  );

  const form = useForm({
    resolver: zodResolver(referenceRequestSchema),
    defaultValues: {
      candidate: '',
      referenceType: 'manager',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: '',
      questions: [
        "How would you describe the candidate's strengths?",
        'What areas could the candidate improve?',
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const handleSubmit = async (data: ReferenceRequestFormData) => {
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

  const addQuestion = () => {
    append(''); // Add empty question
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleAddCandidate = async (candidateData: CandidateFormData) => {
    if (onCandidateAdded) {
      await onCandidateAdded(candidateData);
    }

    // Add the new candidate to the dropdown options
    const newOption = {
      value: candidateData.email.toLowerCase().replace(/\s+/g, '-'),
      label: `${candidateData.firstName} ${candidateData.lastName} (${candidateData.position})`,
    };

    // In a real app, you would update the parent component's state
    // For now, we'll show a success message
    alert(
      `Candidate ${candidateData.firstName} ${candidateData.lastName} added successfully!`
    );
  };

  const addSuggestedQuestion = (question: string) => {
    append(question);
  };

  const clearAllQuestions = () => {
    if (window.confirm('Are you sure you want to clear all questions?')) {
      // Reset to initial state with two empty questions
      form.setValue('questions', ['', '']);

      // Remove any extra questions beyond the first two
      while (fields.length > 2) {
        remove(fields.length - 1);
      }
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="divide-y divide-gray-200"
          >
            {/* Candidate Selection Section */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Candidate
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <FormSelect
                        name="candidate"
                        options={[
                          { value: '', label: 'Select a candidate' },
                          ...candidateOptions,
                        ]}
                        required
                      />
                    </div>
                    <NewCandidateModal
                      onSave={handleAddCandidate}
                      triggerButton={
                        <button
                          type="button"
                          className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mt-2 sm:mt-0 w-full sm:w-auto"
                        >
                          <Plus className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">New Candidate</span>
                        </button>
                      }
                    />
                  </div>
                </div>

                {/* Reference Type - Responsive layout */}
                <div className="w-full overflow-x-auto pb-2 -mx-2 px-2">
                  <FormRadio
                    name="referenceType"
                    label="Reference Type"
                    options={referenceTypeOptions}
                    orientation="horizontal"
                    required
                    className="min-w-max"
                  />
                </div>
              </div>
            </div>

            {/* Referee Information Section */}
            <div className="p-4 sm:p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Referee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormInput
                  name="firstName"
                  label="First name"
                  type="text"
                  required
                />

                <FormInput
                  name="lastName"
                  label="Last name"
                  type="text"
                  required
                />

                <FormInput
                  name="email"
                  label="Email address"
                  type="email"
                  required
                />

                <FormInput name="phone" label="Phone (optional)" type="tel" />

                <div className="md:col-span-2">
                  <FormInput
                    name="relationship"
                    label="Relationship to Candidate"
                    type="text"
                    placeholder="E.g. Direct Manager, Team Lead, Colleague"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Reference Questions
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <span className="text-sm text-gray-500 sm:mr-2 py-1 sm:py-0">
                    {fields.length} question{fields.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowQuestionSuggestions(!showQuestionSuggestions)
                      }
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 flex-shrink-0"
                    >
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">Suggestions</span>
                    </button>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={clearAllQuestions}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Clear All</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 flex-shrink-0"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">Add Question</span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-1 text-sm text-gray-500 mb-4">
                Add specific questions for this referee to answer (optional).
              </p>

              {showQuestionSuggestions && (
                <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">
                    Suggested Questions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "How would you describe the candidate's strengths and weaknesses?",
                      "What was the candidate's most significant accomplishment?",
                      'How did the candidate handle pressure or stressful situations?',
                      'Would you work with this candidate again? Why or why not?',
                      'How did the candidate contribute to team dynamics?',
                      'What areas could the candidate improve professionally?',
                    ].map((question, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => addSuggestedQuestion(question)}
                        className="text-left p-2 text-xs sm:text-sm text-blue-800 bg-blue-100 hover:bg-blue-200 rounded transition-colors break-words"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start p-3 rounded-lg bg-white border border-gray-200"
                  >
                    <div className="flex-shrink-0 mt-2 mr-3">
                      <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <FormArrayInput
                        name="questions"
                        index={index}
                        placeholder="Enter your question here"
                        onFocus={() => setActiveQuestionIndex(index)}
                        onBlur={() => setActiveQuestionIndex(null)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="ml-2 mt-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      disabled={fields.length <= 1}
                      title="Remove question"
                    >
                      <Icon name="closeX" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {activeQuestionIndex !== null && (
                <div className="mt-2 text-xs text-gray-500 text-right">
                  {form.watch(`questions.${activeQuestionIndex}`)?.length || 0}{' '}
                  characters
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 sm:p-6 bg-red-50 border-t border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-gray-500">
                  <p>
                    This request will use{' '}
                    <span className="font-bold">1 credit</span> when the
                    reference is submitted.
                  </p>
                  <p>
                    You have{' '}
                    <span className="font-bold">{credits} credits</span>{' '}
                    remaining.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 order-2 sm:order-1"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 disabled:opacity-50 order-1 sm:order-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📨</span>
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </FormProvider>
    </>
  );
}
