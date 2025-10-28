'use client';

import { useState } from 'react';
import { Button, Icon } from '@/app/components/ui';
import { IconName } from '@/config/icons';

interface RoleSelectionProps {
  onRoleSelect: (role: 'agency' | 'employer') => void;
  isLoading?: boolean;
}

interface RoleCardProps {
  title: string;
  description: string;
  icon: IconName;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function RoleCard({
  title,
  description,
  icon,
  selected,
  onClick,
  disabled,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'bg-blue-50 border-blue-300 shadow-sm'
          : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-25'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Icon name={icon} size="sm" />
        </div>

        <div className="flex-1 space-y-2">
          <h3
            className={`font-semibold text-base ${
              selected ? 'text-gray-900' : 'text-gray-800'
            }`}
          >
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
          }`}
        >
          {selected && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

export default function RoleSelection({
  onRoleSelect,
  isLoading = false,
}: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<
    'agency' | 'employer' | null
  >(null);

  const roles = [
    {
      id: 'agency' as const,
      title: 'Agency',
      description: 'Staffing agencies managing talent and placements',
      icon: 'users' as IconName,
    },
    {
      id: 'employer' as const,
      title: 'Employer',
      description: 'Companies looking to hire temporary or permanent staff',
      icon: 'briefcase' as IconName,
    },
  ];

  const handleRoleSelect = (role: (typeof roles)[number]['id']) => {
    if (isLoading) return;
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole && !isLoading) {
      onRoleSelect(selectedRole);
    }
  };

  const getHelperContent = () => {
    if (selectedRole === 'agency') {
      return {
        title: 'Agency Account',
        description:
          'Manage your talent pool, connect with employers, and streamline placements.',
      };
    } else if (selectedRole === 'employer') {
      return {
        title: 'Employer Account',
        description:
          'Post shifts, review candidates, and manage your workforce efficiently.',
      };
    } else {
      return {
        title: 'Choose Account Type',
        description:
          'Select the option that best describes your role in the staffing process.',
      };
    }
  };

  const helperContent = getHelperContent();

  return (
    <div className="space-y-6">
      {/* Role Cards */}
      <div className="space-y-3">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            title={role.title}
            description={role.description}
            icon={role.icon}
            selected={selectedRole === role.id}
            onClick={() => handleRoleSelect(role.id)}
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Helper Content */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <Icon name="info" size="xs" className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              {helperContent.title}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {helperContent.description}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selectedRole || isLoading}
        variant="primary"
        size="lg"
        className="w-full"
        loading={isLoading}
      >
        {selectedRole
          ? `Continue as ${roles.find((r) => r.id === selectedRole)?.title}`
          : 'Select Account Type'}
      </Button>
    </div>
  );
}
