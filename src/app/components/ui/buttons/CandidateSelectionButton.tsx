import Image from 'next/image';
import { Icon } from '@/app/components/ui';

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

interface CandidateSelectionButtonProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  className?: string;
  showStatus?: boolean;
  showEchoTrust?: boolean;
  showChevron?: boolean;
}

export default function CandidateSelectionButton({
  candidate,
  onSelect,
  className = '',
  showStatus = true,
  showEchoTrust = true,
  showChevron = true,
}: CandidateSelectionButtonProps) {
  const statusStyles = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
    archived: 'bg-red-100 text-red-800',
  };

  const handleClick = () => {
    onSelect(candidate);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left bg-white border-2 border-gray-100 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${className}`}
      type="button"
      aria-label={`Select candidate ${candidate.name}`}
    >
      <div className="flex items-center">
        <Image
          src={candidate.avatar}
          alt={candidate.name}
          width={56}
          height={56}
          className="rounded-full mr-5 flex-shrink-0"
          priority={false}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {candidate.name}
          </h3>
          <p className="text-gray-600 truncate">{candidate.position}</p>
          <p className="text-sm text-gray-500 truncate">{candidate.email}</p>

          {(showStatus || showEchoTrust) && (
            <div className="flex items-center mt-3 flex-wrap gap-2">
              {showStatus && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    statusStyles[candidate.status]
                  }`}
                >
                  {candidate.status.charAt(0).toUpperCase() +
                    candidate.status.slice(1)}
                </span>
              )}

              {showEchoTrust && candidate.echoTrust.score !== '-' && (
                <span className="text-sm text-gray-500">
                  EchoTrust: {candidate.echoTrust.score} (
                  {candidate.echoTrust.ranking})
                </span>
              )}
            </div>
          )}
        </div>

        {showChevron && (
          <Icon
            name="chevronRight"
            className="text-gray-400 w-5 h-5 flex-shrink-0 ml-2"
          />
        )}
      </div>
    </button>
  );
}
