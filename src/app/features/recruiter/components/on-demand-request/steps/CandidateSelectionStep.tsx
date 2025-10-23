import Image from 'next/image';
import { Icon } from '@/app/components/ui';
import CandidateSelectionButton from '@/app/components/ui/buttons/CandidateSelectionButton'; // Adjust the import path

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  position: string;
  team: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  references: {
    completed: number;
    total: number;
    status: string;
  };
  echoTrust: {
    score: number | string;
    ranking: string;
  };
  lastUpdated: string;
  skills?: string[];
  experience?: string;
}

interface CandidateSelectionStepProps {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
}

export default function CandidateSelectionStep({
  candidates,
  onSelect,
}: CandidateSelectionStepProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-8 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Select a Candidate
      </h2>
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <CandidateSelectionButton
            key={candidate.id}
            candidate={candidate}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
