import { JSX, useMemo, useCallback } from 'react';
import {
  DataTable,
  DataTableStatusBadge,
  formatCurrency,
  formatDate,
  Icon,
} from '@/app/components/ui';
import { Assignment, AssignmentFilters, Pagination } from '@/types';
import { TableData } from '@/types/table';

interface AssignmentsTableProps {
  data: Assignment[];
  pagination?: Pagination;
  filters: AssignmentFilters;
  loading?: boolean;
  onFiltersChange: (filters: AssignmentFilters) => void;
  onPaginationChange: (pagination: Pagination) => void;
  onRowClick?: (assignment: Assignment) => void;
}

interface FilterOption {
  value: string;
  label: string;
}

interface AdvancedFilter {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: FilterOption[];
  placeholder?: string;
}

const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TYPE_FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'temp', label: 'Temporary' },
  { value: 'direct', label: 'Direct' },
  { value: 'contract', label: 'Contract' },
];

const getAssignmentTypeClasses = (type: string): string => {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  switch (type) {
    case 'direct':
      return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-300 dark:border-purple-700`;
    case 'contract':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700`;
    default:
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700`;
  }
};

const getStatusBadgeConfig = (statusLabel: string) => ({
  active: {
    label: statusLabel,
    variant: 'success' as const,
    icon: <Icon name="activity" className="h-3 w-3" />,
  },
  paused: {
    label: statusLabel,
    variant: 'warning' as const,
    icon: <Icon name="pause" className="h-3 w-3" />,
  },
  completed: {
    label: statusLabel,
    variant: 'primary' as const,
    icon: <Icon name="checkCircle" className="h-3 w-3" />,
  },
  cancelled: {
    label: statusLabel,
    variant: 'error' as const,
    icon: <Icon name="xCircle" className="h-3 w-3" />,
  },
});

interface TableAssignment extends TableData {
  role: string;
  start_date: string;
  end_date?: string;
  is_ongoing: boolean;
  agreed_rate: number;
  markup_amount: number;
  status: string;
  status_label: string;
  assignment_type: string;
  assignment_type_label: string;
  contract_employer_name: string;
  employee_name: string;
  employee_position: string;
  location_name: string;
  agency_name: string;
}

const convertAssignmentToTableData = (
  assignment: Assignment
): TableAssignment => {
  return {
    id: assignment.id.toString(),
    role: assignment.role,
    start_date: assignment.start_date,
    end_date: assignment.end_date,
    is_ongoing: assignment.is_ongoing,
    agreed_rate: assignment.agreed_rate,
    markup_amount: assignment.markup_amount,
    status: assignment.status,
    status_label: assignment.status_label,
    assignment_type: assignment.assignment_type,
    assignment_type_label: assignment.assignment_type_label,
    contract_employer_name:
      assignment.contract?.employer?.name || 'Unknown Employer',
    employee_name:
      assignment.agency_employee?.employee?.user?.name || 'Unknown Employee',
    employee_position: assignment.agency_employee?.position || '',
    location_name: assignment.location?.name || 'Unknown Location',
    agency_name: assignment.agency_employee?.agency?.name || 'Unknown Agency',
  };
};

export function AssignmentsTable({
  data,
  pagination,
  filters,
  loading = false,
  onFiltersChange,
  onPaginationChange,
  onRowClick,
}: AssignmentsTableProps) {
  const tableData: TableAssignment[] = useMemo(
    () => data.map(convertAssignmentToTableData),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        key: 'role',
        header: 'Role',
        sortable: true,
        render: (value: unknown, row: TableAssignment) => (
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {String(value)}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {row.contract_employer_name}
            </div>
          </div>
        ),
      },
      {
        key: 'employee',
        header: 'Employee',
        sortable: true,
        render: (_: unknown, row: TableAssignment) => (
          <div className="min-w-0">
            <div className="font-medium text-gray-900">{row.employee_name}</div>
            {row.employee_position && (
              <div className="text-sm text-gray-500">
                {row.employee_position}
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'location',
        header: 'Location',
        sortable: true,
        render: (_: unknown, row: TableAssignment) => (
          <div className="text-sm text-gray-900">{row.location_name}</div>
        ),
      },
      {
        key: 'dates',
        header: 'Dates',
        sortable: true,
        sortKey: 'start_date',
        render: (_: unknown, row: TableAssignment) => (
          <div className="text-sm">
            <div className="text-gray-900">{formatDate(row.start_date)}</div>
            {row.end_date ? (
              <div className="text-gray-500">to {formatDate(row.end_date)}</div>
            ) : row.is_ongoing ? (
              <div className="text-green-600 font-medium">Ongoing</div>
            ) : null}
          </div>
        ),
      },
      {
        key: 'rates',
        header: 'Rates',
        sortable: true,
        sortKey: 'agreed_rate',
        render: (_: unknown, row: TableAssignment) => (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {formatCurrency(row.agreed_rate, 'GBP')}/hr
            </div>
            <div className="text-gray-500">
              Margin: {formatCurrency(row.markup_amount, 'GBP')}
            </div>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (value: unknown, row: TableAssignment) => (
          <div className="flex justify-center">
            <DataTableStatusBadge
              status={String(value)}
              config={getStatusBadgeConfig(row.status_label)}
            />
          </div>
        ),
      },
      {
        key: 'assignment_type',
        header: 'Type',
        sortable: true,
        render: (value: unknown, row: TableAssignment) => (
          <div className="flex justify-center">
            <span className={getAssignmentTypeClasses(String(value))}>
              {row.assignment_type_label}
            </span>
          </div>
        ),
      },
      {
        key: 'agency',
        header: 'Agency',
        sortable: false,
        render: (_: unknown, row: TableAssignment) => (
          <div className="text-sm text-gray-900">{row.agency_name}</div>
        ),
      },
    ],
    []
  );

  const advancedFilters: AdvancedFilter[] = useMemo(
    () => [
      {
        key: 'assignment_type',
        label: 'Assignment Type',
        type: 'select',
        options: TYPE_FILTER_OPTIONS,
      },
      {
        key: 'role',
        label: 'Role',
        type: 'text',
        placeholder: 'Filter by role...',
      },
      {
        key: 'agency_id',
        label: 'Agency',
        type: 'select',
        options: [],
      },
    ],
    []
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<AssignmentFilters>) => {
      onFiltersChange({
        ...filters,
        ...newFilters,
        page: 1,
      });
    },
    [filters, onFiltersChange]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      const validStatus =
        status === 'all' ? undefined : (status as AssignmentFilters['status']);
      handleFilterChange({ status: validStatus });
    },
    [handleFilterChange]
  );

  const handleSearch = useCallback(
    (search: string) => {
      handleFilterChange({ search: search || undefined });
    },
    [handleFilterChange]
  );

  const getRowClassName = useCallback(
    (row: TableData, rowIndex: number): string => {
      const assignment = row as TableAssignment;
      return assignment.is_ongoing ? 'bg-green-50 hover:bg-green-100' : '';
    },
    []
  );

  const handleRowClickWrapper = useCallback(
    (row: TableData) => {
      if (onRowClick) {
        const originalAssignment = data.find(
          (item) => item.id.toString() === row.id
        );
        if (originalAssignment) {
          onRowClick(originalAssignment);
        }
      }
    },
    [onRowClick, data]
  );

  return (
    <DataTable
      data={tableData}
      columns={columns}
      pagination={pagination}
      loading={loading}
      onFilterChange={handleFilterChange}
      onPaginationChange={onPaginationChange}
      onRowClick={handleRowClickWrapper}
      showSearch={true}
      showColumnSettings={true}
      statusFilterOptions={STATUS_FILTER_OPTIONS}
      advancedFilters={advancedFilters}
      selectable={true}
      title="Assignments"
      description="Manage and monitor all employee assignments"
      emptyMessage="No assignments found. Create your first assignment to get started."
      rowClassName={getRowClassName}
    />
  );
}
