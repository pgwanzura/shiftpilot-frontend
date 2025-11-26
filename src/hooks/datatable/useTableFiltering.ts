import { useState, useCallback, useMemo } from 'react';
import { TableFilters } from '@/types';

interface LocalAdvancedFilters {
  [key: string]: string;
}

export function useTableFiltering(
  filters: TableFilters,
  onFilterChange?: (filters: TableFilters) => void
) {
  const [localLoading, setLocalLoading] = useState(false);
  const [localAdvancedFilters, setLocalAdvancedFilters] =
    useState<LocalAdvancedFilters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilter = useCallback(
    (newFilters: TableFilters): void => {
      setLocalLoading(true);
      onFilterChange?.(newFilters);

      setTimeout(() => {
        setLocalLoading(false);
      }, 300);
    },
    [onFilterChange]
  );

  const handleSearch = useCallback(
    (searchTerm: string): void => {
      const newFilters = { ...filters, search: searchTerm };
      handleFilter(newFilters);
    },
    [filters, handleFilter]
  );

  const handleStatusFilter = useCallback(
    (status: string): void => {
      const newFilters = { ...filters, status, page: 1 };
      handleFilter(newFilters);
    },
    [filters, handleFilter]
  );

  const handleClearStatusFilter = useCallback((): void => {
    const newFilters = { ...filters };
    delete newFilters.status;
    handleFilter(newFilters);
  }, [filters, handleFilter]);

  const handleClearFilters = useCallback((): void => {
    setLocalLoading(true);
    const newFilters = {};
    setLocalAdvancedFilters({});
    onFilterChange?.(newFilters);

    setTimeout(() => {
      setLocalLoading(false);
    }, 300);
  }, [onFilterChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      !!filters.search ||
      (filters.status && filters.status !== 'all') ||
      Object.keys(localAdvancedFilters).length > 0
    );
  }, [filters.search, filters.status, localAdvancedFilters]);

  const searchValue = useMemo(() => {
    const search = filters.search;
    return search ? String(search) : '';
  }, [filters.search]);

  const currentStatus = useMemo(() => {
    const status = filters.status;
    return status ? String(status) : undefined;
  }, [filters.status]);

  return {
    filterLoading: localLoading,
    localAdvancedFilters,
    showAdvancedFilters,
    hasActiveFilters,
    searchValue,
    currentStatus,
    handleSearch,
    handleStatusFilter,
    handleClearStatusFilter,
    handleClearFilters,
    setLocalAdvancedFilters,
    setShowAdvancedFilters,
    setFilterLoading: setLocalLoading,
  };
}
