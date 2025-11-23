import { useState, useCallback } from 'react';
import { TableState } from '@/types/table';

export function useTableState(initialState?: Partial<TableState>) {
  const [state, setState] = useState<TableState>({
    sort: undefined,
    filters: {},
    selectedRows: new Set(),
    columnOrder: [],
    visibleColumns: new Set(),
    expandedRows: new Set(),
    ...initialState,
  });

  const updateState = useCallback((updates: Partial<TableState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState] as const;
}
