import { ReactNode } from 'react';

export interface TableData {
  id: string | number;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, unknown>
    | Array<unknown>;
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

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  last_page?: number;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableFilters {
  search?: string;
  status?: string;
  page?: number;
  [key: string]: string | number | boolean | null | undefined;
}

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'primary'
  | 'secondary';

export interface TableState {
  sort?: SortState;
  filters: TableFilters;
  selectedRows: Set<string | number>;
  expandedRows: Set<string | number>;
  columnOrder: string[];
  visibleColumns: Set<string>;
}

export interface BulkAction<T extends TableData> {
  label: string;
  icon: ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'secondary-outline';
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
  pagination?: PaginationState;
  filters?: TableFilters;
  loading?: boolean;
  error?: string | null;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortChange?: (sort: SortState) => void;
  onFilterChange?: (filters: TableFilters) => void;
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

// Types for the custom hooks
export interface UseTableStateProps {
  filters?: TableFilters;
  columnOrder?: string[];
  visibleColumns?: Set<string>;
}

export interface UseTableSortingReturn {
  sortingColumn: string | null;
  sortLoading: boolean;
  handleSort: (key: string, currentSort?: SortState) => void;
  setSortLoading: (loading: boolean) => void;
}

export interface UseTableFilteringReturn {
  filterLoading: boolean;
  localAdvancedFilters: Record<string, string>;
  showAdvancedFilters: boolean;
  hasActiveFilters: boolean;
  searchValue: string;
  currentStatus: string | undefined;
  handleSearch: (searchTerm: string) => void;
  handleStatusFilter: (status: string) => void;
  handleClearStatusFilter: () => void;
  handleClearFilters: () => void;
  setLocalAdvancedFilters: (filters: Record<string, string>) => void;
  setShowAdvancedFilters: (show: boolean) => void;
  setFilterLoading: (loading: boolean) => void;
}

export interface UseTablePaginationReturn<T extends TableData> {
  normalizedPagination: PaginationState;
  paginatedData: TableData[];
}

export interface UseColumnDraggingReturn {
  draggedColumn: string | null;
  dragOverIndex: number | null;
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: string
  ) => void;
  handleDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    targetColumnKey: string
  ) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

// Types for component props
export interface TableToolbarProps<T extends TableData> {
  title?: string;
  description?: string;
  isLoading: boolean;
  selectedCount: number;
  totalCount: number;
  bulkActions: BulkAction<T>[];
  selectedData: T[];
  columns: Array<{ key: string; header: string; visible: boolean }>;
  showSearch: boolean;
  searchValue: string;
  onSearch: (searchTerm: string) => void;
  statusFilterOptions?: Array<{ value: string; label: string }>;
  currentStatus?: string;
  onStatusChange: (status: string) => void;
  onClearStatus: () => void;
  advancedFilters: AdvancedFilter[];
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  exportOptions?: ExportOptions;
  onExport: () => void;
  showColumnSettings: boolean;
  onToggleColumnSettings: () => void;
  onRetry?: () => void;
  onColumnVisibilityChange: (key: string, visible: boolean) => void;
}

export interface TableHeaderProps<T extends TableData> {
  columns: Column<T>[];
  state: TableState;
  onSort: (key: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, columnKey: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, columnKey: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  hasActions: boolean;
  isLoading: boolean;
  sortingColumn: string | null;
  draggedColumn: string | null;
  dragOverIndex: number | null;
}

export interface TableBodyProps<T extends TableData> {
  data: T[];
  columns: Column<T>[];
  state: TableState;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  rowExpansion?: RowExpansionConfig<T>;
  inlineEdit?: InlineEditConfig<T>;
  editingCell: { rowId: string | number; key: keyof T } | null;
  editValue: T[keyof T] | undefined;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditValueChange: (value: T[keyof T]) => void;
  hoveredRow: number | null;
  onHover: (index: number | null) => void;
  clickedRow: number | null;
  rowClassName?: (row: T, rowIndex: number) => string;
  emptyMessage: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export interface TablePaginationProps {
  pagination: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  selectedCount: number;
}

export interface AdvancedFiltersPanelProps {
  advancedFilters: AdvancedFilter[];
  localAdvancedFilters: Record<string, string>;
  setLocalAdvancedFilters: (filters: Record<string, string>) => void;
  isLoading: boolean;
}

// Editing state type
export interface EditingState<T extends TableData> {
  rowId: string | number;
  key: keyof T;
}

// Local advanced filters type
export interface LocalAdvancedFilters {
  [key: string]: string;
}

// Status badge types
export type StatusKey =
  | 'active'
  | 'draft'
  | 'filled'
  | 'cancelled'
  | 'completed';

export interface StatusBadgeProps {
  status: string;
  config?: Partial<
    Record<StatusKey, { label: string; variant: StatusVariant }>
  >;
  icon?: ReactNode;
}

// Column settings type
export interface ColumnSetting {
  key: string;
  header: string;
  visible: boolean;
}
