import { useMemo } from 'react';
import { PaginationState, TableData } from '@/types/table';

interface UseTablePaginationReturn<T extends TableData> {
  normalizedPagination: PaginationState;
  paginatedData: T[];
}

export function useTablePagination<T extends TableData>(
  pagination: PaginationState | undefined,
  data: T[]
): UseTablePaginationReturn<T> {
  const normalizedPagination = useMemo((): PaginationState => {
    if (!pagination) {
      return {
        page: 1,
        pageSize: 10,
        total: data.length,
        last_page: 1,
      };
    }

    const page = Array.isArray(pagination.page)
      ? Number(pagination.page[0])
      : Number(pagination.page ?? 1);

    const pageSize = Array.isArray(pagination.pageSize)
      ? Number(pagination.pageSize[0])
      : Number(pagination.pageSize ?? 10);

    const total = Math.max(0, Number(pagination.total ?? data.length ?? 0));

    const last_page =
      pagination.last_page != null
        ? Math.max(1, Number(pagination.last_page))
        : Math.max(1, Math.ceil(total / pageSize));

    return {
      page: Math.max(1, page),
      pageSize: Math.max(1, pageSize),
      total,
      last_page,
    };
  }, [pagination, data.length]);

  const paginatedData = useMemo((): T[] => {
    const start =
      (normalizedPagination.page - 1) * normalizedPagination.pageSize;
    const end = start + normalizedPagination.pageSize;

    return data.slice(Math.max(0, start), Math.min(data.length, end));
  }, [data, normalizedPagination]);

  return {
    normalizedPagination,
    paginatedData,
  };
}
