'use client';

import Image from 'next/image';
import { Icon } from '@/app/components/ui/Icons';
import Pill from '@/app/components/ui/data-display/Pill';

interface ReferenceProfile {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  candidatePosition: string;
  verificationLevel: number;
  confidentialityLevel: 'sensitive' | 'public' | 'standard';
  refereeName: string;
  refereePosition: string;
  refereeRelationship: string;
  content: string;
  viewsCount: number;
  createdDate: string;
}

export interface ReferenceProfileCardProps {
  profile: ReferenceProfile;
  onViewDetails: (profile: ReferenceProfile) => void;
  animationDelay?: number;
}

const getVerificationBadge = (level: number) => {
  if (level === 3)
    return { text: 'Highly Verified', status: 'success' as const };
  if (level === 2) return { text: 'Verified', status: 'info' as const };
  return { text: 'Basic Verification', status: 'warning' as const };
};

const getConfidentialityBadge = (level: string) => {
  if (level === 'sensitive')
    return { text: 'Sensitive', status: 'error' as const };
  if (level === 'public') return { text: 'Public', status: 'success' as const };
  return { text: 'Standard', status: 'neutral' as const };
};

export default function ReferenceProfileCard({
  profile,
  onViewDetails,
  animationDelay = 0,
}: ReferenceProfileCardProps) {
  const verificationBadge = getVerificationBadge(profile.verificationLevel);
  const confidentialityBadge = getConfidentialityBadge(
    profile.confidentialityLevel
  );

  return (
    <div
      className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200/50 animate-fade-in-up flex flex-col h-full"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between min-h-[88px]">
        <div className="flex items-center">
          <Image
            src={profile.candidateAvatar}
            alt={profile.candidateName}
            width={48}
            height={48}
            className="rounded-full mr-3"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {profile.candidateName}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {profile.candidatePosition}
            </p>
          </div>
        </div>
        <Pill status={verificationBadge.status} size="sm">
          {verificationBadge.text}
        </Pill>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Icon name="user" className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {profile.refereeName}
            </p>
            <p className="text-xs text-gray-500">{profile.refereePosition}</p>
            <p className="text-xs text-gray-500">
              {profile.refereeRelationship}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
          {profile.content}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span>Views: {profile.viewsCount}</span>
          <span>
            Created: {new Date(profile.createdDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between mt-auto">
        <Pill status={confidentialityBadge.status} size="sm">
          {confidentialityBadge.text}
        </Pill>
        <button
          onClick={() => onViewDetails(profile)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
