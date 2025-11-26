import { useState, useCallback } from 'react';
import { SortState } from '@/types/table';

export function useTableSorting(
  sort: SortState | undefined,
  onSortChange: (sort: SortState) => void
) {
  const [sortingColumn, setSortingColumn] = useState<string | null>(null);
  const [sortLoading, setSortLoading] = useState(false);

  const handleSort = useCallback(
    (key: string) => {
      setSortingColumn(key);
      setSortLoading(true);

      const newSort: SortState =
        sort?.key === key && sort.direction === 'asc'
          ? { key, direction: 'desc' }
          : { key, direction: 'asc' };

      onSortChange(newSort);

      setTimeout(() => {
        setSortingColumn(null);
        setSortLoading(false);
      }, 200);
    },
    [sort, onSortChange]
  );

  return { sortingColumn, sortLoading, handleSort, setSortLoading };
}
