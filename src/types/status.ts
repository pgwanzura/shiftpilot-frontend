// types/status.ts
export interface StatusConfig {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  color: string;
  bgColor: string;
  borderColor: string;
  icon?: string;
}

export interface StatusFilterOption {
  value: string;
  label: string;
  config: StatusConfig;
}

// Predefined status configurations for common use cases
export const COMMON_STATUS_CONFIGS: Record<string, StatusConfig> = {
  active: {
    label: 'Active',
    variant: 'success',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: 'checkCircle',
  },
  inactive: {
    label: 'Inactive',
    variant: 'secondary',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: 'minusCircle',
  },
  pending: {
    label: 'Pending',
    variant: 'warning',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: 'clock',
  },
  draft: {
    label: 'Draft',
    variant: 'secondary',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: 'edit',
  },
  published: {
    label: 'Published',
    variant: 'success',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: 'globe',
  },
  archived: {
    label: 'Archived',
    variant: 'secondary',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: 'archive',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'error',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: 'xCircle',
  },
  completed: {
    label: 'Completed',
    variant: 'primary',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: 'checkCircle',
  },
  failed: {
    label: 'Failed',
    variant: 'error',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: 'xCircle',
  },
  processing: {
    label: 'Processing',
    variant: 'info',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: 'refreshCw',
  },
};
