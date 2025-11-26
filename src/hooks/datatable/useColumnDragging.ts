import { useState, useCallback } from 'react';
import { TableState, UseColumnDraggingReturn } from '@/types';

type TableStateUpdate = (updates: Partial<TableState>) => void;

export function useColumnDragging(
  columnOrder: string[],
  updateState: TableStateUpdate
): UseColumnDraggingReturn {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, columnKey: string): void => {
      setDraggedColumn(columnKey);
      e.dataTransfer.effectAllowed = 'move';
      e.currentTarget.style.opacity = '0.4';
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetColumnKey: string): void => {
      e.preventDefault();
      if (!draggedColumn || draggedColumn === targetColumnKey) return;

      const targetIndex = columnOrder.indexOf(targetColumnKey);
      setDragOverIndex(targetIndex);
      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';

      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);
      updateState({ columnOrder: newOrder });
    },
    [draggedColumn, columnOrder, updateState]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.currentTarget.style.background = '';
      setDragOverIndex(null);
    },
    []
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.currentTarget.style.opacity = '';
      e.currentTarget.style.background = '';
      setDraggedColumn(null);
      setDragOverIndex(null);
    },
    []
  );

  return {
    draggedColumn,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
  };
}
