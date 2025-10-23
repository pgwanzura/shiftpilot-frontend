import { RequestDetailsSection } from '@/app/components/forms/sections/RequestDetailsSection';
import { UseFormReturn } from 'react-hook-form';
import { OnDemandRequestFormData } from '@/lib/validations/schemas/onDemandRequest';
import { Candidate } from '@/types/candidate';

interface RequestDetailsStepProps {
  selectedCandidate: Candidate;
  form: UseFormReturn<OnDemandRequestFormData>;
  onReferenceTypeChange: (value: string) => void;
}

export default function RequestDetailsStep({
  selectedCandidate,
  form,
  onReferenceTypeChange,
}: RequestDetailsStepProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 animate-fade-in">
      <RequestDetailsSection
        form={form}
        candidate={selectedCandidate}
        canEdit={true}
        onReferenceTypeChange={onReferenceTypeChange}
        showHeader={false}
      />
    </div>
  );
}
