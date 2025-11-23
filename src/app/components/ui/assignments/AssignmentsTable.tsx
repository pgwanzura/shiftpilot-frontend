import React, { JSX, useMemo, useCallback } from 'react';
import {
  DataTable,
  DataTableStatusBadge,
  formatCurrency,
  formatDate,
  Icon,
  Button,
} from '@/app/components/ui';
import {
  AssignmentFilters,
  Pagination,
  AssignmentStatus,
  AssignmentType,
} from '@/types';
import { TableData, Column, FilterState, StatusVariant } from '@/types/table';
import { IconName } from '@/config';

export interface AssignmentTableData extends TableData {
  role: string;
  start_date: string;
  end_date: string | null;
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
  expected_hours_per_week: string;
  pay_rate: number;
  can_be_updated: boolean;
  can_be_deleted: boolean;
  is_active: boolean;
  is_completed: boolean;
}

export interface Assignment {
  id: number | string;
  role: string;
  start_date: string;
  end_date?: string | null;
  is_ongoing: boolean;
  agreed_rate: number;
  markup_amount: number;
  status: string;
  status_label: string;
  assignment_type: string;
  assignment_type_label: string;
  contract?: { employer?: { name?: string } };
  agency_employee?: {
    employee?: { user?: { name?: string } };
    position?: string;
    agency?: { name?: string };
  };
  location?: { name?: string };
  expected_hours_per_week?: string;
  pay_rate?: number;
  can_be_updated?: boolean;
  can_be_deleted?: boolean;
  is_active?: boolean;
  is_completed?: boolean;
}

interface AssignmentsTableProps {
  data: Assignment[];
  pagination?: Pagination;
  filters: AssignmentFilters;
  loading?: boolean;
  onFiltersChange: (filters: AssignmentFilters) => void;
  onPaginationChange: (pagination: Pagination) => void;
  onRowClick?: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onPause?: (assignment: Assignment) => void;
  onResume?: (assignment: Assignment) => void;
  onViewDetails?: (assignment: Assignment) => void;
  onViewShifts?: (assignment: Assignment) => void;
}

interface StatusFilterOption {
  value: string;
  label: string;
}

interface TypeFilterOption {
  value: string;
  label: string;
}

interface AdvancedFilter {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: TypeFilterOption[];
  placeholder?: string;
}

const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TYPE_FILTER_OPTIONS: TypeFilterOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'temp', label: 'Temporary' },
  { value: 'direct', label: 'Direct' },
  { value: 'contract', label: 'Contract' },
];

const assignmentTypeClasses = new Map<string, string>([
  [
    'direct',
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  ],
  [
    'contract',
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  ],
  [
    'temp',
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300',
  ],
]);

const statusBadgeBase: Record<
  string,
  { label: string; variant: StatusVariant; icon: JSX.Element }
> = {
  active: {
    label: 'Active',
    variant: 'success',
    icon: <Icon name="activity" className="h-3 w-3" />,
  },
  paused: {
    label: 'Paused',
    variant: 'warning',
    icon: <Icon name="pause" className="h-3 w-3" />,
  },
  completed: {
    label: 'Completed',
    variant: 'primary',
    icon: <Icon name="checkCircle" className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'error',
    icon: <Icon name="xCircle" className="h-3 w-3" />,
  },
};

const convertAssignmentToTableData = (
  assignment: Assignment
): AssignmentTableData => ({
  id: String(assignment.id),
  role: assignment.role || '',
  start_date: assignment.start_date,
  end_date: assignment.end_date ?? null,
  is_ongoing: Boolean(assignment.is_ongoing),
  agreed_rate: Number(assignment.agreed_rate ?? 0),
  markup_amount: Number(assignment.markup_amount ?? 0),
  status: assignment.status ?? 'unknown',
  status_label: assignment.status_label ?? String(assignment.status ?? ''),
  assignment_type: assignment.assignment_type ?? 'unknown',
  assignment_type_label:
    assignment.assignment_type_label ??
    String(assignment.assignment_type ?? ''),
  contract_employer_name:
    assignment.contract?.employer?.name ?? 'Unknown Employer',
  employee_name:
    assignment.agency_employee?.employee?.user?.name ?? 'Unknown Employee',
  employee_position: assignment.agency_employee?.position ?? '',
  location_name: assignment.location?.name ?? 'Unknown Location',
  agency_name: assignment.agency_employee?.agency?.name ?? 'Unknown Agency',
  expected_hours_per_week: assignment.expected_hours_per_week ?? '0',
  pay_rate: Number(assignment.pay_rate ?? 0),
  can_be_updated: Boolean(assignment.can_be_updated),
  can_be_deleted: Boolean(assignment.can_be_deleted),
  is_active: Boolean(assignment.is_active),
  is_completed: Boolean(assignment.is_completed),
});

const convertToFilterState = (filters: AssignmentFilters): FilterState => ({
  search: filters.search,
  status: filters.status,
  assignment_type: filters.assignment_type,
  role: filters.role,
  agency: filters.agency,
  location: filters.location,
});

export function AssignmentsTable({
  data,
  pagination,
  filters,
  loading = false,
  onFiltersChange,
  onPaginationChange,
  onRowClick,
  onEdit,
  onPause,
  onResume,
  onViewDetails,
  onViewShifts,
}: AssignmentsTableProps): JSX.Element {
  const tableData = useMemo(
    () => data.map(convertAssignmentToTableData),
    [data]
  );

  const assignmentMap = useMemo(
    () => Object.fromEntries(data.map((a) => [String(a.id), a])),
    [data]
  );

  const statusConfigs = useMemo(() => statusBadgeBase, []);

  const ActionIcon = useCallback(
    ({
      name,
      title,
      onClick,
      extraClass,
    }: {
      name: IconName;
      title: string;
      onClick?: () => void;
      extraClass?: string;
    }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onClick?.();
        }}
        title={title}
        className={['h-8 w-8 p-0 flex items-center justify-center', extraClass]
          .filter(Boolean)
          .join(' ')}
      >
        <Icon name={name} className="h-3.5 w-3.5" />
      </Button>
    ),
    []
  );

  const getAssignmentActions = useCallback(
    (assignment: AssignmentTableData) => {
      const original = assignmentMap[assignment.id];
      if (!original) return null;
      const buttons: JSX.Element[] = [];
      buttons.push(
        <ActionIcon
          key="view"
          name="eye"
          title="View assignment details"
          onClick={() => onViewDetails?.(original)}
        />
      );
      buttons.push(
        <ActionIcon
          key="shifts"
          name="calendar"
          title="View shifts"
          onClick={() => onViewShifts?.(original)}
        />
      );
      if (assignment.can_be_updated) {
        buttons.push(
          <ActionIcon
            key="edit"
            name="edit"
            title="Edit assignment"
            onClick={() => onEdit?.(original)}
          />
        );
      }
      if (assignment.is_active && !assignment.is_completed) {
        if (assignment.status === 'active') {
          buttons.push(
            <ActionIcon
              key="pause"
              name="pause"
              title="Pause assignment"
              extraClass="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              onClick={() => onPause?.(original)}
            />
          );
        } else if (assignment.status === 'paused') {
          buttons.push(
            <ActionIcon
              key="resume"
              name="play"
              title="Resume assignment"
              extraClass="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
              onClick={() => onResume?.(original)}
            />
          );
        }
      }
      return (
        <div className="flex flex-wrap items-center justify-end gap-1 min-w-[120px] max-w-[140px]">
          {buttons}
        </div>
      );
    },
    [
      ActionIcon,
      assignmentMap,
      onEdit,
      onPause,
      onResume,
      onViewDetails,
      onViewShifts,
    ]
  );

  const RoleCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined,
      row: AssignmentTableData
    ) => (
      <div className="min-w-0">
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {String(value)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {row.contract_employer_name}
        </div>
      </div>
    ),
    []
  );

  const EmployeeCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined,
      row: AssignmentTableData
    ) => (
      <div className="min-w-0">
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {String(value)}
        </div>
        {row.employee_position && (
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {row.employee_position}
          </div>
        )}
      </div>
    ),
    []
  );

  const LocationCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined
    ) => (
      <div className="text-sm text-gray-900 dark:text-white truncate">
        {String(value)}
      </div>
    ),
    []
  );

  const DatesCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined,
      row: AssignmentTableData
    ) => (
      <div className="text-sm min-w-0">
        <div className="text-gray-900 dark:text-white truncate">
          {formatDate(String(value))}
        </div>
        {row.end_date ? (
          <div className="text-gray-500 dark:text-gray-400 truncate">
            to {formatDate(row.end_date)}
          </div>
        ) : row.is_ongoing ? (
          <div className="text-green-600 dark:text-green-400 font-medium truncate">
            Ongoing
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 italic truncate">
            No end date
          </div>
        )}
      </div>
    ),
    []
  );

  const RatesCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined,
      row: AssignmentTableData
    ) => (
      <div className="text-sm min-w-0">
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {formatCurrency(Number(value), 'GBP')}/hr
        </div>
        <div className="text-gray-500 dark:text-gray-400 truncate">
          Margin: {formatCurrency(row.markup_amount, 'GBP')}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {row.expected_hours_per_week}h/week
        </div>
      </div>
    ),
    []
  );

  const StatusCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined
    ) => {
      const status = String(value);
      const config = statusConfigs[status] ?? {
        label: status,
        variant: 'primary' as StatusVariant,
      };

      return (
        <div className="flex justify-center">
          <DataTableStatusBadge status={status} config={{ [status]: config }} />
        </div>
      );
    },
    [statusConfigs]
  );

  const TypeCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined,
      row: AssignmentTableData
    ) => (
      <div className="flex justify-center">
        <span
          className={
            assignmentTypeClasses.get(String(value)) ??
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
          }
        >
          {row.assignment_type_label}
        </span>
      </div>
    ),
    []
  );

  const AgencyCell = useCallback(
    (
      value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[]
        | null
        | undefined
    ) => (
      <div className="text-sm text-gray-900 dark:text-white truncate">
        {String(value)}
      </div>
    ),
    []
  );

  const columns: Column<AssignmentTableData>[] = useMemo(
    () => [
      {
        key: 'role',
        header: 'Role & Employer',
        sortable: true,
        width: 'minmax(200px, 1fr)',
        render: RoleCell,
      },
      {
        key: 'employee_name',
        header: 'Employee',
        sortable: true,
        width: 'minmax(150px, 1fr)',
        render: EmployeeCell,
      },
      {
        key: 'location_name',
        header: 'Location',
        sortable: true,
        width: 'minmax(120px, 1fr)',
        render: LocationCell,
      },
      {
        key: 'start_date',
        header: 'Dates',
        sortable: true,
        width: 'minmax(140px, 1fr)',
        render: DatesCell,
      },
      {
        key: 'agreed_rate',
        header: 'Rates & Margin',
        sortable: true,
        width: 'minmax(140px, 1fr)',
        render: RatesCell,
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        width: 'minmax(120px, 1fr)',
        render: StatusCell,
      },
      {
        key: 'assignment_type',
        header: 'Type',
        sortable: true,
        width: 'minmax(120px, 1fr)',
        render: TypeCell,
      },
      {
        key: 'agency_name',
        header: 'Agency',
        sortable: true,
        width: 'minmax(120px, 1fr)',
        render: AgencyCell,
      },
    ],
    [
      RoleCell,
      EmployeeCell,
      LocationCell,
      DatesCell,
      RatesCell,
      StatusCell,
      TypeCell,
      AgencyCell,
    ]
  );

  const advancedFilters: AdvancedFilter[] = useMemo(
    () => [
      {
        key: 'assignment_type',
        label: 'Assignment Type',
        type: 'select',
        options: TYPE_FILTER_OPTIONS.filter((opt) => opt.value !== 'all'),
      },
      {
        key: 'role',
        label: 'Role',
        type: 'text',
        placeholder: 'Filter by role...',
      },
      {
        key: 'agency',
        label: 'Agency',
        type: 'text',
        placeholder: 'Filter by agency...',
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'Filter by location...',
      },
    ],
    []
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      const assignmentFilters: AssignmentFilters = {
        search: newFilters.search || undefined,
        status: (newFilters.status as AssignmentStatus) || undefined,
        assignment_type:
          (newFilters.assignment_type as AssignmentType) || undefined,
        role: newFilters.role || undefined,
        agency: newFilters.agency || undefined,
        location: newFilters.location || undefined,
        page: 1,
      };
      onFiltersChange(assignmentFilters);
    },
    [onFiltersChange]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      const validStatus =
        status === 'all' ? undefined : (status as AssignmentStatus);
      handleFilterChange({
        ...convertToFilterState(filters),
        status: validStatus,
      });
    },
    [filters, handleFilterChange]
  );

  const handleSearch = useCallback(
    (search: string) => {
      handleFilterChange({
        ...convertToFilterState(filters),
        search: search || undefined,
      });
    },
    [filters, handleFilterChange]
  );

  const getRowClassName = useCallback((row: AssignmentTableData) => {
    if (row.status === 'completed')
      return 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50';
    if (row.status === 'paused')
      return 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
    if (row.status === 'active' && row.is_ongoing)
      return 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30';
    return '';
  }, []);

  const handleRowClickWrapper = useCallback(
    (row: TableData) => {
      if (!onRowClick) return;
      const original = assignmentMap[row.id];
      if (original) onRowClick(original);
    },
    [onRowClick, assignmentMap]
  );

  const currentStatus = useMemo(
    () => filters.status ?? 'all',
    [filters.status]
  );

  const tableFilters = useMemo(() => convertToFilterState(filters), [filters]);

  return (
    <DataTable
      data={tableData}
      columns={columns}
      pagination={pagination}
      filters={tableFilters}
      loading={loading}
      onFilterChange={handleFilterChange}
      onPaginationChange={onPaginationChange}
      onRowClick={handleRowClickWrapper}
      showSearch={true}
      showColumnSettings={true}
      statusFilterOptions={STATUS_FILTER_OPTIONS}
      currentStatus={currentStatus}
      onStatusChange={handleStatusChange}
      advancedFilters={advancedFilters}
      selectable={true}
      title="Assignments"
      description="Manage and monitor all employee assignments"
      emptyMessage="No assignments found. Create your first assignment to get started."
      rowClassName={getRowClassName}
      onSearch={handleSearch}
      actions={getAssignmentActions}
    />
  );
}
