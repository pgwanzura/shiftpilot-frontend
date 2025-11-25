'use client';

import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { AdvancedFilter } from '@/types/table';
import { Button, Icon } from '@/app/components/ui';
import { Input, Select, SelectOption } from '@/app/components/ui/forms';

interface AdvancedFiltersPanelProps {
  advancedFilters: AdvancedFilter[];
  localAdvancedFilters: Record<string, string>;
  setLocalAdvancedFilters: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  isLoading?: boolean;
  className?: string;
}

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  displayValue: string;
}

interface FilterErrorState {
  hasError: boolean;
  message?: string;
}

const FilterInput = React.memo(function FilterInput({
  filter,
  value,
  onChange,
  disabled = false,
}: {
  filter: AdvancedFilter;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (selected: string) => {
      onChange(selected);
    },
    [onChange]
  );

  if (filter.type === 'select') {
    const opts: SelectOption[] = filter.options
      ? [{ value: '', label: `All ${filter.label}` }, ...filter.options]
      : [];

    if (opts.length === 0) {
      return (
        <div className="text-red-600 text-xs p-2 bg-red-50 rounded-md border-md border-red-200">
          Missing options for {filter.label}
        </div>
      );
    }

    return (
      <Select
        label={undefined}
        value={value}
        options={opts}
        onChange={handleSelect}
        disabled={disabled}
      />
    );
  }

  return (
    <Input
      label={undefined}
      type={filter.type}
      value={value}
      onChange={handleInput}
      placeholder={
        filter.placeholder || `Enter ${filter.label.toLowerCase()}...`
      }
      disabled={disabled}
    />
  );
});

const ActiveFilterPill = React.memo(function ActiveFilterPill({
  filter,
  onRemove,
}: {
  filter: ActiveFilter;
  onRemove: () => void;
}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onRemove();
      }
    },
    [onRemove]
  );

  return (
    <div
      className="group flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-indigo-900/30 rounded-full border-md border-indigo-200 dark:border-indigo-700 text-xs transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600 flex-shrink-0"
      role="status"
      aria-label={`Active filter: ${filter.label} is ${filter.displayValue}`}
    >
      <span className="font-medium text-indigo-700 dark:text-indigo-300">
        {filter.label}
      </span>
      <span className="text-indigo-500 dark:text-indigo-400">:</span>
      <span className="text-indigo-800 dark:text-indigo-200 font-medium">
        {filter.displayValue}
      </span>
      <button
        type="button"
        onClick={onRemove}
        onKeyDown={handleKeyDown}
        className="text-indigo-400 dark:text-indigo-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 ml-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-0.5"
        aria-label={`Remove ${filter.label} filter`}
        tabIndex={0}
      >
        <Icon name="x" className="h-3 w-3" />
      </button>
    </div>
  );
});

const FiltersGrid = React.memo(function FiltersGrid({
  filters,
  values,
  onChange,
  disabled = false,
}: {
  filters: AdvancedFilter[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  disabled?: boolean;
}) {
  const handleUpdate = useCallback(
    (key: string, value: string) => {
      onChange(key, value);
    },
    [onChange]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filters.map((filter) => (
        <div key={filter.key} className="space-y-2">
          <label
            htmlFor={`filter-${filter.key}`}
            className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300"
          >
            {filter.label}
          </label>
          <FilterInput
            filter={filter}
            value={values[filter.key] || ''}
            onChange={(value) => handleUpdate(filter.key, value)}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
});

class FilterErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ReactNode }>,
  { hasError: boolean }
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ReactNode }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Filter rendering error:', error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-red-600 p-4 text-sm">
            Filter configuration error
          </div>
        )
      );
    }
    return this.props.children;
  }
}

const validateFilterConfig = (filters: AdvancedFilter[]): void => {
  const keys = new Set<string>();
  for (const filter of filters) {
    if (keys.has(filter.key)) {
      throw new Error(`Duplicate filter key: ${filter.key}`);
    }
    keys.add(filter.key);
    if (filter.type === 'select' && !filter.options) {
      throw new Error(`Select filter ${filter.key} missing options`);
    }
    if (filter.label.trim().length === 0) {
      throw new Error(`Filter ${filter.key} has empty label`);
    }
  }
};

const useDebouncedCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const debounced = useCallback(
    (...args: T) => {
      if (timer) clearTimeout(timer);
      const next = setTimeout(() => callback(...args), delay);
      setTimer(next);
    },
    [callback, delay, timer]
  );

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return debounced;
};

export function AdvancedFiltersPanel({
  advancedFilters,
  localAdvancedFilters,
  setLocalAdvancedFilters,
  isLoading = false,
  className = '',
}: AdvancedFiltersPanelProps): React.JSX.Element {
  const [errorState, setErrorState] = useState<FilterErrorState>({
    hasError: false,
  });

  useEffect(() => {
    try {
      validateFilterConfig(advancedFilters);
      setErrorState({ hasError: false });
    } catch (e) {
      setErrorState({
        hasError: true,
        message:
          e instanceof Error ? e.message : 'Invalid filter configuration',
      });
    }
  }, [advancedFilters]);

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    if (errorState.hasError) return [];
    return advancedFilters
      .filter((f) => {
        const v = localAdvancedFilters[f.key];
        return v !== undefined && v !== '';
      })
      .map((f) => {
        const raw = localAdvancedFilters[f.key];
        const display =
          f.type === 'select' && f.options
            ? f.options.find((o) => o.value === raw)?.label || raw
            : raw;
        return {
          key: f.key,
          label: f.label,
          value: raw,
          displayValue: display,
        };
      });
  }, [advancedFilters, localAdvancedFilters, errorState.hasError]);

  const hasActiveFilters = activeFilters.length > 0;

  const debounced = useDebouncedCallback((key: string, value: string) => {
    setLocalAdvancedFilters((prev) => ({ ...prev, [key]: value }));
  }, 300);

  const handleChange = useCallback(
    (key: string, value: string) => {
      debounced(key, value);
    },
    [debounced]
  );

  const clearAll = useCallback(() => {
    setLocalAdvancedFilters({});
  }, [setLocalAdvancedFilters]);

  const removeFilter = useCallback(
    (key: string) => {
      setLocalAdvancedFilters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setLocalAdvancedFilters]
  );

  if (errorState.hasError) {
    return (
      <div className={`px-4 ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-md border-md border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200 text-sm">
            <Icon name="alertTriangle" className="h-4 w-4" />
            <span>{errorState.message || 'Filter configuration error'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (advancedFilters.length === 0) {
    return (
      <div className={`px-4 ${className}`}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md border-md border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No filters available
          </p>
        </div>
      </div>
    );
  }

  return (
    <FilterErrorBoundary>
      <div className={`px-4 ${className}`}>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-md border-md border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start justify-between p-4 border-md border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-md flex-shrink-0 mt-0.5">
                <Icon
                  name="filter"
                  className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeFilters.map((filter) => (
                        <ActiveFilterPill
                          key={filter.key}
                          filter={filter}
                          onRemove={() => removeFilter(filter.key)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Refine your results
                  {hasActiveFilters && (
                    <span className="text-green-600 dark:text-green-400 font-medium ml-1">
                      • {activeFilters.length} applied
                    </span>
                  )}
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="secondary-outline"
                size="sm"
                onClick={clearAll}
                disabled={isLoading}
                className="h-7 px-2 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border-md border-gray-300 dark:border-gray-600 flex-shrink-0 ml-3"
              >
                <Icon name="xCircle" className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="p-4">
            <FiltersGrid
              filters={advancedFilters}
              values={localAdvancedFilters}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="px-4 py-3 border-md border-indigo-100 dark:border-indigo-800 bg-indigo-25 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Icon name="info" className="h-3 w-3" />
                <span>Filter results to find exactly what you need</span>
              </div>

              {hasActiveFilters && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {activeFilters.length} filter
                  {activeFilters.length === 1 ? '' : 's'} applied
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FilterErrorBoundary>
  );
}
