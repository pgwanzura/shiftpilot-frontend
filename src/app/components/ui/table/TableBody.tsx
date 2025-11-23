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
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Icon 
            name="database" 
            className="h-8 w-8 text-gray-400 dark:text-gray-500" 
          />
        </div>
        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-3 px-4">
          No records found
        </h3>
        <p className="text-gray-500 dark:text-gray-500 text-base mb-6 px-4 max-w-md mx-auto leading-relaxed">
          {emptyMessage}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500"
          >
            <Icon name="filter-x" className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-900 min-w-full rounded-b-2xl shadow-sm"
      style={
        virtualScroll
          ? {
              height: totalHeight,
              transform: `translateY(${Math.min(scrollVelocity * 0.1, 20)}px)`,
            }
          : undefined
      }
    >
      {virtualScroll && <div style={{ height: startIndex * 58 }} />}
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
            <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 min-w-full animate-slide-down">
              <div className="px-8 py-6 min-w-0 border-l-2 border-indigo-400 bg-white/70 dark:bg-gray-900/70 ml-6 rounded-r-xl shadow-inner">
                {rowExpansion.render(row)}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      {virtualScroll && (
        <div style={{ height: (data.length - endIndex) * 58 }} />
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
  onHover,
  inlineEdit,
  actions,
  clickedRow,
}: TableRowProps<T>) {
  const isEditing = editingCell?.rowId === row.id;

  const getRowBackgroundColor = () => {
    if (clickedRow === rowIndex) return 'bg-blue-50/50 dark:bg-blue-900/20';
    if (rowIndex % 2 === 0) return 'bg-white dark:bg-gray-900';
    return 'bg-gray-50/30 dark:bg-gray-800/30';
  };

  const getRowBorder = () => {
    if (clickedRow === rowIndex) return 'border-l-4 border-blue-500';
    return 'border-l-0';
  };

  return (
    <div
      onMouseEnter={() => onHover(rowIndex)}
      onMouseLeave={() => onHover(null)}
      className={`group relative grid min-w-full py-5 text-sm transition-colors duration-150 border-b border-gray-100 dark:border-gray-800 last:border-b-0 min-w-fit ${getRowBorder()} ${getRowBackgroundColor()} ${
        rowIndex === 0 ? 'rounded-t-2xl' : ''
      }`}
      style={{
        gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, minmax(80px, 1fr))`,
      }}
    >
      {columns.map((column, index) => {
        const isCellEditing = isEditing && editingCell.key === column.key;
        const isFirstColumn = index === 0;
        const isLastColumn = index === columns.length - 1 && !actions;

        return (
          <div
            key={column.key as string}
            className={`flex items-center min-w-0 ${
              column.align === 'right'
                ? 'justify-end'
                : column.align === 'center'
                  ? 'justify-center'
                  : 'justify-start'
            } ${isFirstColumn ? 'pl-8' : 'pl-6'} ${isLastColumn ? 'pr-8' : 'pr-6'}`}
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
                className={`truncate font-normal ${
                  clickedRow === rowIndex
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                } ${
                  inlineEdit?.editable &&
                  column.key !== 'selection' &&
                  column.key !== 'expansion'
                    ? 'cursor-text rounded-lg px-3 py-2 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors'
                    : ''
                }`}
                onDoubleClick={() =>
                  inlineEdit?.editable &&
                  column.key !== 'selection' &&
                  column.key !== 'expansion' &&
                  onEditStart(row, column.key)
                }
                title={typeof row[column.key] === 'string' ? row[column.key] as string : undefined}
              >
                {column.render
                  ? column.render(row[column.key], row)
                  : (row[column.key] as React.ReactNode) || (
                      <span className="text-gray-400 dark:text-gray-500 italic text-sm">
                        —
                      </span>
                    )}
              </div>
            )}
          </div>
        );
      })}

      {actions && (
        <div className="flex justify-end min-w-0 pr-8 pl-6">
          <div className="flex items-center gap-3 opacity-80">
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
    inputRef.current?.select();
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
      <div className="flex items-center gap-3 w-full min-w-0 animate-scale-in">
        {renderEditor(value as T[keyof T], row, columnKey)}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={onSave}
            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors duration-150"
            title="Save"
          >
            <Icon name="check" className="h-4 w-4" />
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150"
            title="Cancel"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full min-w-0 animate-scale-in">
      <input
        ref={inputRef}
        type="text"
        value={value as string}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm w-full min-w-0 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-inner font-medium"
        placeholder="Enter value..."
      />
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors duration-150"
          title="Save"
        >
          <Icon name="check" className="h-4 w-4" />
        </button>
        <button
          onClick={onCancel}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150"
          title="Cancel"
        >
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}