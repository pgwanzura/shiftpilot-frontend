'use client';

import React, { useRef } from 'react';
import {
  TableData,
  BulkAction,
  ExportOptions,
  AdvancedFilter,
} from '@/types/table';
import { Button, Icon } from '@/app/components/ui';

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
}

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
  onToggleColumnSettings,
  onRetry,
}: TableToolbarProps<T>) {
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentStatusLabel = (): string => {
    if (!currentStatus) return 'All Status';
    return (
      statusFilterOptions?.find((opt) => opt.value === currentStatus)?.label ||
      'All Status'
    );
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 flex-1 min-w-0">
        {(title || description) && (
          <div className="min-w-0 flex-1 space-y-1">
            {title && (
              <h2 className="text-xl font-bold text-gray-900 truncate animate-slide-down">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 truncate animate-slide-down animation-delay-100">
                {!isLoading && (
                  <>
                    <span className="font-medium text-gray-900">
                      {totalCount}
                    </span>
                    {' records found'}
                    {!isLoading && selectedCount > 0 && (
                      <>
                        {' • '}
                        <span className="font-medium text-indigo-600">
                          {selectedCount} selected
                        </span>
                      </>
                    )}
                  </>
                )}
                {isLoading && (
                  <span className="text-gray-500">Loading data...</span>
                )}
              </p>
            )}
          </div>
        )}

        {!isLoading && selectedCount > 0 && bulkActions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 animate-slide-up shrink-0">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                size="sm"
                onClick={() => action.onClick(selectedData)}
                className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                disabled={action.disabled}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
        {showSearch && (
          <div className="relative w-full sm:w-auto sm:min-w-[280px] flex-1 sm:flex-none order-first sm:order-none">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Search records..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white shadow-sm"
              disabled={isLoading}
            />
            {searchValue && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                disabled={isLoading}
              >
                <Icon name="x" className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {statusFilterOptions && (
            <div className="relative" ref={statusDropdownRef}>
              <Button
                variant={currentStatus ? 'primary' : 'secondary-outline'}
                size="sm"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              >
                <Icon name="filter" className="h-4 w-4" />
                <span className="ml-2">{getCurrentStatusLabel()}</span>
                <Icon
                  name={showStatusDropdown ? 'chevronUp' : 'chevronDown'}
                  className="h-4 w-4 ml-1 transition-transform duration-200"
                />
              </Button>

              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-scale-in">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onClearStatus();
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 ${
                        !currentStatus
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name="layers" className="h-4 w-4" />
                      All Status
                    </button>
                    {statusFilterOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          onStatusChange(status.value);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-2 ${
                          currentStatus === status.value
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon name="circle" className="h-3 w-3" />
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {advancedFilters.length > 0 && (
            <Button
              variant={showAdvancedFilters ? 'primary' : 'secondary-outline'}
              size="sm"
              onClick={onToggleAdvancedFilters}
              className="transform hover:scale-105 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            >
              <Icon name="sliders" className="h-4 w-4" />
              <span className="ml-2">Filters</span>
            </Button>
          )}

          {exportOptions && (
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="secondary-outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              >
                <Icon name="download" className="h-4 w-4" />
                <span className="ml-2">Export</span>
              </Button>

              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-scale-in">
                  <div className="p-2 space-y-1">
                    {exportOptions.formats.map((format) => (
                      <button
                        key={format}
                        onClick={() => {
                          onExport(format);
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 flex items-center gap-2"
                      >
                        <Icon name="file" className="h-4 w-4" />
                        Export as {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 border-l border-gray-200 pl-2 ml-1">
            {onRetry && (
              <div className="relative group">
                <Button
                  variant="secondary-outline"
                  size="sm"
                  onClick={onRetry}
                  disabled={isLoading}
                  className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  <Icon
                    name="refreshCw"
                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                  Refresh data
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}

            {showColumnSettings && (
              <div className="relative group">
                <Button
                  onClick={onToggleColumnSettings}
                  variant="secondary-outline"
                  size="sm"
                  className="transform hover:scale-105 transition-all duration-200 shadow-sm"
                  disabled={isLoading}
                >
                  <Icon name="columns" className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                  Configure columns
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
