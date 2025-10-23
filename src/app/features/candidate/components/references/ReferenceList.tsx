'use client';

import Image from 'next/image';
import { useState, type ReactElement } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  UserCircle,
  Shield,
  Eye,
  Lock,
  Share2,
  RotateCcw,
  Mail,
  Calendar,
} from 'lucide-react';

export type ReferenceStatus = 'Completed' | 'Pending' | 'Expired';

export interface Reference {
  id: number;
  name: string;
  role: string;
  type: string;
  status: ReferenceStatus;
  avatar: string;
  submitted?: string;
  views?: number;
  EcoTrust?: number;
  confidential?: boolean;
}

interface ReferenceListProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

function ReferenceItem({ reference }: { reference: Reference }) {
  const [imgError, setImgError] = useState(false);

  const statusConfig: Record<
    ReferenceStatus,
    { icon: ReactElement; color: string; bgColor: string; borderColor: string }
  > = {
    Completed: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
    },
    Pending: {
      icon: <Clock className="w-4 h-4" />,
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
    },
    Expired: {
      icon: <XCircle className="w-4 h-4" />,
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
    },
  };

  return (
    <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Avatar and Info */}
      <div className="flex items-start flex-1">
        <div className="flex-shrink-0">
          {imgError ? (
            <UserCircle className="w-12 h-12 text-gray-400" />
          ) : (
            <Image
              src={reference.avatar}
              alt={reference.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className="ml-4 flex-1">
          {/* Name + Status */}
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium text-gray-900">
              {reference.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                statusConfig[reference.status].bgColor
              } ${statusConfig[reference.status].color} ${
                statusConfig[reference.status].borderColor
              }`}
            >
              {statusConfig[reference.status].icon}
              <span className="ml-1">{reference.status}</span>
            </span>
          </div>

          {/* Role, Type, Submitted */}
          <div className="mt-1 text-sm text-gray-500 flex flex-wrap items-center gap-1">
            <span>{reference.role}</span>
            <span>•</span>
            <span>{reference.type}</span>
            {reference.submitted && (
              <>
                <span>•</span>
                <span>{reference.submitted}</span>
              </>
            )}
          </div>

          {/* Metadata: EcoTrust, Views, Confidential, Submitted */}
          <div className="mt-2 flex items-center text-sm text-indigo-600 space-x-4">
            {reference.EcoTrust && (
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>EcoTrust™: {reference.EcoTrust}</span>
              </div>
            )}
            {reference.views !== undefined && (
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{reference.views} views</span>
              </div>
            )}
            {reference.confidential && (
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Confidential</span>
              </div>
            )}
            {reference.submitted && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{reference.submitted}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
        {reference.status === 'Pending' && (
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Mail className="w-4 h-4 mr-2" /> Send Reminder
          </button>
        )}
        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white gradient-bg hover:opacity-90">
          <Eye className="w-4 h-4 mr-2" /> View
        </button>
        {reference.status === 'Expired' && (
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white gradient-bg hover:opacity-90">
            <RotateCcw className="w-4 h-4 mr-2" /> Resend Request
          </button>
        )}
        {reference.status === 'Completed' && (
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReferenceList({
  searchQuery,
  statusFilter,
  typeFilter,
}: ReferenceListProps) {
  const references: Reference[] = [
    {
      id: 1,
      name: 'Michael Brown',
      role: 'Senior Manager at TechCorp',
      type: 'Manager',
      status: 'Completed',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      submitted: 'Submitted: 2 days ago',
      views: 5,
      EcoTrust: 92,
      confidential: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Product Lead at InnovateCo',
      type: 'Peer',
      status: 'Pending',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      submitted: 'Requested: 5 days ago',
      views: 2,
    },
    {
      id: 3,
      name: 'David Wilson',
      role: 'CTO at Startup Labs',
      type: 'Manager',
      status: 'Expired',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      submitted: 'Expired: 1 week ago',
    },
  ];

  // Filter references based on search query and filters
  const filteredReferences = references.filter((ref) => {
    // Filter by search query (name, role, or type)
    const matchesSearch =
      searchQuery === '' ||
      ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.type.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === 'All Status' || ref.status === statusFilter;

    // Filter by type
    const matchesType = typeFilter === 'All Types' || ref.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
      {filteredReferences.map((ref) => (
        <ReferenceItem key={ref.id} reference={ref} />
      ))}
    </div>
  );
}
