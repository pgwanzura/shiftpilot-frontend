interface Candidate {
  id: string;
  name: string;
  position: string;
}

interface QuickReferenceRequestsProps {
  candidates: Candidate[];
  onAddReferee: (candidateId: string) => void;
  onViewAllCandidates: () => void;
}

export default function QuickReferenceRequests({
  candidates,
  onAddReferee,
  onViewAllCandidates,
}: QuickReferenceRequestsProps) {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Quick Reference Requests
        </h2>
      </div>
      <div className="px-6 py-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {candidate.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {candidate.position}
              </p>
            </div>
            <button
              onClick={() => onAddReferee(candidate.id)}
              className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
            >
              <i className="fas fa-user-plus mr-1"></i> Add Referee
            </button>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-gray-50 text-right">
        <button
          onClick={onViewAllCandidates}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all candidates
        </button>
      </div>
    </div>
  );
}
