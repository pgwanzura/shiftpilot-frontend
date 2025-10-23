// app/components/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/buttons/Button';
import { Icon } from '@/app/components/ui';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="gradient"
      icon={<Icon name="arrowLeft" className="w-4 h-4" />}
      className="w-full min-w-[140px] shadow-sm hover:shadow-md transition-shadow"
      onClick={() => router.back()}
    >
      Go Back
    </Button>
  );
}
