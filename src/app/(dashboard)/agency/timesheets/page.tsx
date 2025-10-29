'use client';

import { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  PoundSterling,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/app/components/layout';
import { QuickActions, Badge, InteractiveStatsCard } from '@/app/components/ui';
import { DataTable, Column } from '@/app/components/ui/DataTable';
import {
  mockTimesheets,
  Timesheet,
  timesheetStats,
} from '@/app/mocks/timesheets';

// Status badge component
const StatusBadge = ({ status }: { status: Timesheet['status'] }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning' as const },
    approved: { label: 'Approved', variant: 'success' as const },
    rejected: { label: 'Rejected', variant: 'error' as const },
    disputed: { label: 'Disputed', variant: 'warning' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB');
};

// Format time
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const timesheetColumns: Column<Timesheet>[] = [
  {
    key: 'id',
    header: 'Timesheet ID',
    sortable: true,
    filterable: true,
    width: 'col-span-2',
  },
  {
    key: 'employeeName',
    header: 'Employee',
    sortable: true,
    filterable: true,
    width: 'col-span-2',
  },
  {
    key: 'employer',
    header: 'Employer',
    sortable: true,
    filterable: true,
    width: 'col-span-2',
  },
  {
    key: 'shiftDate',
    header: 'Shift Date',
    sortable: true,
    width: 'col-span-1',
    render: (value: string) => formatDate(value),
  },
  {
    key: 'clockIn',
    header: 'Clock In/Out',
    sortable: true,
    width: 'col-span-2',
    render: (value: string, row: Timesheet) => (
      <div className="text-sm">
        <div>{formatTime(row.clockIn)}</div>
        <div className="text-gray-500">{formatTime(row.clockOut)}</div>
      </div>
    ),
  },
  {
    key: 'totalHours',
    header: 'Hours',
    sortable: true,
    width: 'col-span-1',
    render: (value: number) => `${value}h`,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: 'col-span-1',
    render: (value: Timesheet['status']) => <StatusBadge status={value} />,
  },
  {
    key: 'totalAmount',
    header: 'Amount',
    sortable: true,
    width: 'col-span-1',
    render: (value: number) => formatCurrency(value),
  },
];

export default function TimesheetsPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: mockTimesheets.length,
  });

  const handleRowClick = (timesheet: Timesheet) => {
    // Navigate to timesheet detail page
    console.log('Navigate to timesheet:', timesheet.id);
    // router.push(`/agency/timesheets/${timesheet.id}`);
  };

  const handleSortChange = (sort: any) => {
    console.log('Sort changed:', sort);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  // Mock user for now - you'll replace this with your auth logic
  const user = { role: 'agency_admin' };

  // Click handlers for stats cards
  const handlePendingClick = () => {
    console.log('Navigate to pending timesheets');
    // Filter table to show only pending timesheets
  };

  const handleApprovedClick = () => {
    console.log('Navigate to approved timesheets');
    // Filter table to show only approved timesheets
  };

  const handleRejectedClick = () => {
    console.log('Navigate to rejected timesheets');
    // Filter table to show only rejected timesheets
  };

  const handleDisputedClick = () => {
    console.log('Navigate to disputed timesheets');
    // Filter table to show only disputed timesheets
  };

  const handleTotalValueClick = () => {
    console.log('Navigate to financial report');
    // Navigate to financial analytics
  };

  return (
    <div className="space-y-6">
      <PageHeader actions={<QuickActions userRole={user.role} />} />

      {/* Beautiful Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <InteractiveStatsCard
          title="Pending Approval"
          value={timesheetStats.pending}
          description="Awaiting your review"
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
          onClick={handlePendingClick}
        />
        <InteractiveStatsCard
          title="Approved"
          value={timesheetStats.approved}
          description="Successfully processed"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
          onClick={handleApprovedClick}
        />
        <InteractiveStatsCard
          title="Rejected"
          value={timesheetStats.rejected}
          description="Requires attention"
          icon={<XCircle className="h-5 w-5" />}
          variant="error"
          onClick={handleRejectedClick}
        />
        <InteractiveStatsCard
          title="Disputed"
          value={timesheetStats.disputed}
          description="Under investigation"
          icon={<AlertCircle className="h-5 w-5" />}
          variant="primary"
          onClick={handleDisputedClick}
        />
        <InteractiveStatsCard
          title="Total Value"
          value={formatCurrency(timesheetStats.totalAmount)}
          description="This month's revenue"
          icon={<PoundSterling className="h-5 w-5" />}
          variant="info"
          onClick={handleTotalValueClick}
        />
      </div>

      {/* Timesheets Table */}
      <DataTable<Timesheet>
        data={mockTimesheets}
        columns={timesheetColumns}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onRowClick={handleRowClick}
        emptyMessage="No timesheets found matching your criteria"
        className="mt-6"
      />
    </div>
  );
}
