import { Search, ChevronDown, Filter } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
}

export default function Filters({
  searchQuery,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Search input */}
        <div className="relative mb-4 md:mb-0 md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search references..."
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-3">
          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Types</option>
              <option>Manager</option>
              <option>Peer</option>
              <option>Direct Report</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Filter button */}
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
