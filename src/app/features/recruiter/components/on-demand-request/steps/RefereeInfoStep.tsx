// RefereeInfoStep.tsx
import { RefereeInfoSection } from '@/app/components/forms/sections/RefereeInfoSection';

interface RefereeInfoStepProps {
  form: any;
}

export default function RefereeInfoStep({ form }: RefereeInfoStepProps) {
  return (
    <RefereeInfoSection
      form={form}
      canEdit={true}
      minReferees={1}
      maxReferees={5}
    />
  );
}
