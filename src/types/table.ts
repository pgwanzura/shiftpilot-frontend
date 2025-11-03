import { ReactNode } from 'react';

export interface TableData {
  id: string | number;
  [key: string]: any;
}

export interface Column<T extends TableData> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  wrapHeader?: boolean;
  cellClassName?: string | ((row: T, value: T[keyof T]) => string);
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: any;
}

export interface TableState {
  sort: SortState | null;
  filters: FilterState;
  selectedRows: Set<string | number>;
  columnOrder: string[];
  visibleColumns: Set<string>;
  expandedRows: Set<string | number>;
}

export interface BulkAction<T extends TableData> {
  label: string;
  icon: ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface ExportOptions {
  formats: ('csv' | 'excel' | 'json')[];
  onExport: (
    format: string,
    data: TableData[],
    columns: Column<TableData>[]
  ) => void;
}

export interface InlineEditConfig<T extends TableData> {
  editable?: boolean;
  onSave: (row: T, key: keyof T, value: T[keyof T]) => Promise<void> | void;
  validation?: (value: T[keyof T], row: T, key: keyof T) => string | null;
  renderEditor?: (value: T[keyof T], row: T, key: keyof T) => ReactNode;
}

export interface AdvancedFilter {
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'boolean';
  label: string;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface RowExpansionConfig<T extends TableData> {
  render: (row: T) => ReactNode;
  expandable?: (row: T) => boolean;
}

export interface TableConfig<T extends TableData> {
  data: T[];
  columns: Column<T>[];
  pagination?: Pagination;
  filters?: FilterState;
  loading?: boolean;
  error?: string | null;
  onPaginationChange?: (pagination: Pagination) => void;
  onSortChange?: (sort: SortState) => void;
  onFilterChange?: (filters: FilterState) => void;
  onRowClick?: (row: T) => void;
  onRetry?: () => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
  rowClassName?: (row: T, rowIndex: number) => string;
  emptyMessage?: string;
  selectable?: boolean;
  virtualScroll?: boolean;
  showSearch?: boolean;
  showColumnSettings?: boolean;
  actions?: (row: T) => ReactNode;
  bulkActions?: BulkAction<T>[];
  statusFilterOptions?: Array<{ value: string; label: string }>;
  advancedFilters?: AdvancedFilter[];
  title?: string;
  description?: string;
  exportOptions?: ExportOptions;
  inlineEdit?: InlineEditConfig<T>;
  rowExpansion?: RowExpansionConfig<T>;
}
