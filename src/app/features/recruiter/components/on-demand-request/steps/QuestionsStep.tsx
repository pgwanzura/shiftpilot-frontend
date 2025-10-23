import {
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import { useState } from 'react';
import { QuestionsSection } from '@/app/components/forms/sections/QuestionsSection';

interface QuestionsFormValues {
  questions: string[];
  referenceType: 'professional' | 'academic' | 'character' | 'skill-specific';
}

interface QuestionsStepProps {
  form: {
    control: Control<QuestionsFormValues>;
    watch: UseFormWatch<QuestionsFormValues>;
    setValue: UseFormSetValue<QuestionsFormValues>;
    getValues: UseFormGetValues<QuestionsFormValues>;
    formState?: any; // Add formState if available
  };
}

// Simple version that uses QuestionsSection directly
export default function QuestionsStep({ form }: QuestionsStepProps) {
  const [showQuestionSuggestions, setShowQuestionSuggestions] = useState(false);

  // Since we can't easily adapt the form methods, let's use QuestionsSection
  // with a wrapper that handles the compatibility
  return (
    <div className="animate-fade-in">
      <QuestionsSection
        form={form as any} // Temporary workaround - you might need to adjust QuestionsSection props
        fieldArray={{
          fields: (form.watch('questions') || []).map((_, index) => ({
            id: `field-${index}`,
          })),
          append: (value: string) => {
            const current = form.getValues('questions') || [];
            form.setValue('questions', [...current, value]);
          },
          remove: (index: number) => {
            const current = form.getValues('questions') || [];
            if (current.length > 1) {
              form.setValue(
                'questions',
                current.filter((_, i) => i !== index)
              );
            }
          },
          replace: (newArray: string[]) => {
            form.setValue('questions', newArray);
          },
          update: (index: number, value: string) => {
            const current = form.getValues('questions') || [];
            const updated = [...current];
            updated[index] = value;
            form.setValue('questions', updated);
          },
          insert: (index: number, value: string) => {
            const current = form.getValues('questions') || [];
            const updated = [
              ...current.slice(0, index),
              value,
              ...current.slice(index),
            ];
            form.setValue('questions', updated);
          },
          move: () => {}, // Not implemented
          swap: () => {}, // Not implemented
        }}
        canEdit={true}
        maxQuestions={10}
        minQuestions={1}
        title="Reference Questions"
        description="Add specific questions for this referee to answer (optional)."
        showHeader={true}
        externalState={{
          showQuestionSuggestions,
          setShowQuestionSuggestions,
        }}
      />
    </div>
  );
}
