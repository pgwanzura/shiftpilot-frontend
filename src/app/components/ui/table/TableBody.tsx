import React from 'react';
import {
  TableData,
  Column,
  TableState,
  InlineEditConfig,
  RowExpansionConfig,
} from '@/types/table';
import { Icon } from '@/app/components/ui';

interface TableBodyProps<T extends TableData> {
  data: T[];
  columns: Column<T>[];
  state: TableState;
  virtualScroll: boolean;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  scrollVelocity: number;
  actions?: (row: T) => React.ReactNode;
  rowExpansion?: RowExpansionConfig<T>;
  inlineEdit?: InlineEditConfig<T>;
  editingCell: { rowId: string | number; key: keyof T } | null;
  editValue: T[keyof T] | undefined;
  onEditStart: (row: T, key: keyof T) => void;
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

export function TableBody<T extends TableData>({
  data,
  columns,
  state,
  virtualScroll,
  totalHeight,
  startIndex,
  endIndex,
  scrollVelocity,
  actions,
  rowExpansion,
  inlineEdit,
  editingCell,
  editValue,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditValueChange,
  hoveredRow,
  onHover,
  clickedRow,
  rowClassName,
  emptyMessage,
  hasActiveFilters,
  onClearFilters,
}: TableBodyProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto mb-3">
          <Icon name="search" className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4 px-4">
          {emptyMessage}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-900 min-w-full transition-all duration-300"
      style={
        virtualScroll
          ? {
              height: totalHeight,
              transform: `translateY(${Math.min(scrollVelocity * 0.1, 20)}px)`,
            }
          : undefined
      }
    >
      {virtualScroll && <div style={{ height: startIndex * 53 }} />}
      {data.map((row, rowIndex) => (
        <React.Fragment key={row.id}>
          <TableRow
            row={row}
            rowIndex={rowIndex}
            columns={columns}
            editingCell={editingCell}
            editValue={editValue}
            onEditStart={onEditStart}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            onEditValueChange={onEditValueChange}
            hoveredRow={hoveredRow}
            onHover={onHover}
            inlineEdit={inlineEdit}
            rowClassName={rowClassName}
            actions={actions}
            clickedRow={clickedRow}
          />
          {rowExpansion && state.expandedRows.has(row.id) && (
            <div className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-full animate-slide-down">
              <div className="px-6 py-4 min-w-0">
                {rowExpansion.render(row)}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      {virtualScroll && (
        <div style={{ height: (data.length - endIndex) * 53 }} />
      )}
    </div>
  );
}

interface TableRowProps<T extends TableData> {
  row: T;
  rowIndex: number;
  columns: Column<T>[];
  editingCell: { rowId: string | number; key: keyof T } | null;
  editValue: T[keyof T] | undefined;
  onEditStart: (row: T, key: keyof T) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditValueChange: (value: T[keyof T]) => void;
  hoveredRow: number | null;
  onHover: (index: number | null) => void;
  inlineEdit?: InlineEditConfig<T>;
  rowClassName?: (row: T, rowIndex: number) => string;
  actions?: (row: T) => React.ReactNode;
  clickedRow: number | null;
}

function TableRow<T extends TableData>({
  row,
  rowIndex,
  columns,
  editingCell,
  editValue,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditValueChange,
  hoveredRow,
  onHover,
  inlineEdit,
  actions,
  clickedRow,
}: TableRowProps<T>) {
  const isEditing = editingCell?.rowId === row.id;

  const getRowBorderColor = () => {
    if (hoveredRow === rowIndex) return 'border-l-indigo-500';
    if (rowIndex % 2 === 0) return 'border-l-gray-50 dark:border-l-gray-800';
    return 'border-l-gray-100 dark:border-l-gray-700';
  };

  const getRowBackgroundColor = () => {
    if (hoveredRow === rowIndex) return 'bg-indigo-50 dark:bg-indigo-900/20';
    if (rowIndex % 2 === 0) return 'bg-white dark:bg-gray-900';
    return 'bg-gray-50 dark:bg-gray-800';
  };

  return (
    <div
      onMouseEnter={() => onHover(rowIndex)}
      onMouseLeave={() => onHover(null)}
      className={`group relative grid min-w-full py-4 text-sm transition-all duration-300 border-b border-gray-100 dark:border-gray-700 last:border-b-0 min-w-fit border-l-4 ${getRowBorderColor()} ${getRowBackgroundColor()} ${
        clickedRow === rowIndex
          ? 'animate-pulse bg-indigo-100 dark:bg-indigo-900/30'
          : ''
      }`}
      style={{
        gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, minmax(80px, 1fr))`,
        animationDelay: `${rowIndex * 20}ms`,
      }}
    >
      {columns.map((column, index) => {
        const isCellEditing = isEditing && editingCell.key === column.key;
        const isFirstColumn = index === 0;
        const isLastColumn = index === columns.length - 1 && !actions;

        return (
          <div
            key={column.key as string}
            className={`flex items-center transition-all duration-300 min-w-0 ${
              column.align === 'right'
                ? 'justify-end'
                : column.align === 'center'
                  ? 'justify-center'
                  : 'justify-start'
            } ${isFirstColumn ? 'pl-6' : 'pl-3'} ${isLastColumn ? 'pr-6' : 'pr-3'}`}
          >
            {isCellEditing && inlineEdit ? (
              <InlineEditor
                value={editValue}
                onChange={onEditValueChange}
                onSave={onEditSave}
                onCancel={onEditCancel}
                renderEditor={inlineEdit.renderEditor}
                row={row}
                columnKey={column.key}
              />
            ) : (
              <div
                className={`truncate font-medium transition-all duration-300 ${
                  hoveredRow === rowIndex
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                } ${
                  inlineEdit?.editable &&
                  column.key !== 'selection' &&
                  column.key !== 'expansion'
                    ? 'cursor-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1'
                    : ''
                }`}
                onDoubleClick={() =>
                  inlineEdit?.editable &&
                  column.key !== 'selection' &&
                  column.key !== 'expansion' &&
                  onEditStart(row, column.key)
                }
              >
                {column.render
                  ? column.render(row[column.key], row)
                  : (row[column.key] as React.ReactNode) || (
                      <span className="text-gray-400 dark:text-gray-500 italic">
                        —
                      </span>
                    )}
              </div>
            )}
          </div>
        );
      })}

      {actions && (
        <div className="flex justify-end min-w-0 pr-6 pl-3">
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${
              hoveredRow === rowIndex ? 'opacity-100' : 'opacity-70'
            }`}
          >
            {actions(row)}
          </div>
        </div>
      )}
    </div>
  );
}

interface InlineEditorProps<T extends TableData> {
  value: T[keyof T] | undefined;
  onChange: (value: T[keyof T]) => void;
  onSave: () => void;
  onCancel: () => void;
  renderEditor?: (value: T[keyof T], row: T, key: keyof T) => React.ReactNode;
  row: T;
  columnKey: keyof T;
}

function InlineEditor<T extends TableData>({
  value,
  onChange,
  onSave,
  onCancel,
  renderEditor,
  row,
  columnKey,
}: InlineEditorProps<T>) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSave();
    if (e.key === 'Escape') onCancel();
  };

  const handleChange = (newValue: string) => {
    onChange(newValue as T[keyof T]);
  };

  if (renderEditor) {
    return (
      <div className="flex items-center gap-2 w-full min-w-0 animate-scale-in">
        {renderEditor(value as T[keyof T], row, columnKey)}
        <button
          onClick={onSave}
          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-all duration-200 transform hover:scale-110"
        >
          <Icon name="check" className="h-3 w-3" />
        </button>
        <button
          onClick={onCancel}
          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200 transform hover:scale-110"
        >
          <Icon name="x" className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full min-w-0 animate-scale-in">
      <input
        ref={inputRef}
        type="text"
        value={value as string}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full min-w-0 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 outline-none transition-all duration-200 transform focus:scale-105 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <button
        onClick={onSave}
        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-all duration-200 transform hover:scale-110"
      >
        <Icon name="check" className="h-3 w-3" />
      </button>
      <button
        onClick={onCancel}
        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200 transform hover:scale-110"
      >
        <Icon name="x" className="h-3 w-3" />
      </button>
    </div>
  );
}
