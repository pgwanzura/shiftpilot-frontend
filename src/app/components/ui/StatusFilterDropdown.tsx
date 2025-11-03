import React, { useRef } from 'react';
import { Button, Icon } from '@/app/components/ui';
import { StatusFilterOption } from '@/types';

interface StatusFilterDropdownProps {
  statusFilterOptions: StatusFilterOption[];
  currentStatus?: string;
  onStatusChange: (status: string) => void;
  onClearStatus: () => void;
  isLoading?: boolean;
}

export const StatusFilterDropdown: React.FC<StatusFilterDropdownProps> = ({
  statusFilterOptions,
  currentStatus,
  onStatusChange,
  onClearStatus,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = statusFilterOptions.find(
    (opt) => opt.value === currentStatus
  );
  const currentLabel = currentOption?.label || 'All Status';

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant={currentStatus ? 'primary' : 'secondary-outline'}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="transform hover:scale-105 transition-all duration-200 shadow-sm"
        disabled={isLoading}
      >
        <Icon name="filter" className="h-4 w-4" />
        <span className="ml-2">{currentLabel}</span>
        <Icon
          name={isOpen ? 'chevronUp' : 'chevronDown'}
          className="h-4 w-4 ml-1 transition-transform duration-200"
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-scale-in">
          <div className="p-2 space-y-1">
            <button
              onClick={onClearStatus}
              className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 ${
                !currentStatus
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon name="layers" className="h-4 w-4" />
              All Status
            </button>
            {statusFilterOptions.map((statusOption) => (
              <button
                key={statusOption.value}
                onClick={() => handleStatusSelect(statusOption.value)}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 ${
                  currentStatus === statusOption.value
                    ? `${statusOption.config.bgColor} ${statusOption.config.color} font-medium`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-full ${statusOption.config.bgColor} ${statusOption.config.borderColor} border`}
                />
                {statusOption.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
