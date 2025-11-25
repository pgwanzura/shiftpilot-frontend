'use client';

import React, { useRef, useCallback, useMemo } from 'react';
import {
  TableData,
  BulkAction,
  ExportOptions,
  AdvancedFilter,
} from '@/types/table';
import { Button, Icon } from '@/app/components/ui';
import { IconName } from '@/config';
import { Input } from '@/app/components/ui/forms';

interface TableToolbarProps<T extends TableData> {
  title?: string;
  description?: string;
  isLoading?: boolean;
  selectedCount: number;
  totalCount: number;
  bulkActions: BulkAction<T>[];
  selectedData: T[];
  showSearch: boolean;
  searchValue: string;
  onSearch: (value: string) => void;
  statusFilterOptions?: Array<{ value: string; label: string }>;
  currentStatus?: string;
  onStatusChange: (status: string) => void;
  onClearStatus: () => void;
  advancedFilters: AdvancedFilter[];
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  exportOptions?: ExportOptions;
  onExport: (format: string) => void;
  showColumnSettings: boolean;
  onToggleColumnSettings: () => void;
  onRetry?: () => void;
  columns?: Array<{ key: string; header: string; visible: boolean }>;
  onColumnVisibilityChange?: (key: string, visible: boolean) => void;
}

type DropdownType = 'status' | 'export' | 'columns';

export function TableToolbar<T extends TableData>({
  title,
  description,
  isLoading = false,
  selectedCount,
  totalCount,
  bulkActions,
  selectedData,
  showSearch,
  searchValue,
  onSearch,
  statusFilterOptions,
  currentStatus,
  onStatusChange,
  onClearStatus,
  advancedFilters,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  exportOptions,
  onExport,
  showColumnSettings,
  onRetry,
  columns = [],
  onColumnVisibilityChange,
}: TableToolbarProps<T>): React.JSX.Element {
  const [openDropdown, setOpenDropdown] = React.useState<DropdownType | null>(
    null
  );
  const [isClosing, setIsClosing] = React.useState<DropdownType | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const columnsDropdownRef = useRef<HTMLDivElement>(null);

  const dropdownRefs = useMemo(
    () => ({
      status: statusDropdownRef,
      export: exportMenuRef,
      columns: columnsDropdownRef,
    }),
    []
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (
        openDropdown &&
        dropdownRefs[openDropdown].current &&
        !dropdownRefs[openDropdown].current?.contains(target)
      ) {
        setIsClosing(openDropdown);
        setTimeout(() => {
          setOpenDropdown(null);
          setIsClosing(null);
        }, 250);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown, dropdownRefs]);

  const currentStatusLabel = useMemo((): string => {
    if (!currentStatus) return 'All Status';
    return (
      statusFilterOptions?.find((opt) => opt.value === currentStatus)?.label ||
      'All Status'
    );
  }, [currentStatus, statusFilterOptions]);

  const descriptionText = useMemo((): React.ReactNode => {
    if (isLoading) {
      return (
        <span className="text-gray-500 dark:text-gray-400">
          Loading data...
        </span>
      );
    }
    return (
      <>
        <span className="font-medium text-gray-900 dark:text-white">
          {totalCount}
        </span>
        {' records found'}
        {selectedCount > 0 && (
          <>
            {' • '}
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {selectedCount} selected
            </span>
          </>
        )}
      </>
    );
  }, [isLoading, totalCount, selectedCount]);

  const handleDropdownToggle = useCallback(
    (dropdown: DropdownType): void => {
      if (openDropdown === dropdown) {
        setIsClosing(dropdown);
        setTimeout(() => {
          setOpenDropdown(null);
          setIsClosing(null);
        }, 250);
      } else {
        if (openDropdown) {
          setIsClosing(openDropdown);
          setTimeout(() => {
            setOpenDropdown(dropdown);
            setIsClosing(null);
          }, 150);
        } else {
          setOpenDropdown(dropdown);
        }
      }
    },
    [openDropdown]
  );

  const handleStatusSelect = useCallback(
    (status: string): void => {
      onStatusChange(status);
      setIsClosing('status');
      setTimeout(() => {
        setOpenDropdown(null);
        setIsClosing(null);
      }, 200);
    },
    [onStatusChange]
  );

  const handleClearStatus = useCallback((): void => {
    onClearStatus();
    setIsClosing('status');
    setTimeout(() => {
      setOpenDropdown(null);
      setIsClosing(null);
    }, 200);
  }, [onClearStatus]);

  const handleExport = useCallback(
    (format: string): void => {
      onExport(format);
      setIsClosing('export');
      setTimeout(() => {
        setOpenDropdown(null);
        setIsClosing(null);
      }, 200);
    },
    [onExport]
  );

  const handleSearchChange = useCallback(
    (value: string): void => {
      onSearch(value);
    },
    [onSearch]
  );

  const handleColumnVisibilityToggle = useCallback(
    (key: string, visible: boolean): void => {
      onColumnVisibilityChange?.(key, visible);
    },
    [onColumnVisibilityChange]
  );

  const handleColumnsButtonClick = useCallback((): void => {
    handleDropdownToggle('columns');
  }, [handleDropdownToggle]);

  const getDropdownAnimation = useCallback(
    (dropdown: DropdownType) => {
      const isOpen = openDropdown === dropdown;
      const isAnimatingClose = isClosing === dropdown;

      if (isOpen && !isAnimatingClose) {
        return 'animate-scale-in opacity-100 scale-100';
      } else if (isAnimatingClose) {
        return 'animate-scale-out opacity-0 scale-95';
      }
      return 'opacity-0 scale-95 pointer-events-none';
    },
    [openDropdown, isClosing]
  );

  const dropdownContainerClasses =
    'absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 transition-all duration-300 ease-out transform origin-top-right';
  const dropdownItemClasses =
    'w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700';
  const dropdownActiveItemClasses =
    'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium';

  const bulkActionsSection = useMemo((): React.ReactNode => {
    if (isLoading || selectedCount === 0 || bulkActions.length === 0) {
      return null;
    }
    return (
      <div className="flex flex-wrap items-center gap-2 shrink-0 animate-fade-in">
        {bulkActions.map((action, index) => (
          <Button
            key={`${action.label}-${index}`}
            variant={action.variant || 'primary'}
            size="sm"
            onClick={() => action.onClick(selectedData)}
            disabled={action.disabled}
            className="h-[38px]"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    );
  }, [isLoading, selectedCount, bulkActions, selectedData]);

  const searchInput = useMemo((): React.ReactNode => {
    if (!showSearch) return null;
    return (
      <div className="w-full sm:w-auto sm:min-w-[280px] flex-1 animate-fade-in">
        <Input
          type="text"
          placeholder="Search records..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
          leftIcon={<Icon name="search" className="h-4 w-4" />}
          containerClassName="mb-0"
          label={undefined}
        />
      </div>
    );
  }, [showSearch, searchValue, handleSearchChange, isLoading]);

  const statusFilterDropdown = useMemo((): React.ReactNode => {
    if (!statusFilterOptions) return null;
    const isOpen = openDropdown === 'status';
    const isClosingStatus = isClosing === 'status';

    return (
      <div className="relative" ref={statusDropdownRef}>
        <Button
          variant={currentStatus ? 'primary' : 'secondary-outline'}
          size="sm"
          onClick={() => handleDropdownToggle('status')}
          disabled={isLoading}
          className="h-[38px]"
        >
          <Icon name="filter" className="h-4 w-4" />
          <span className="ml-2 transition-colors duration-300">
            {currentStatusLabel}
          </span>
          <Icon
            name={isOpen && !isClosingStatus ? 'chevronUp' : 'chevronDown'}
            className="h-4 w-4 ml-1 transition-all duration-300 transform"
          />
        </Button>
        <div
          className={`${dropdownContainerClasses} ${getDropdownAnimation('status')} w-56`}
        >
          <div className="p-2 space-y-1">
            <button
              onClick={handleClearStatus}
              className={`${dropdownItemClasses} ${!currentStatus ? dropdownActiveItemClasses : 'text-gray-700 dark:text-gray-300'}`}
              type="button"
            >
              <Icon
                name="layers"
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              />
              All Status
            </button>
            {statusFilterOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusSelect(status.value)}
                className={`${dropdownItemClasses} ${currentStatus === status.value ? dropdownActiveItemClasses : 'text-gray-700 dark:text-gray-300'} group`}
                type="button"
              >
                <Icon
                  name="circle"
                  className="h-3 w-3 transition-all duration-300 group-hover:scale-125"
                />
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }, [
    statusFilterOptions,
    openDropdown,
    isClosing,
    currentStatus,
    currentStatusLabel,
    isLoading,
    handleDropdownToggle,
    handleClearStatus,
    handleStatusSelect,
    getDropdownAnimation,
  ]);

  const exportDropdown = useMemo((): React.ReactNode => {
    if (!exportOptions) return null;
    const hasSelectedRows = selectedCount > 0;

    return (
      <div className="relative" ref={exportMenuRef}>
        <Button
          variant="secondary-outline"
          size="sm"
          onClick={() => handleDropdownToggle('export')}
          disabled={isLoading}
          className="h-[38px]"
        >
          <Icon
            name="download"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          <span className="ml-2 transition-colors duration-300">
            Export{hasSelectedRows ? ` (${selectedCount})` : ''}
          </span>
        </Button>
        <div
          className={`${dropdownContainerClasses} ${getDropdownAnimation('export')} w-56`}
        >
          <div className="p-2 space-y-1">
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">
                Export All Data
              </div>
              {exportOptions.formats.map((format) => (
                <button
                  key={`all-${format}`}
                  onClick={() => handleExport(format)}
                  className={`${dropdownItemClasses} text-gray-700 dark:text-gray-300 group`}
                  type="button"
                >
                  <Icon
                    name="file"
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="transition-all duration-300">
                    {format.toUpperCase()} Format
                  </span>
                </button>
              ))}
            </div>

            {hasSelectedRows && (
              <>
                <div className="border-t border-gray-100 dark:border-gray-600 my-1 transition-colors duration-300"></div>
                <div className="px-2 py-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">
                    Export Selected ({selectedCount})
                  </div>
                  {exportOptions.formats.map((format) => (
                    <button
                      key={`selected-${format}`}
                      onClick={() => handleExport(`selected-${format}`)}
                      className={`${dropdownItemClasses} text-gray-700 dark:text-gray-300 group`}
                      type="button"
                    >
                      <Icon
                        name="checkSquare"
                        className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="transition-all duration-300">
                        {format.toUpperCase()} Format
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    exportOptions,
    isLoading,
    selectedCount,
    handleDropdownToggle,
    handleExport,
    getDropdownAnimation,
  ]);

  const columnSettingsDropdown = useMemo((): React.ReactNode => {
    if (!showColumnSettings) return null;

    return (
      <div
        className={`${dropdownContainerClasses} ${getDropdownAnimation('columns')} w-64`}
      >
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            Visible Columns
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {columns.map((column) => (
              <label
                key={column.key}
                className="flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-300 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={(e) =>
                    handleColumnVisibilityToggle(column.key, e.target.checked)
                  }
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500 transition-all duration-300 ease-out transform hover:scale-110"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 transition-all duration-300 group-hover:text-gray-900 dark:group-hover:text-white group-hover:font-medium">
                  {column.header}
                </span>
                <Icon
                  name={column.visible ? 'eye' : 'eyeOff'}
                  className={`h-4 w-4 transition-all duration-300 transform group-hover:scale-110 ${column.visible ? 'text-success-500' : 'text-gray-400 dark:text-gray-500'}`}
                />
              </label>
            ))}
          </div>
          {columns.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-300">
              No columns available
            </p>
          )}
        </div>
      </div>
    );
  }, [
    showColumnSettings,
    columns,
    handleColumnVisibilityToggle,
    getDropdownAnimation,
  ]);

  const utilityButtons = useMemo((): React.ReactNode => {
    const hasUtilities = onRetry || showColumnSettings;
    if (!hasUtilities) return null;
    return (
      <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
        {onRetry && (
          <TooltipButton
            tooltip="Refresh data"
            variant="secondary-outline"
            size="sm"
            onClick={onRetry}
            disabled={isLoading}
            icon="refreshCw"
            iconClassName={isLoading ? 'animate-spin' : ''}
          />
        )}
        {showColumnSettings && (
          <div className="relative" ref={columnsDropdownRef}>
            <TooltipButton
              tooltip="Configure columns"
              variant={
                openDropdown === 'columns' ? 'primary' : 'secondary-outline'
              }
              size="sm"
              onClick={handleColumnsButtonClick}
              disabled={isLoading}
              icon="columns"
            />
            {columnSettingsDropdown}
          </div>
        )}
      </div>
    );
  }, [
    onRetry,
    showColumnSettings,
    isLoading,
    openDropdown,
    handleColumnsButtonClick,
    columnSettingsDropdown,
  ]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
        {(title || description) && (
          <div className="min-w-0 flex-1 animate-fade-in">
            {title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate transition-colors duration-300 hover:text-gray-700 dark:hover:text-gray-300">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate transition-colors duration-300 mt-1">
                {descriptionText}
              </p>
            )}
          </div>
        )}

        {showSearch && searchInput}

        {bulkActionsSection}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {statusFilterDropdown}
        {advancedFilters.length > 0 && (
          <Button
            variant={showAdvancedFilters ? 'primary' : 'secondary-outline'}
            size="sm"
            onClick={onToggleAdvancedFilters}
            disabled={isLoading}
            className="h-[38px]"
          >
            <Icon name="sliders" className="h-4 w-4" />
            <span className="ml-2 transition-colors duration-300">Filters</span>
          </Button>
        )}
        {exportDropdown}
        {utilityButtons}
      </div>
    </div>
  );
}

interface TooltipButtonProps {
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'danger' | 'secondary-outline';
  size: 'sm' | 'md' | 'lg';
  icon: IconName;
  iconClassName?: string;
}

function TooltipButton({
  tooltip,
  onClick,
  disabled,
  variant,
  size,
  icon,
  iconClassName = '',
}: TooltipButtonProps): React.JSX.Element {
  return (
    <div className="relative group">
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        className="h-[38px]"
      >
        <Icon name={icon} className={`h-4 w-4 ${iconClassName}`} />
      </Button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 translate-y-2 group-hover:translate-y-0">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
}
