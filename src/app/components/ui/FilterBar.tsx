'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Select } from '@/app/components/ui/forms';
import { Icon } from '@/app/components/ui';
import { Button } from '@/app/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  timeFilter: string;
  onTimeChange: (value: string) => void;
  onClearAll: () => void;
  statusOptions: Array<{ value: string; label: string }>;
  timeOptions: Array<{ value: string; label: string }>;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  timeFilter,
  onTimeChange,
  onClearAll,
  statusOptions,
  timeOptions,
}: FilterBarProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [localSearch, searchTerm, onSearchChange]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (timeFilter !== '30days') params.set('time', timeFilter);

    const query = params.toString();
    const url = query ? `?${query}` : '';

    router.replace(url, { scroll: false });
  }, [searchTerm, statusFilter, timeFilter, router]);

  const hasActiveFilters =
    localSearch !== '' || statusFilter !== 'all' || timeFilter !== '30days';

  const chipContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const chipItem = {
    hidden: { opacity: 0, scale: 0.8, y: 5 },
    show: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 5 },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3">
            <Icon name="filter" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <p className="text-sm text-gray-600">Refine your search results</p>
          </div>
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="primary-outline"
                size="md"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                onClick={onClearAll}
              >
                <Icon name="x" className="mr-1.5 h-4 w-4" />
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                name="search"
                className="text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              />
            </div>
            <Input
              name="search"
              type="text"
              className="pl-10 transition-all duration-200 border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Search candidates, positions, or emails..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <Select
            name="statusFilter"
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusChange}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            name="timeFilter"
            options={timeOptions}
            value={timeFilter}
            onChange={onTimeChange}
          />
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            variants={chipContainer}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="mt-6 pt-5 border-t border-gray-100"
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 flex items-center mr-2">
                <Icon
                  name="filter"
                  className="h-3 w-3 mr-1.5 text-indigo-500"
                />
                Active filters:
              </span>

              <AnimatePresence>
                {statusFilter !== 'all' && (
                  <motion.div
                    key="statusChip"
                    variants={chipItem}
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="group relative"
                  >
                    <span className="inline-flex items-center px-3 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 transition-all duration-200 hover:bg-indigo-100">
                      <Icon
                        name="tag"
                        className="mr-1.5 h-3 w-3 text-indigo-500"
                      />
                      {
                        statusOptions.find((opt) => opt.value === statusFilter)
                          ?.label
                      }
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1.5 p-0.5 hover:bg-indigo-200 rounded-full transition-all duration-150"
                        onClick={() => onStatusChange('all')}
                      >
                        <Icon name="x" className="h-3 w-3" />
                      </Button>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {timeFilter !== '30days' && (
                  <motion.div
                    key="timeChip"
                    variants={chipItem}
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="group relative"
                  >
                    <span className="inline-flex items-center px-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 transition-all duration-200 hover:bg-blue-100">
                      <Icon
                        name="clock"
                        className="mr-1.5 h-3 w-3 text-blue-500"
                      />
                      {
                        timeOptions.find((opt) => opt.value === timeFilter)
                          ?.label
                      }
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1.5 p-0.5 hover:bg-blue-200 rounded-full transition-all duration-150"
                        onClick={() => onTimeChange('30days')}
                      >
                        <Icon name="x" className="h-3 w-3" />
                      </Button>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {localSearch && (
                  <motion.div
                    key="searchChip"
                    variants={chipItem}
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="group relative"
                  >
                    <span className="inline-flex items-center px-3 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all duration-200 hover:bg-emerald-100">
                      <Icon
                        name="search"
                        className="mr-1.5 h-3 w-3 text-emerald-500"
                      />
                      {`"${localSearch}"`}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1.5 p-0.5 hover:bg-emerald-200 rounded-full transition-all duration-150"
                        onClick={() => setLocalSearch('')}
                      >
                        <Icon name="x" className="h-3 w-3" />
                      </Button>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
